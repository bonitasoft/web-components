# `my-element-type-script`

This is an example to show how you can use Lit-element, typescript and rollup to build a webComponent

## Usage

Run:

    npm install bo-element-typescript

Then import `node_modules/`

And you can use new html tag `<bo-element></element>`

## Publish

To make this module available on npm registry, run:
 
    npm publish
    
To unpublished a version run:

    npm unpublish <version>

## Release

To release a new version on this component, run this following command:

    npm run release -- major|minor|patch
    
During development phase, you can run 

    npm run release -- <suffix>