#!/bin/bash

usage() {
    command=$(basename "$0")
    echo ""
    echo -e "SYNOPSIS"
    echo -e "  $command --crowdin-api-key=<key> --github-api-key=<key> [--branch=<branch name>] [--crowdin-project=<project>]"
    echo -e "  $command --help"
    echo ""
    echo -e "DESCRIPTION"
    echo "  Downloads translation from crowdin, integrate them to web-components source code and create a pull request with changes"
    echo ""
    echo -e "ARGUMENTS"
    echo "  --crowdin-api-key   the crowdin api key of crowdin project"
    echo "  --github-api-key    the github api key of currently logged in user"
    echo "  --web-component     web component name for which files will be uploaded"
    echo ""
    echo -e "OPTIONS"
    echo "  --crowdin-project   the targeted crowdin project (default: bonita-bpm)"
    echo "  --branch            the branch on which download translation keys (default: current branch)"
    echo "  --help              display this help"
    echo ""
    exit 1
}

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
BASE_DIR=$SCRIPT_DIR/..

CROWDIN_PROJECT="bonita-bpm"
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
for i in "$@"; do
    case $i in
        --crowdin-api-key=*)
        CROWDINKEY="${i#*=}"
        shift
        ;;
        --github-api-key=*)
        GITHUBKEY="${i#*=}"
        shift
        ;;
        --branch=*)
        BRANCH_NAME="${i#*=}"
        shift
        ;;
        --crowdin-project=*)
        CROWDIN_PROJECT="${i#*=}"
        shift
        ;;
        --web-component=*)
        WC="${i#*=}"
        shift
        ;;
         --help)
        usage
        ;;
    esac
done
BUILD_DIR=$BASE_DIR/packages/$WC/build
if [ -z "$CROWDINKEY" ]; then
  echo "ERROR crowdin API key is needed";
  usage;
  exit 1
fi
if [ -z "$GITHUBKEY" ]; then
  echo "ERROR github API key is needed";
  usage;
  exit 1
fi
if [ -z "$WC" ]; then
  echo "ERROR: web component name is required";
  usage;
fi
if [ ! -d "$BASE_DIR/packages/$WC" ]; then
  echo "Error: $BASE_DIR/packages/$WC directory does not exist";
  usage;
fi
if [ ! -d "$BUILD_DIR" ]; then
  echo "Error: $BUILD_DIR directory does not exist";
  usage;
fi


# $1 github API Key
pull_request() {
  PR="{\"title\": \"[${BRANCH_NAME}] Translations update\", \"head\": \"feat/${BRANCH_NAME}/update-translations\", \"base\": \"${BRANCH_NAME}\"}"
  echo "Create new pull request $PR"

  curl -i -X POST -d "$PR" \
     https://api.github.com/repos/bonitasoft/bonita-ui-designer-sp/pulls?access_token="$1"
}

echo "***********************************************************************************"
echo "WEB COMPONENT '$WC' TRANSLATION DOWNLOAD"
echo "***********************************************************************************"

echo "Downloading translations..."
curl --output "$BUILD_DIR"/all.zip https://api.crowdin.com/api/project/"$CROWDIN_PROJECT"/download/all.zip?key="$CROWDINKEY"
unzip -o "$BUILD_DIR"/crowdin/all.zip -d "$BUILD_DIR"

echo "Copying downloaded translations in source dir..."
# shellcheck disable=SC2045
# shellcheck disable=SC2035
for langdir in $(ls -d */)
do
  # Remove trailer '/'
  lang=${langdir%%/}
  cp "$BUILD_DIR"/"$lang"/"$BRANCH_NAME"/web-components/"$WC"/messages.json "$BASE_DIR"/packages/"$WC"/src/i18n/"$lang".json
done

git checkout -B feat/"$BRANCH_NAME"/update-translations

# Count modified lines except those containing "PO-Revision-Date"
# When only "PO-Revision-Date" has been changed in each files, we do not create PR since no translations has been updated
modifiedlines=$(git diff --word-diff --unified=0 | grep -Ev "^diff --git|^index|^\+\+\+|^---|^@@|PO-Revision-Date" | wc -l)
if [ "$modifiedlines" -gt 0 ]
then
   git commit -a -m "chore(l10n) update translations"
   git push origin feat/"$BRANCH_NAME"/update-translations --force

    pull_request "$GITHUBKEY"
else
    echo "No changes. Translation update PR not created"
fi
