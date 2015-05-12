History of changes
==================

0.3.4
-----

* Updated **Zopflipng** to commit [Fix ColorIndex](https://github.com/pornel/zopfli/tree/0726c038cd3cdc788f3e8dfd33664bb999baaa59).
* Updated **Pngcrush** to `v1.7.85`.

0.3.3
-----

* Used the version of **Pngcrush** as in `ImageOptim@v1.5.4`.

0.3.2
-----

* Added sorting of results in reports by property `isOptimized` (in _html_ report not optimized files come first, in _flat_ report not optimized files come last).

0.3.1
-----

* Fixed the downloading URL of **Pngcrush**, because it has been changed.

0.3.0
-----

* Added the _HTML_ and _flat_ reporters of the results.

0.2.0
-----

* The value of **tolerance** option is set in percentages.
* Fixed cases when paths to images contain spaces.
* Fixed the version of **Zopflipng**.
* Modified the patch for **Zopflipng**.

0.1.0
-----

* Fixed the work of the algorithms on _Linux_:
  * Used module [pngout-bin](https://github.com/imagemin/pngout-bin) for installing of **PNGOUT**.
  * [Patched](https://github.com/eGavr/image-optim/blob/master/patch/zopflipng.patch) **Zopflipng**.
* Ported the patch for **OptiPNG** from [ImageOptim](https://github.com/pornel/ImageOptim).
* Removed option _keep-chunks_ from the executable command of **Zopflipng**.
* Moved **Zopflipng** on the second place in the optimization chain.

0.0.1
-----

* Optimization and linting of PNG images.
