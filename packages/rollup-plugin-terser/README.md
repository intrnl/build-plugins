# `rollup-plugin-terser`

Minify generated bundles with Terser

## Usage

```sh
npm install --save-dev @intrnl/rollup-plugin-terser
# pnpm install --save-dev @intrnl/rollup-plugin-terser
# yarn add --dev @intrnl/rollup-plugin-terser
```

```js
// rollup.config.js
import { terser as terserPlugin } from '@intrnl/rollup-plugin-terser';

export default {
  input: 'src/index.html',
  plugins: [
    terserPlugin(),
  ],
};
```

## Options

- `numWorkers?: number`  
  The max number of workers to spawn, defaults to the number of CPU cores minus 1
- `minifyOptions?: terser.MinifyOptions`  
  Terser minification options
