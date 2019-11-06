import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';

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
      commonjs({
        include: '*/node_modules/**'
      }),
      babel({
        runtimeHelpers: true,
        exclude: '../../node_modules/**'
      })
    ].concat(options.plugins)
  };
}