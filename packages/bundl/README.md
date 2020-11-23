# `bundl`

Effortless, no-config library bundler.

- Bundles your source code into a single ESM and CommonJS file
- Transpiles TypeScript, with the help of [esbuild][1]
- Does not bundle dependencies

*If you're looking for something more, you can try [microbundle][2]
or [tsdx][3] instead.*

## Install

```sh
npm install --save-dev @intrnl/bundl
# pnpm install --save-dev @intrnl/bundl
# yarn add --dev @intrnl/bundl
```

Add `source` field into your `package.json` that leads to the entry file for
your library, and either a `main` or `module` field for the output, then all
you need to do is...

```sh
# This is all you have to do!
bundl
```

## Configuration

There is really not much configuring to do aside from above, but you might be
interested in messing around with the output that it generates. All you need
is to add `bundl` field, which provides the following

- `target`  
  Environment target, defaults to `esnext`
- `minify`
  Whether the output should be minified, disabled by default
- `jsxFactory`  
  JSX factory to use, defaults to `React.createElement`
- `jsxFragment`
  JSX fragment factory to use, defaults to `React.Fragment`


[1]: https://github.com/evanw/esbuild
[2]: https://github.com/developit/microbundle
[3]: https://github.com/formium/tsdx
