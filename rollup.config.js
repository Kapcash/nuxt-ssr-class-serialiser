import typescript from '@rollup/plugin-typescript';
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'lib',
    format: 'cjs'
  },
  plugins: [
    typescript(),
    uglify(),
  ]
};