import nodeResolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript';

import postcss from 'rollup-plugin-postcss';

export default opts => {
  const options = Object.assign(
    {
      css: true
    },
    opts
  );

  return {
    input: options.input,
    output: [
      {
        format: 'iife',
        file: `./dist/${options.fileName}.es5.min.js`,
        name: 'main',
        sourcemap: options.sourceMap || false,
        globals: { 'lit-element': 'litElement' }
      }
    ],
    plugins: [
      minifyHTML(),
      terser({
        //FIXME: no minify in dev mode
        // mandatory as we are minifying ES Modules here
        module: true,
        compress: {
          // compress twice for further compressed code
          passes: 2
        }
      }),
      nodeResolve(),
      babel({
        runtimeHelpers: true,
        exclude: '../../node_modules/**'
      }),
      postcss({
        inject: false,
        plugins: []
      }),
      typescript(),
      json()
    ].concat(options.plugins)
  };
}