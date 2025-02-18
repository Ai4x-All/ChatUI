import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';
import postcss from 'rollup-plugin-postcss';

const name = 'ChatUI';
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default {
  input: './src/index.ts',
  external: ['react', 'react-dom'],
  plugins: [
    resolve({ extensions }),
    commonjs(),
    babel({
      extensions,
      babelHelpers: 'runtime',
      include: ['src/**/*'],
    }),
    terser({
      output: { comments: false },
      compress: { drop_console: true },
    }),
    postcss({
      // 如果需要，可在此配置自动添加前缀、压缩等
      extensions: ['.css'],
      inject: true, // 或者使用 extract: true 单独抽离 CSS 文件
    }),
  ],
  output: {
    file: pkg.browser,
    format: 'umd',
    name,
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    intro: `exports.version = '${pkg.version}';`,
  },
};
