History of changes
==================

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
