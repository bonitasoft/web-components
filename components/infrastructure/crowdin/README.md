## Translation
 
### Uploading translations keys to crowdin
Run script `infrastructure/crowdin/upload.sh`
See the script for usage details.

For instance, for pagination-selector web component:
```shell
./infrastructure/crowdin/upload.sh --branch=master --crowdin-api-key=<key> --web-component=pagination-selector
```
Translations keys will be updated to crowdin in `master/web-components/pagination-selector` folder

### Downloading translations from crowdin

Run script `infrastructure/crowdin/download.sh`
See the script for usage details.

For instance, for pagination-selector web component:
```shell
./infrastructure/crowdin/download.sh --crowdin-api-key=<key> --github-api-key=<key> --branch=master --web-component=pagination-selector
```

This will download translations, copy them in the web component `src/i18n` directory, and create a Pull Request if any changes.

