var Q = require('q'),
    sinon = require('sinon'),
    mockFs = require('mock-fs'),
    File = require('../../lib/file'),
    imageOptim = require('../../lib/image-optim'),
    FlatReporter = require('../../lib/reporters/flat-reporter'),
    HtmlReporter = require('../../lib/reporters/html-reporter');

describe('image-optim', function () {
    var sandbox = sinon.sandbox.create(),
        PNG_IMG = new Buffer([137, 80, 78, 71]),
        FILE_SIZE = 10,
        algorithms = {};

    beforeEach(function () {
        mockFs({
            'file.ext': Buffer.concat([PNG_IMG, new Buffer(6)]), // FILE_SIZE === 10

            'file.algorithm1.ext': '',
            'file.algorithm2.ext': ''
        });

        algorithms = {
            algorithm1: sinon.stub(),
            algorithm2: sinon.stub()
        };

        sandbox.stub(FlatReporter.prototype);
        sandbox.stub(HtmlReporter.prototype);
    });

    afterEach(function () {
        mockFs.restore();

        sandbox.restore();
    });

    /**
     * @param {String} algorithm
     * @param {Number} compression
     * @returns {undefined}
     */
    function _setCompression(algorithm, compression) {
        algorithms[algorithm]
            .returns(Q.resolve(new File('file.' + algorithm + '.ext', FILE_SIZE + compression)));
    }

    /**
     * @param {String[]} files
     * @param {Function[]} algorithms
     * @param {Object}   [opts]
     * @param {String[]} [opts.reporters]
     * @returns {Promise * Object}
     */
    function _optim(files, algorithms, opts) {
        return imageOptim(files, 'optim', { png: algorithms || [] }, opts);
    }

    /**
     * @param {String[]} files
     * @param {Function[]} algorithms
     * @param {Object}   [opts]
     * @param {String[]} [opts.reporters]
     * @param {Number}   [opts.tolerance]
     * @returns {Promise * Object}
     */
    function _lint(files, algorithms, opts) {
        return imageOptim(files, 'lint', { png: algorithms || [] }, opts);
    }

    describe('optim', function () {
        it('should NOT optimize a file (all algorithms do not give profit)', function (done) {
            _setCompression('algorithm1', 0);
            _setCompression('algorithm2', +1);

            _optim(['file.ext'], [algorithms.algorithm1, algorithms.algorithm2])
                .then(function (res) {
                    res.should.be.eql([{ name: 'file.ext', savedBytes: 0, exitCode: 0 }]);
                })
                .then(done, done);
        });

        describe('should optimize a file', function () {
            it('all algorithms give profit', function (done) {
                _setCompression('algorithm1', -1);
                _setCompression('algorithm2', -2);

                _optim(['file.ext'], [algorithms.algorithm1, algorithms.algorithm2])
                    .then(function (res) {
                        res.should.be.eql([{ name: 'file.ext', savedBytes: 2, exitCode: 0 }]);
                    })
                    .then(done, done);
            });

            it('only the first algorithm gives profit', function (done) {
                _setCompression('algorithm1', -1);
                _setCompression('algorithm2', +1);

                _optim(['file.ext'], [algorithms.algorithm1, algorithms.algorithm2])
                    .then(function (res) {
                        res.should.be.eql([{ name: 'file.ext', savedBytes: 1, exitCode: 0 }]);
                    })
                    .then(done, done);
            });

            it('only the last algorithm gives profit', function (done) {
                _setCompression('algorithm1', -1);
                _setCompression('algorithm2', +1);

                _optim(['file.ext'], [algorithms.algorithm1, algorithms.algorithm2])
                    .then(function (res) {
                        res.should.be.eql([{ name: 'file.ext', savedBytes: 1, exitCode: 0 }]);
                    })
                    .then(done, done);
            });
        });

        it('should handle not existing file', function (done) {
            _optim(['fake.ext'])
                .then(function (res) {
                    res.should.be.eql([{ name: 'fake.ext', exitCode: 2 }]);
                })
                .then(done, done);
        });

        it('should handle invalid file', function (done) {
            algorithms.algorithm1.returns(Q.reject());
            algorithms.algorithm2.returns(Q.reject());

            _optim(['file.ext'], [algorithms.algorithm1, algorithms.algorithm2])
                .then(function (res) {
                    algorithms.algorithm2.should.not.be.called;
                    res.should.be.eql([{ name: 'file.ext', exitCode: 1 }]);
                })
                .then(done, done);
        });

        it('should report the results (`html` and `flat` reports)', function (done) {
            _optim([], [], { reporters: ['flat', 'html'] })
                .should.be.fulfilled
                .then(function () {
                    FlatReporter.prototype.write.should.be.called;
                    HtmlReporter.prototype.write.should.be.called;
                })
                .then(done, done);
        });
    });

    describe('lint', function () {
        it('should lint optimized file (all algorithms do not give profit)', function (done) {
            _setCompression('algorithm1', 0);
            _setCompression('algorithm2', +1);

            _lint(['file.ext'], [algorithms.algorithm1, algorithms.algorithm2])
                .then(function (res) {
                    res.should.be.eql([{ name: 'file.ext', isOptimized: true, exitCode: 0 }]);
                })
                .then(done, done);
        });

        describe('should lint NOT optimized file', function () {
            it('all algorithms give profit', function (done) {
                _setCompression('algorithm1', -1);
                _setCompression('algorithm2', -2);

                _lint(['file.ext'], [algorithms.algorithm1, algorithms.algorithm2])
                    .then(function (res) {
                        algorithms.algorithm2.should.not.be.called;
                        res.should.be.eql([{ name: 'file.ext', isOptimized: false, exitCode: 0 }]);
                    })
                    .then(done, done);
            });

            it('only the last algorithm gives profit', function (done) {
                _setCompression('algorithm1', +1);
                _setCompression('algorithm2', -2);

                _lint(['file.ext'], [algorithms.algorithm1, algorithms.algorithm2])
                    .then(function (res) {
                        algorithms.algorithm1.should.be.called;
                        res.should.be.eql([{ name: 'file.ext', isOptimized: false, exitCode: 0 }]);
                    })
                    .then(done, done);
            });
        });

        it('should handle not existing file', function (done) {
            _lint(['fake.ext'])
                .then(function (res) {
                    res.should.be.eql([{ name: 'fake.ext', exitCode: 2 }]);
                })
                .then(done, done);
        });

        it('should handle invalid file', function (done) {
            algorithms.algorithm1.returns(Q.reject());
            algorithms.algorithm2.returns(Q.reject());

            _lint(['file.ext'], [algorithms.algorithm1, algorithms.algorithm2])
                .then(function (res) {
                    algorithms.algorithm2.should.not.be.called;
                    res.should.be.eql([{ name: 'file.ext', exitCode: 1 }]);
                })
                .then(done, done);
        });

        it('should report the results (`html` and `flat` reports)', function (done) {
            _lint([], [], { reporters: ['flat', 'html'] })
                .should.be.fulfilled
                .then(function () {
                    FlatReporter.prototype.write.should.be.called;
                    HtmlReporter.prototype.write.should.be.called;
                })
                .then(done, done);
        });

        describe('tolerance', function () {
            it('should throw on tolerance < 0', function () {
                (function () {
                    _lint([], [], { tolerance: -1 });
                }).should.throw();
            });

            describe('should treat tolerance === 0 as percentages', function () {
                it('should consider a file to be optimized', function (done) {
                    _setCompression('algorithm1', 0);

                    _lint(['file.ext'], [algorithms.algorithm1], { tolerance: 0 })
                        .then(function (res) {
                            res.should.be.eql([{ name: 'file.ext', isOptimized: true, exitCode: 0 }]);
                        })
                        .then(done, done);
                });

                it('should consider a file to be NOT optimized', function (done) {
                    _setCompression('algorithm1', -1);

                    _lint(['file.ext'], [algorithms.algorithm1], { tolerance: 0 })
                        .then(function (res) {
                            res.should.be.eql([{ name: 'file.ext', isOptimized: false, exitCode: 0 }]);
                        })
                        .then(done, done);
                });
            });

            describe('should treat tolerance (0, 1) as percentages', function () {
                it('should consider a file to be optimized', function (done) {
                    _setCompression('algorithm1', -1);

                    _lint(['file.ext'], [algorithms.algorithm1], { tolerance: 0.1 })
                        .then(function (res) {
                            res.should.be.eql([{ name: 'file.ext', isOptimized: true, exitCode: 0 }]);
                        })
                        .then(done, done);
                });

                it('should consider a file to be NOT optimized', function (done) {
                    _setCompression('algorithm1', -2);

                    _lint(['file.ext'], [algorithms.algorithm1], { tolerance: 0.1 })
                        .then(function (res) {
                            res.should.be.eql([{ name: 'file.ext', isOptimized: false, exitCode: 0 }]);
                        })
                        .then(done, done);
                });
            });

            describe('should treat tolerance === 1 as bytes', function () {
                it('should consider a file to be optimized', function (done) {
                    _setCompression('algorithm1', -1);

                    _lint(['file.ext'], [algorithms.algorithm1], { tolerance: 1 })
                        .then(function (res) {
                            res.should.be.eql([{ name: 'file.ext', isOptimized: true, exitCode: 0 }]);
                        })
                        .then(done, done);
                });

                it('should consider a file to be NOT optimized', function (done) {
                    _setCompression('algorithm1', -2);

                    _lint(['file.ext'], [algorithms.algorithm1], { tolerance: 1 })
                        .then(function (res) {
                            res.should.be.eql([{ name: 'file.ext', isOptimized: false, exitCode: 0 }]);
                        })
                        .then(done, done);
                });
            });

            describe('should treat tolerance > 1 as bytes', function () {
                it('should consider a file to be optimized', function (done) {
                    _setCompression('algorithm1', -2);

                    _lint(['file.ext'], [algorithms.algorithm1], { tolerance: 2 })
                        .then(function (res) {
                            res.should.be.eql([{ name: 'file.ext', isOptimized: true, exitCode: 0 }]);
                        })
                        .then(done, done);
                });

                it('should consider a file to be NOT optimized', function (done) {
                    _setCompression('algorithm1', -3);

                    _lint(['file.ext'], [algorithms.algorithm1], { tolerance: 2 })
                        .then(function (res) {
                            res.should.be.eql([{ name: 'file.ext', isOptimized: false, exitCode: 0 }]);
                        })
                        .then(done, done);
                });
            });
        });
    });
});
