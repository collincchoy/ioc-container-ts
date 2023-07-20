# A simple IoC container in TypeScript

This package contains a _simple_ Inversion of Control(IoC) container class. You can use this class to manage dependency mapping and resolution for ES `class`es and/or for simple Dependency Injection.

For examples, refer to `src/ioc.spec.ts` and the example application at `src/index.ts`.

## Feature Support

- Simple dependency mapping and resolution
- Support for management and instantiation of Singletons
- TS5/ES decorator to register class declarations

## Feature Wishlist

- Handle circular dependencies 🤐
- Better TS inference
- Add support for functions
- Automatic dependency registration 🤔
- Improve decorator api. Should support manual dependency registration
- Fix test suite to handle TS5/ES decorators
- Fix issue with test suite where `vitest.describe` is sometimes is not recognized (Note: if you encounter this via `npm test`, making a file edit with the watcher running usually fixes. must be timing related 🧐)

## Developing/testing locally

To run using `ts-node` with auto-reload on file changes:

```sh
npm run dev
```

To run test suite:

```sh
npm test
```

> **Warning**
> Sometimes the test suite may fail to find `vitest.describe` - editing a file while `npm test` is still running usually fixes this issue.
