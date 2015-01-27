# image-optim [![Build Status](https://travis-ci.org/eGavr/image-optim.svg)](https://travis-ci.org/eGavr/image-optim) [![Dependency Status](https://david-dm.org/eGavr/image-optim.svg)](https://david-dm.org/eGavr/image-optim) [![devDependency Status](https://david-dm.org/eGavr/image-optim/dev-status.svg)](https://david-dm.org/eGavr/image-optim#info=devDependencies)

Node.js wrapper for some images' compression algorithms: [PNGOUT](http://www.advsys.net/ken/util/pngout.htm), [Zopfli](http://googledevelopers.blogspot.co.uk/2013/02/compress-data-more-densely-with-zopfli.html), [Pngcrush](http://pmt.sourceforge.net/pngcrush/), [AdvPng](http://advancemame.sourceforge.net/doc-advpng.html) and [OptiPNG](http://optipng.sourceforge.net/).

## Table of contents
<!-- TOC -->
* [Installation of the algorithms](#installation-of-the-algorithms)
  * [PNGOUT](#pngout)
  * [Zopfli](#zopfli)
  * [Pngcrush](#pngcrush)
  * [AdvPNG](#advpng)
  * [OptiPNG](#optipng)
* [Installation of image-optim](#installation-of-image-optim)
* [Usage](#usage)
  * [API](#api)
  * [CLI](#cli)

<!-- TOC END -->

## Installation of the algorithms

In order to use **image-optim** you have to install the above written algorithms _globaly_.

### PNGOUT

#### Download

* Direct [link](http://static.jonof.id.au/dl/kenutils/pngout-20130221-darwin.tar.gz).

* From the command line:

```bash
$ curl -L http://static.jonof.id.au/dl/kenutils/pngout-20130221-darwin.tar.gz | tar xz
```

#### Install

After the download the tool will have been already installed. You need to move the _binary_ file to the _global_ directory in order to have the opportunity to run it from any place:

```bash
$ sudo mv pngout /usr/local/bin
```

### Zopfli

#### Download

```bash
$ git clone https://github.com/pornel/zopfli.git zopfli
```

#### Install

```bash
make zopflipng
```

Then you need to move the _binary_ file to the _global_ directory in order to have the opportunity to run it from any place:

```bash
$ sudo mv zopflipng /usr/local/bin
```

### Pngcrush

_v1.7.77_

#### Download

* Direct [link](http://sourceforge.net/projects/pmt/files/pngcrush/old-versions/1.7/1.7.77/pngcrush-1.7.77.tar.gz/download).

* From the command line:

```bash
$ curl -L http://sourceforge.net/projects/pmt/files/pngcrush/old-versions/1.7/1.7.77/pngcrush-1.7.77.tar.gz/download | tar xz
```

#### Install

```bash
$ make
```
Then you need to move the _binary_ file to the _global_ directory in order to have the opportunity to run it from any place:

```bash
$ sudo mv pngcrush /usr/local/bin
```

### AdvPNG

_v1.15_

#### Download

* Direct [link](http://sourceforge.net/projects/advancemame/files/advancecomp/1.15/advancecomp-1.15.tar.gz/download).

* From the command line:

```bash
curl -L http://sourceforge.net/projects/advancemame/files/advancecomp/1.15/advancecomp-1.15.tar.gz/download | tar xz
```

#### Install

```bash
$ ./configure && make

$ sudo make install
```

The tool will have been already installed _globaly_.

### OptiPNG

_v0.6.5_

#### Download

* Direct [link](http://sourceforge.net/projects/optipng/files/OptiPNG/optipng-0.6.5/optipng-0.6.5.tar.gz/download).

* From the command line:

```bash
$ curl -L http://sourceforge.net/projects/optipng/files/OptiPNG/optipng-0.6.5/optipng-0.6.5.tar.gz/download | tar xz
```

#### Install

```bash
$ ./configure && make

$ sudo make install
```

The tool will have been already installed _globaly_.

## Installation of image-optim

```bash
$ npm install image-optim
```

_or_

```bash
$ git clone https://github.com/eGavr/image-optim.git && cd image-optim && npm install
```

## Usage

### API

```js
var imageOptim = require('image-optim');
```

#### imageOptim.optim

Optimizes the given files.

**@param** *{Array}* - a list of paths to files to optimize<br>
**@returns** *{Promise * Array}* - the information about optimized files:<br>

```js
[{ name: 'file.ext', savedBytes: 12345 }]
```

#### imageOptim.lint

Checks whether the given files can be optimized further.

**@param** *{Array}* - a list of paths to files to check<br>
**@param** *{Object}* - options:<br>

  * **tolerance** *{Number}* - sets the _measurement error_ during the check. If the difference in sizes between the raw file and the compressed file is less than or equal to the specified _tolerance_, **image-optim** will consider that the raw file can not be optimized further (default: `0`)

**@returns** *{Promise * Array}* - a list of files which can be optimized further

### CLI

```bash
$ image-optim --help

Usage:
  image-optim [OPTIONS] [ARGS]

Options:
  -h, --help : Help
  -v, --version : Shows the version number
  -l, --lint : Lint mode
  -t TOLERANCE, --tolerance=TOLERANCE : Tolerance (default: 0)

Arguments:
  FILES : Paths to files (required)
```
