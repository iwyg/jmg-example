# Jmg website and playground demo

[![Author](http://img.shields.io/badge/author-iwyg-blue.svg?style=flat-square)](https://github.com/iwyg)
[![Source Code](http://img.shields.io/badge/source-jmg--example-blue.svg?style=flat-square)](https://github.com/iwyg/jmg-example/tree/master)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](https://github.com/iwyg/jmg-example/blob/master/LICENSE.md)

This is an example integration for jmg.

## Install

```sh
> npm install
> composer install
```

## Build

```sh
> npm run build
```

## Development

To kick off webpack and the cli server, type

```sh
> npm start
> php -S 0.0.0.0:4040 -t public public/index.php
```

or simply

```sh
> ./bin/serve -p 4040
```

which will start both, webpack and the cli server.
