#!/bin/bash

usage() {
  command=$(basename $0)
  echo ""
  echo -e "SYNOPSIS"
  echo -e "    $command --crowdin-api-key=<key> [--branch=<branch>] [--crowdin-project=<project>] [--upload-translations]"
  echo ""
  echo -e "DESCRIPTION"
  echo "  Upload translation keys to crowdin in the specified crowdin project and specified branch"
  echo ""
  echo -e "ARGUMENTS"
  echo -e "  --crowdin-api-key=key    Crowdin api key for the specified project"
  echo ""
  echo -e "OPTIONS"
  echo -e "  --branch                 Crowdin branch on which we want to upload keys (default: current branch)"
  echo -e "  --upload-translations    Also upload local translations to crowdin"
  echo -e "  --crowdin-project        Crowdin project on which files will be uploaded (default: bonita)"
  echo -e "  --help                   display this help"
  echo ""
  exit 1;
}

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
BASE_DIR=$SCRIPT_DIR/../..

PROJECT="bonita"
UPLOAD_TRANS=false
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
for i in "$@"; do
    case $i in
        --crowdin-api-key=*)
        CROWDINKEY="${i#*=}"
        shift
        ;;
        --upload-translations)
        UPLOAD_TRANS=true
        shift
        ;;
        --branch=*)
        BRANCH_NAME="${i#*=}"
        shift
        ;;
        --crowdin-project=*)
        PROJECT="${i#*=}"
        shift
        ;;
         --help)
        usage
        exit 0
        ;;
    esac
done

if [ -z "$CROWDINKEY" ]; then
  echo "ERROR: crowdin API key is required";
  usage;
fi

# $1 files
# #2 branch
# $3 export_pattern
upload_sources() {
  # add file in case it does not exists yet
 curl --silent -o /dev/null -F "$1" -F "$2" -F "$3" https://api.crowdin.com/api/project/$PROJECT/add-file?key=$CROWDINKEY

  # update file
 curl -F "$1" -F "$2" -F "$3" https://api.crowdin.com/api/project/$PROJECT/update-file?key=$CROWDINKEY
}

# $1 directory path
add_crowdin_directory() {
  curl --silent -o /dev/null -F "name=$1" https://api.crowdin.com/api/project/$PROJECT/add-directory?key=$CROWDINKEY
}

# $1 web component name
# $2 target language
upload_translations() {
  wc=$1
  lang=$2
  JSON_FILE="$BASE_DIR"/packages/$wc/src/i18n/$lang.json
  if [ ! -f "$JSON_FILE" ]; then
    echo "Warning: json file $JSON_FILE does not exist";
    return;
  fi

  echo "Uploading '$wc' $lang translation to '$PROJECT' crowdin project ..."

  curl -F "files[web-components/$wc/messages.json]=@$JSON_FILE" \
       -F "language=$lang" \
       -F "auto_approve_imported=1" \
       -F "import_duplicates=1" \
       -F "import_eq_suggestions=1" \
       -F "branch=$BRANCH_NAME" \
	  https://api.crowdin.com/api/project/$PROJECT/upload-translation?key=$CROWDINKEY
}

echo "***********************************************************************************"
echo "WEB COMPONENT TRANSLATION UPLOAD"
echo "***********************************************************************************"

cd "$BASE_DIR" || exit

add_crowdin_directory "$BRANCH_NAME/web-components"

cd "packages" || exit
# shellcheck disable=SC2045
# shellcheck disable=SC2035
# web components are in (1-level) sub-directories
for wcdir in $(find . -type d -mindepth 2 -maxdepth 2)
do
  ## Remove './' prefix
  wcdir=${wcdir##./}
  add_crowdin_directory "$BRANCH_NAME/web-components/$wcdir"
  echo "Uploading '$wcdir' web component json translation file to '$PROJECT' crowdin project ..."
  upload_sources \
    "files[web-components/$wcdir/messages.json]=@$wcdir/src/i18n/en.json" \
    "branch=$BRANCH_NAME" \
    "exports_pattern=[web-components/$wcdir/messages.json]=/$wcdir/src/i18n/%locale%.json"

  if [ "$UPLOAD_TRANS" = true ]
  then
    upload_translations "$wc" fr
    upload_translations "$wc" es
    upload_translations "$wc" ja
    upload_translations "$wc" pt-BR
  fi

done

