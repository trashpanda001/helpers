[![NPM version][npm-img]][npm-url]
[![Build Status][build-img]][build-url]

A collection of helpers for my projects. Here be dragons.

### Resources

- Documentation: https://trashpanda001.github.io/helpers
- GitHub: https://github.com/trashpanda001/helpers
- NPM: https://www.npmjs.com/package/@trashpanda001/helpers

### Install

```sh
pnpm add @trashpanda001/helpers
```

or

```sh
npm install @trashpanda001/helpers
```

### Example usage

```ts
import { chunkEvery } from "@trashpanda001/helpers/array"

chunkEvery([1, 2, 3, 4, 5], 2)
// [[1, 2], [3, 4], [5]]
```

[build-img]: https://github.com/trashpanda001/helpers/actions/workflows/test.yaml/badge.svg
[build-url]: https://github.com/trashpanda001/helpers/actions/workflows/test.yaml
[npm-img]: http://img.shields.io/npm/v/@trashpanda001/helpers?color=green
[npm-url]: https://www.npmjs.com/package/@trashpanda001/helpers
