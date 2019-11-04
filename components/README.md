# Architecture

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Use Lerna to get a mono repo with multiple node package

## Build all packages

    npm run build
    
    
## Build only one package

    lerna run --scope @bonita-components/[components] [options]
    
    
## Run pretiter

    npm run start lint:format
    
    
## Breakpoint in IntellJ

Run your `npm run start` like always.

On your `index.html`, Right click and select `Debug index.html` entry. After this, you can put breakpoint in your Ts or Js code.
