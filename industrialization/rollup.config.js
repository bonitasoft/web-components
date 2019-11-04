import resolve from 'rollup-plugin-node-resolve';
import common from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import { version } from './package.json';

export default {
  input: 'lib/index.js',
  output: {
    file: `bin/bundle.${version}.js`,
    format: 'esm'
  },
  plugins: [
    terser(),
    common(),
    resolve()
  ]
};