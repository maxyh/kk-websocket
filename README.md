# kk-websocket

[![Version npm](https://img.shields.io/npm/v/kk-websocket.svg)](https://www.npmjs.com/package/kk-websocket)
[![Linux Build](https://img.shields.io/travis/maxyh/kk-websocket/master.svg)](https://travis-ci.org/maxyh/kk-websocket)
[![Windows Build](https://ci.appveyor.com/api/projects/status/github/maxyh/kk-websocket?branch=master&svg=true)](https://ci.appveyor.com/project/maxyh/kk-websocket)
[![Coverage Status](https://coveralls.io/repos/github/maxyh/kk-websocket/badge.svg?branch=master)](https://coveralls.io/github/maxyh/kk-websocket?branch=master)

## ______Work in Progress. Not Complete.______

Wrapper of ws and WebSocket.

It uses:

- [ws](https://github.com/websockets/ws) on Node
- [global.WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
  in browsers

## Limitations

Before using this module you should know that
[`ws`](https://github.com/websockets/ws/blob/master/doc/ws.md#class-websocket)
is not perfectly API compatible with
[WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket),
you should always test your code against both Node and browsers.

Some major differences:

- no `Server` implementation in browsers

## Usage

You need to install both this package and [ws](https://github.com/websockets/ws):

```bash
> npm i kk-websocket ws
```

Then just require this package:

```js
const WebSocket = require('kk-websocket')

const ws = new WebSocket('wss://echo.websocket.org/', {
  origin: 'https://websocket.org'
});

ws.on('open', function open() {
  console.log('connected');
  ws.send(Date.now());
});

ws.on('close', function close() {
  console.log('disconnected');
});

ws.on('message', function incoming(data) {
  console.log(`Roundtrip time: ${Date.now() - data} ms`);

  setTimeout(function timeout() {
    ws.send(Date.now());
  }, 500);
});
```

## Files

- `.travis.yml` - Travis CI
  ```bash
  > npm run coveralls
  ```
- `package.json` - NPM
  - prepublishOnly
    ```bash
    > nps test clean build
    ```
  - coveralls
    ```bash
    > nps coveralls
    # nps coverage && nyc report --reporter=text-lcov | coveralls
    ```
  - coverage
    ```bash
    > nps coverage
    # nyc ./node_modules/mocha/bin/_mocha
    ```
  - test
    ```bash
    > nps test
    ```
  - start
    ```bash
    > nps
    ```
- `package-scripts.js` - NPS
  - build
  - lint
  - clean
  - test
    - node
    - browser
    - bundle
  - coverage
  - coveralls
  - prebuildDocs
  - buildDocs
  - postbuildDocs
  - prewatchDocs
  - watchDocs
- `karma.conf.js`(Karma)
