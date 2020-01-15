## Translation
 
### Uploading translations keys to crowdin
Run script `infrastructure/crowdin/upload.sh`
See the script for usage details.

For instance:
```shell
./infrastructure/crowdin/upload.sh --branch=master --crowdin-api-key=<key> 
```
Translations keys will be updated to crowdin in `master/web-components/<web component name>` folder

### Downloading translations from crowdin

Run script `infrastructure/crowdin/download.sh`
See the script for usage details.

For instance:
```shell
./infrastructure/crowdin/download.sh --crowdin-api-key=<key> --github-api-key=<key> --branch=master
```

This will download translations, copy them in the web components `src/i18n` directories, and create a Pull Request if any changes.

