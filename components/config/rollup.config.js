import nodeResolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
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
  })] : [];

  // Split on slash to avoid scoped dependencies
  options.fileName = options.fileName.includes('/') ? options.fileName.split('/')[1] : options.fileName;

  return {
    input: options.input,
    output: options.output || [
      {
        format: 'iife',
        file: `./lib/${options.fileName}.es5.min.js`,
        name: 'main',
        sourcemap: options.sourceMap || false,
        globals: { 'lit-element': 'litElement' }
      }
    ],
    context: 'this',
    plugins: [
      ...prodPlugin,
      nodeResolve(),
      postcss({
        inject: false,
        plugins: []
      }),
      typescript(),
      json()
    ].concat(options.plugins)
  };
}