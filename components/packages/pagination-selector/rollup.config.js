import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import config from '../../config/rollup.config';
import { name, dependencies } from './package.json';

let devMode = process.env.devMode;

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
  dependencies,
});
