# `rollup-plugin-node-externals`

Mark `package.json` dependencies as external

## Usage

Requires a resolver like [`@rollup/plugin-node-resolve`][1] to work.

```sh
npm install --save-dev @intrnl/rollup-plugin-node-externals
# pnpm install --save-dev @intrnl/rollup-plugin-node-externals
# yarn add --dev @intrnl/rollup-plugin-node-externals
```

```js
// rollup.config.js
import { externals as externalsPlugin } from '@intrnl/rollup-plugin-node-externals';
import resolvePlugin from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  plugins: [
    // Make sure you put it before the resolver plugin
    externalsPlugin(),
    resolvePlugin(),
  ],
};
```

## Options

- `external?: string[]`  
  What to mark as external, allowed values are `regular` `dev` `optional` and
  `peer`, defaults to marking all except `dev` dependencies
- `root?: string`  
  Where to start finding for `package.json`, defaults to current working
  directory


[1]: https://github.com/rollup/plugins/tree/master/packages/node-resolve
