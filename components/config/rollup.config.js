import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';

export default opts => {
  const options = Object.assign(
    {
      css: true,
    },
    opts
  )

  return {
    input: options.input,
    output: [
      { format: 'cjs', file: './dist/index.cjs.js', sourcemap: false },
      { format: 'es', file: './dist/index.es.js', sourcemap: false },
      {format: 'esm',  file: './dist/index.esm.js', sourcemap:false}
    ],
    plugins: [
      terser(),
      nodeResolve({
        extensions: ['.js'],
      }),
      commonjs({
        include: '../../node_modules/**',
      }),
      babel({
        runtimeHelpers: true,
        exclude: '../../node_modules/**'
      }),
    ],
  }
}