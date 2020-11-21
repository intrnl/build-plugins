# `rollup-plugin-html`

Allows using HTML files as input for Rollup

## Usage

```js
// rollup.config.js
import { html as htmlPlugin } from 'rollup-plugin-html';

export default {
  input: 'src/index.html',
  plugins: [
    htmlPlugin(),
  ],
};
```

## API Reference

### `html`

- `options?`
  - `baseUrl?: string`  
    The base URL where static assets are hosted
