#!/bin/bash

usage() {
  command=$(basename $0)
  echo ""
  echo -e "SYNOPSIS"
  echo -e "    $command --component=<component> --releaseType=<releaseType> [--git-push]"
  echo ""
  echo -e "DESCRIPTION"
  echo "  Release component version, create commit and tag for new version"
  echo ""
  echo -e "ARGUMENTS"
  echo -e "  --releaseType=releaseType    one of patch, minor, major, prepatch, preminor, premajor, prerelease"
  echo -e "  --component=component      component to release"
  echo ""
  echo -e "OPTIONS"
  echo -e "  --git-push               Push commit and tag on github (default: false)"
  echo -e "  --help                   display this help"
  echo ""
  exit 1;
}

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
BASE_DIR=$SCRIPT_DIR/..

for i in "$@"; do
    case $i in
        --releaseType=*)
        RELEASETYPE="${i#*=}"
        shift
        ;;
        --component=*)
        COMPONENT="${i#*=}"
        shift
        ;;
        --git-push)
        GIT_PUSH=true
        shift
        ;;
         --help)
        usage
        ;;
    esac
done

if [ -z "$RELEASETYPE" ]; then
  echo "ERROR: --releaseType is required";
  usage;
fi

if [ -z "$COMPONENT" ]; then
  echo "ERROR: --component is required";
  usage;
fi

cd "$BASE_DIR/packages/$COMPONENT" || exit

## Release component and get new version
SEMVER_VERSION=$(npm version $RELEASETYPE)
SEMVER_VERSION=${SEMVER_VERSION:1}

# Commit and push release
git commit -a -m "$COMPONENT: release packages v$SEMVER_VERSION"
git tag "$COMPONENT@$SEMVER_VERSION" -m "$COMPONENT@$SEMVER_VERSION: release packages v$SEMVER_VERSION"

## Push commit and tag
if [ "$GIT_PUSH" = true ]
then
  git push origin "$COMPONENT@$SEMVER_VERSION"
fi

echo "Release $COMPONENT@$SEMVER_VERSION success !";