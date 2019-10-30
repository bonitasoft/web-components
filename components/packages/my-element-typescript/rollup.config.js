import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';


export default {
  input: 'src/index.ts',
  output: [
    { format: 'iife', file: `target/bundle.es5.min.js`, name: 'main'}
  ], plugins: [
    resolve(),
    typescript({
      tsconfig: './tsconfig.json'
    }),
    // terser({
    //   // mandatory as we are minifying ES Modules here
    //   module: true,
    //   compress: {
    //     // compress twice for further compressed code
    //     passes: 2
    //   }
    // }),
  ]
};