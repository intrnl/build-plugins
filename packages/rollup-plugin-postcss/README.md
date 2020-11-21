# `rollup-plugin-postcss`

Rollup plugin for bundling CSS stylesheets.

## Usage

```js
// rollup.config.js
import { postcss as postcssPlugin } from 'rollup-plugin-postcss';

export default {
  input: 'src/index.js',
  plugins: [
    postcssPlugin(),
  ],
}
```

## API Reference

### `postcss`

- `options?`
  - `include?: string | RegExp | (string | RegExp)[] | null`
    Files to include, defaults to matching CSS files only
  - `exclude?: string | RegExp | (string | RegExp)[] | null`
    Files to exclude
  - `plugins?: postcss.Plugin[]`  
    PostCSS plugins to use
  - `modules?: boolean | 'auto' | ((fileName: string) => string)`  
    Enable CSS modules, defaults to `auto` where only `.module.xxx` gets matched
  - `modulesOptions?: CSSModulesOptions`  
    Options for CSS modules
  - `minify?: boolean`  
    Minify bundled CSS, disabled by default
  - `minifyOptions?: CleanCSS.Options`
    Options for CleanCSS minifier
  - `sourcemap?: boolean | 'inline'`
    Generate sourcemap, only emitted depending on your bundle output options,
    enabled by default
