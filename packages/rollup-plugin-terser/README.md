# `rollup-plugin-terser`

Minify generated bundles with Terser

## Usage

```js
// rollup.config.js
import { terser as terserPlugin } from 'rollup-plugin-terser';

export default {
  input: 'src/index.html',
  plugins: [
    terserPlugin(),
  ],
};
```

## API Reference

### `terser`

- `options?`
  - `numWorkers?: number`  
    The max number of workers to spawn, defaults to the number of CPU cores minus 1
  - `minifyOptions?: terser.MinifyOptions`  
    Terser minification options
