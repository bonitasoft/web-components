import configure from '../../config/rollup.config'
import { dependencies } from './package.json'

export default configure({
  input: './src/index.js',
  dependencies,
  plugins:[
    serve('dist')
  ]
})