// This file contains all ambient imports needed to compile the modules/ source code

/// <reference path="../node_modules/zone.js/dist/zone.js.d.ts" />
/// <reference path="../node_modules/@types/jasmine/index.d.ts" />
/// <reference path="../node_modules/@types/node/index.d.ts" />

// TODO: allowJS in tsconfig?
declare module '*.js' {
  const value: any;
  export default value;
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.css' {
  const value: any;
  export default value;
}
