# `rollup-plugin-html`

Allows using HTML files as input for Rollup

## Usage

```sh
npm install --save-dev @intrnl/rollup-plugin-html
# pnpm install --save-dev @intrnl/rollup-plugin-html
# yarn add --dev @intrnl/rollup-plugin-html
```

```js
// rollup.config.js
import { html as htmlPlugin } from '@intrnl/rollup-plugin-html';

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
