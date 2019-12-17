import nodeResolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript';
import copy from 'rollup-plugin-copy';

import postcss from 'rollup-plugin-postcss';

export default opts => {
  const options = Object.assign(
    {
      css: true
    },
    opts
  );

  /**
   * Apply this plugin only when prod bundled is called
   */
  const prodPlugin = !options.isProductionBundle ? [
    minifyHTML(),
    // Minify file
    terser({
      module: true,
      compress: {
        passes: 2
      }
    }),
    // Prepare artifact to publish in note repository
    copy({
      targets: [
        { src: 'index.html', dest: 'dist' },
        { src: 'README.md', dest: 'dist' }
      ]
    })] : [];

  return {
    input: options.input,
    output: options.output || [
      {
        format: 'iife',
        file: `./dist/lib/${options.fileName}.es5.min.js`,
        name: 'main',
        sourcemap: options.sourceMap || false,
        globals: { 'lit-element': 'litElement' }
      }
    ],
    context: 'this',
    plugins: [...prodPlugin,
      nodeResolve(),
      babel({
        runtimeHelpers: true,
        exclude: '../../node_modules/**'
      }),
      postcss({
        inject: false,
        plugins: []
      }),
      json(),
      typescript()
    ].concat(options.plugins)
  };
}