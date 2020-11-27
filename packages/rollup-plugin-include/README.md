# `rollup-plugin-include`

Include chunks or assets within your Rollup bundle

## Usage

```sh
npm install --save-dev @intrnl/rollup-plugin-include
# pnpm install --save-dev @intrnl/rollup-plugin-include
# yarn add --dev @intrnl/rollup-plugin-include
```

```js
// rollup.config.js
import { include as includePlugin } from '@intrnl/rollup-plugin-include';

export default {
  input: 'src/index.js',
  plugins: [
    includePlugin(),
  ],
};
```

```js
// Reference any file and it will be included within your Rollup bundle
let image_src = new URL('./assets/image.png', import.meta.url);

// Any files ending with .js will be picked up as a chunk by default,
// making it usable as a module worker.
let worker_src = new URL('./worker.js', import.meta.url);
```
