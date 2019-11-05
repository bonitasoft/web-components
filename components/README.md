# Architecture

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Use Lerna to get a mono repo with multiple node package

## Mandatory dependencies

You need to have **lerna** and **nodejs > 10** to build this repository

Run `npm install -g lerna` to install lerna globally
    

## Build all packages

You need to run `lerna bootstrap --use-workspaces` first when you cloning this repository/

Then you can run `npm run bundle`. It will be compile and bundle all components.
    
    
## Build only one package

    lerna run --scope [components] [options]
    
For example: `lerna run --scope bo-element-typescript start --stream` to start dev bo-element-typescript environment
    
    
## Run pretiter on all packages

    npm run start lint
    
    
## Breakpoint in IntellJ

Run your `npm run start` like always.

On your `index.html`, Right click and select `Debug index.html` entry. After this, you can put breakpoint in your Ts or Js code.

<!--
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
-->