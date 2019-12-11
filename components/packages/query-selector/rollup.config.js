import typescript from 'rollup-plugin-typescript';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import config from '../../config/rollup.config';
import { name, dependencies } from './package.json';
import json from '@rollup/plugin-json';

let devMode = process.env.devMode;
let plugins = [
  typescript(), json()
];

if (devMode) {
  // Create a server for dev mode
  plugins.push(serve({ contentBase: '' }));
  // Allow to livereload on any update
  plugins.push(livereload('dist'));
}

export default config({
  input: 'src/index.ts',
  sourceMap: devMode,
  fileName: name,
  plugins: plugins,
  dependencies,
});
