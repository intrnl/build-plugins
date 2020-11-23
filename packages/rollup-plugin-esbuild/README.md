# `rollup-plugin-esbuild`

Transpile your source code with ESBuild, doing a two pass to prevent helper
duplicates in your code.

## Usage

```sh
npm install --save-dev @intrnl/rollup-plugin-esbuild
# pnpm install --save-dev @intrnl/rollup-plugin-esbuild
# yarn add --dev @intrnl/rollup-plugin-esbuild
```

```js
// rollup.config.js
import { esbuild as esbuildPlugin } from '@intrnl/rollup-plugin-esbuild';

export default {
  input: 'src/index.js',
  plugins: [
    esbuildPlugin(),
  ],
};
```

## Options

- `include?: string | RegExp | (string | RegExp)[] | null`  
  Files to include, defaults to matching all files
- `exclude?: string | RegExp | (string | RegExp)[] | null`  
  Files to exclude
- `loaders?: { [loader: Loader ]: string[] }`  
  Loaders to use, files with extension that does not match any loaders will be
  ignored
- `transformOptions?: TransformOptions`  
  ESBuild transform options
