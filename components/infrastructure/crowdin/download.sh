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
    echo ""
    echo -e "OPTIONS"
    echo "  --crowdin-project   the targeted crowdin project (default: bonita)"
    echo "  --branch            the branch on which download translation keys (default: current branch)"
    echo "  --help              display this help"
    echo ""
    exit 1
}

# Supported languages for web components
languages=("fr" "es-ES" "ja" "pt-BR")

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
BASE_DIR=$SCRIPT_DIR/../..

CROWDIN_PROJECT="bonita"
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
         --help)
        usage
        ;;
    esac
done
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


# $1 github API Key
pull_request() {
  PR="{\"title\": \"[${BRANCH_NAME}] Translations update\", \"head\": \"feat/${BRANCH_NAME}/update-translations\", \"base\": \"${BRANCH_NAME}\"}"
  echo "Create new pull request $PR"

  curl -i -X POST -d "$PR" \
     https://api.github.com/repos/bonitasoft/bonita-ui-designer-sp/pulls?access_token="$1"
}

echo "***********************************************************************************"
echo "WEB COMPONENTS TRANSLATION DOWNLOAD"
echo "***********************************************************************************"

echo "Downloading translations..."
CROWDIN_DOWNLOAD_DIR="$BASE_DIR"/crowdin
mkdir "$CROWDIN_DOWNLOAD_DIR"
curl --output "$CROWDIN_DOWNLOAD_DIR"/all.zip https://api.crowdin.com/api/project/"$CROWDIN_PROJECT"/download/all.zip?key="$CROWDINKEY"
unzip -o "$CROWDIN_DOWNLOAD_DIR"/all.zip -d "$CROWDIN_DOWNLOAD_DIR"

echo "Copying downloaded translations in source dir..."
cd "$BASE_DIR"/packages || exit

# shellcheck disable=SC2045
# shellcheck disable=SC2035

# Loop on web components
for wcdir in $(ls -d */)
do
  # Remove trailer '/'
  wc=${wcdir%%/}
  cd "$CROWDIN_DOWNLOAD_DIR" || exit
  # Loop on langs
  for lang in "${languages[@]}"
  do
    cp "$CROWDIN_DOWNLOAD_DIR"/"$lang"/"$BRANCH_NAME"/web-components/"$wc"/messages.json "$BASE_DIR"/packages/"$wc"/src/i18n/"$lang".json
  done
done
rm -rf "$CROWDIN_DOWNLOAD_DIR"
cd "$BASE_DIR" || exit

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
