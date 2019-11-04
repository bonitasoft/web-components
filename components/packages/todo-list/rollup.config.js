import configure from '../../config/rollup.config';
import {name, dependencies}  from './package.json';

export default configure({
  input: './src/index.js',
  fileName: name,
  dependencies
})