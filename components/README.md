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


## To bundle a component and publish it

    lerna run --scope bonita-components/[components] [options]

## Publish

To make this module available on npm registry, run:
 
    npm publish
    
To unpublished a version run:

    npm unpublish <package>@<version>

## Release

To release a new version on this component, run this following command:

    npm run release -- major|minor|patch
    
During development phase, you can run 

    npm run release -- <suffix>