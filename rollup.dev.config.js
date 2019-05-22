import configs from './rollup.config';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { version } from './package.json';

let folder = process.env.folder;

configs.forEach(config => {
  config.output.file = `dist/${folder}.${config.output.prefix}.min.js`;
  config.output.sourcemap = true;
});

// For development, watch only ESM prod config
configs[0].plugins.push(
  serve({
    contentBase: '',
    open: true,
    openPage: `/elements/${folder}/index.html`,
    host: 'localhost',
    port: 10001
  }),
  livereload('dist')
);

export default configs;
