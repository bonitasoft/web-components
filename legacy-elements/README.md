# Introduction

In this project you find any custom component. All components must be follow webComponent standard. You can see a demo of all components. Open `demo.html` after launch `npm install && npm run build`

# Installation

Run `npm install` at root project.

# Build

To build all component in this module you need to run:

    npm run build

Some time you want build only one component, to do that, run

    npm run build:yourComponent

A js file is create in `dist` folder. This file can be import in html file with

`<script src="dist/youComponent.min.js"></script>`

# Development and debug

When you develop your component you can run:

    npm run start -- --environment folder:yourComponent

This task will be run a dev server (`http://localhost:10001/yourComponent/index.html`) by default.

You can put some breakpoint in your browser (F12 - sources - sourcemap). Livereload for display is available. If you made some changes in code and if you want see it in sourmap, you need to restart dev server.

Note: To configure your server you need to edit `rollup.dev.config.js` in `serve` function.

Know issue: You can't access at localhost adress with your personnal IP (useful when you want show to another people). To do this, please change server config in `rollup.dev.config.js`.

# How to add a new component

- Create a folder with component name in `elements`
- Entry file should be `index.js`
- Add an script entry in package.json like:

  `"build:yourComponent": rollup -c --environment folder:yourComponent`

- Please update `demo.html` at root project to complete showroom file :)
- Create a readme to describe component API.

# Formatting

Before each commit, a hook is configure to prettier your js file. You can configure you IDE with prettier plugin.

# Babel configuration

## Build environment

`{ "exclude": "node_modules/**", "presets": [ [ "@babel/env", { "modules": "false", "useBuiltIns": "usage" } ] ], "plugins": [ [ "@babel/plugin-transform-runtime", { "corejs": false } ] ] }`

- Use @babel/env preset: We use this plugin to compile a bundle based on targeted environments (defined in browserslist config in package.json). We want to compile for old browsers (espacially for IE11), so we need to add polyfills. This plugin is based on core-js library which contains all polyfills we need (polyfills such as Promise, Set or Map but also instance methods such as array.find).
  - modules=false => disable transformation of ES6 module syntax to another module type. Indeed, our goal is to compile ES6 to ES5 so we don't need to compile ES6 modules in another syntax modules.
  - useBuiltIns=usage => this option allows to reduce the bundle size because it adds only polyfills needed in our js code (always based on targeted environments) and not all. This option adds appropriated core-js imports, so we need to add a core-js dependency in package.json.
- Use @babel/plugin-transform-runtime plugin:
  - helpers=true (default) and runtimeHelpers=true in rollup config => we use this plugin to deduplicate and encapsulate babel helpers (js functions that babel has added at the top of each file to compile the code).
  - core-js=false (default): we could use this option to deduplicate and encapsulate polyfills code from core-js (to avoid pollute global context, see issue below) but it does not work with instance methods... Another reason we are not using it, it's that webcomponentsjs polyfills already contains global ES6 polyfills such as Promise, Set or Map...

## Test environment

Jest run test with `test` environment that's why we need to add a configuration in .babelrc to transpile input code to commonjs target

    "env": { "test": { "presets": [["@babel/preset-env",{"modules": "cjs"}]]}}

With it,you can write your test in ES6.

# Issues

- Final js bundle contains for now global polyfills (instance methods) which pollute global namespace. This can be problematic for a library bundle, because it could bring conflicts with other js library or js framework included in a parent application. Indeed, @babel/env (through useBuiltIns usage option) is based on core-js@2, which add global polyfills. To avoid this, we should include polyfills based on core-js-pure (it's equivalent to core-js but without global namespace pollution) which is including in core-js@3, but it's still in beta version for now [current state here #7646](https://github.com/babel/babel/pull/7646).

# Notes

- To work, our web component needs to be inserted in a page which load web components API polyfills like this:
  `<script src="../../node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>`. This is the app which has to include them and not in the bundle, to avoid duplication and to separate responsibilities. The page has to be aware that it uses web component inside.
- It could be an error on mordern browsers with customElements API (customElements.define) by compiling in ES5. See https://github.com/webcomponents/webcomponentsjs#custom-elements-es5-adapterjs
