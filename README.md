# image-optim [![Build Status](https://travis-ci.org/bem/image-optim.svg)](https://travis-ci.org/bem/image-optim) [![Coverage Status](https://coveralls.io/repos/bem/image-optim/badge.svg?branch=master)](https://coveralls.io/r/bem/image-optim?branch=master) [![Dependency Status](https://david-dm.org/bem/image-optim.svg)](https://david-dm.org/bem/image-optim) [![devDependency Status](https://david-dm.org/bem/image-optim/dev-status.svg)](https://david-dm.org/bem/image-optim#info=devDependencies)

Node.js wrapper for image compression algorithms.

<!-- TOC -->
- [Types](#types)
- [Patches](#patches)
  - [Overview](#overview)
- [Install](#install)
- [Usage](#usage)
  - [API](#api)
    - [imageOptim.optim](#imageoptimoptim)
    - [imageOptim.lint](#imageoptimlint)
    - [Exit code](#exit-code)
      - [SUCCESS](#imageoptimsuccess)
      - [CANT_COMPRESS](#imageoptimcant_compress)
      - [DOESNT_EXIST](#imageoptimdoesnt_exist)
    - [Example](#example)
  - [CLI](#cli)
    - [Example](#example-1)

<!-- TOC END -->

## Types

* PNG – [PNGOUT](http://www.advsys.net/ken/util/pngout.htm), [Zopflipng](https://github.com/pornel/zopfli), [Pngcrush](http://pmt.sourceforge.net/pngcrush/), [AdvPng](http://advancemame.sourceforge.net/doc-advpng.html) and [OptiPNG](http://optipng.sourceforge.net/).

Supporting of other types of images is coming soon.

## Patches

You can view all the _patches_ which are applied to the algorithms [here](https://github.com/bem/image-optim/tree/master/patch).

<!-- TOC:display:Overview -->
#### Overview:

* **optipng.patch** – adds to **OptiPNG** the ability to remove _RGB_ components or transparent pixels in _RGB+alpha_ images.

* **zopflipng.patch** – makes **Zopflipng** work on _Linux_.

## Install

```bash
$ npm install imageoptim
```

This command will install **image-optim** and all supported compression algorithms automatically. The installation of the compression algorithms is subscribed in script [env-setup](https://github.com/bem/image-optim/blob/master/env/env-setup).

## Usage

### API

```js
var imageOptim = require('imageoptim');
```

#### imageOptim.optim

Optimizes the given files.

**@param** *{String[]}* – a list of paths to files to optimize<br>
**@param** *{Object}* – options:<br>

  * **reporters** *{String[]}* - reporters of the results. _flat_ - writes the results to `stdout`, _html_ - creates the HTML report of the results in file `imageoptim-report.html` (default: `flat`).

**@returns** *{Promise * Object[]}* – the information about optimized files:<br>

```js
[{ name: 'file.ext', savedBytes: 12345, exitCode: 0 }]
```

#### imageOptim.lint

Checks whether the given files can be optimized further.

**@param** *{String[]}* – a list of paths to files to check<br>
**@param** *{Object}* – options:<br>

  * **tolerance** *{Number}* – sets the measurement error in _percentages_ (decimal `< 1`) or _bytes_ (integer or decimal `>= 1`) (default: `0`).

type | skope | description
--- | --- | ---
_percentages_ | **< 1** | The file will be considered to be optimized if the percentage of saved bytes after the compression is less than the specified value (_0.8_ – `80%`, _0.01_ – `1%`, etc)
_bytes_ | **>= 1** | The file will be considered to be optimized if the number of saved bytes after the compression is less than the specified value (_20_ – `20 bytes`, _100500_ – `100500 bytes`, etc)

  * **reporters** *{String[]}* - reporters of the results. _flat_ - writes the results to `stdout`, _html_ - creates the HTML report of the results in file `imageoptim-report.html` (default: `flat`).

**@returns** *{Promise * Object[]}* – the information about linted files:<br>

```js
[{ name: 'file.ext', isOptimized: true, exitCode: 0 }]
```

#### Exit code

<!-- TOC:display:SUCCESS -->
##### imageOptim.SUCCESS

If a file was processed without errors its exit code will be equal to `0`.

<!-- TOC:display:CANT_COMPRESS -->
##### imageOptim.CANT_COMPRESS

If a file can not be processed by one of the algorithms its exit code will be equal to `1`.

<!-- TOC:display:DOESNT_EXIST -->
##### imageOptim.DOESNT_EXIST

If a file does not exist its exit code will be equal to `2`.

#### Example

```js
var imageOptim = require('imageoptim');

// optimization
imageOptim.optim(['1.png', '2.png'], { reporters: ['flat', 'html'] })
    .then(function (res) {
        console.log(res);
    })
    .done();

// linting
imageOptim.lint(['1.png', '2.png'], {
        tolerance: 0.08,
        // tolerance: 20,
        reporters: ['flat', 'html']
    })
    .then(function (res) {
        console.log(res);
    })
    .done();
```

### CLI

```bash
$ imageoptim --help
Node.js wrapper for image compression algorithms

Usage:
  imageoptim [OPTIONS] [ARGS]

Options:
  -h, --help : Help
  -v, --version : Shows the version number
  -l, --lint : Lint mode
  -t TOLERANCE, --tolerance=TOLERANCE : sets the measurement error in percentages or bytes (default: 0)
  -r REPORTERS, --reporter=REPORTERS : flat or/and html (default: flat)

Arguments:
  FILES : Paths to files (required)
```

**REMARK!** More information about options `lint` and `tolerance` can be found in the [API](#imageoptimlint).

#### Example

```bash
$ imageoptim path/to/file1 path/to/file2 --reporter=flat --reporter=html # optimization

$ imageoptim path/to/file --lint --tolerance=0.08 --reporter=flat --reporter=html # linting, tolerance is `8%`

$ imageoptim path/to/file --lint --tolerance=20 # linting, tolerance is `20 bytes`
```
