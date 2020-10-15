# egg-titans

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-titans.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-titans
[travis-image]: https://img.shields.io/travis/eggjs/egg-titans.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-titans
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-titans.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-titans?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-titans.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-titans
[snyk-image]: https://snyk.io/test/npm/egg-titans/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-titans
[download-image]: https://img.shields.io/npm/dm/egg-titans.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-titans

<!--
Description here.
-->

## Install

```bash
$ npm i egg-titans --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.titans = {
  enable: true,
  package: 'egg-prom',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.titans = {
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
