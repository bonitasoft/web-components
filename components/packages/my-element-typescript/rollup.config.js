import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import config from '../../config/rollup.config';
import {name, dependencies} from './package.json';

let devMode = process.env.server;
let plugins = [typescript()];
if (devMode) {
  // Create a server for dev mode
  plugins.push(serve({ contentBase: '' }));
  // Allow to livereload on any update
  plugins.push(livereload('dist'));
}

// let config = {
//   input: ['src/index.ts'],
//   output: [{
//     dir: 'target/modern',
//     format: 'es'
//     //sourcemap: true,
//
//   }, {
//     dir: 'target/nomodule',
//     format: 'amd'
//     //sourcemap: true,
//   }, {
//     dir: 'target/nomodule',
//     format: 'amd'
//     //sourcemap: true,
//   }, { format: 'iife', dir: 'target/iife', sourcemap: true }],
//   plugins: [
//     resolve({
//       // browser: true,
//       // jsnext: true,
//       // module: true,
//     }),
//     typescript()
//   ]
// };
//
// let runServer = process.env.server;
// if (runServer) {
//   // Create a server for dev mode
//   config.plugins.push(serve({ contentBase: ''}));
//   // Allow to livereload on any update
//   config.plugins.push(livereload('target'));
// }

export default config({
  input: 'src/index.ts',
  sourceMap: devMode,
  fileName: name,
  plugins: plugins,
  dependencies
});