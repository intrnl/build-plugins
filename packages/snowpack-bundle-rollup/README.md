# `snowpack-bundle-rollup`

Snowpack plugin for bundling to production using Rollup

## Usage

```sh
npm install --save-dev @intrnl/snowpack-bundle-rollup
# pnpm install --save-dev @intrnl/snowpack-bundle-rollup
# yarn add --dev @intrnl/snowpack-bundle-rollup
```

```js
// snowpack.config.js

export default {
  // ...  
  buildOptions: {
    // This is recommended.
    clean: true,
  },

  plugins: [
    ['@intrnl/snowpack-bundle-rollup', {
      // See below for options.
    }],
  ],
};
```

## Options

- `entrypoints?: string | string[]`  
  Glob pattern for matching HTML files that are used as entrypoints, defaults to
  matching all HTML files
- `assetsDir?: string`  
  Where assets like JS and CSS lives, defaults to `_assets`
- `modulesDir?: false | string`  
  Where your web modules lives, this is relative to the assets directory,
  defaults to `modules`, pass `false` to bundle the modules directly.
- `minify?: boolean`  
  Whether to minify the resulting bundle, defaults to `false`
- `keepBuildFiles?: boolean`  
  Whether to keep the source files that are used during bundling,
  defaults to `false`
- `modifyRollupOptions?: ({ input: InputOptions, output: OutputOptions }) => void`  
  An escape hatch allowing mutation of the Rollup options used by this plugin
