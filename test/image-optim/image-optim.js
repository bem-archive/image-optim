var Q = require('q'),
    sinon = require('sinon'),
    mockFs = require('mock-fs'),
    File = require('../../lib/file'),
    imageOptim = require('../../lib/image-optim'),
    PNG_IMG = new Buffer([137, 80, 78, 71]),
    algorithm1, algorithm2;

describe('image-optim', function () {
    beforeEach(function () {
        mockFs({
            'file.ext': Buffer.concat([PNG_IMG, new Buffer(6)]),

            'file.algorithm1.ext': '',
            'file.algorithm2.ext': ''
        });

        algorithm1 = sinon.stub(),
        algorithm2 = sinon.stub();
    });

    afterEach(function () {
        mockFs.restore();
    });

    describe('optim', function () {
        it('must optimize file', function (done) {
            var file = 'file.ext',
                output = [{ name: file, savedBytes: 2, exitCode: 0 }];

            algorithm1.returns(Q.resolve(new File('file.algorithm1.ext', 9)));
            algorithm2.returns(Q.resolve(new File('file.algorithm2.ext', 8)));

            imageOptim([file], 'optim', { png: [algorithm1, algorithm2] })
                .then(function (res) {
                    res.must.be.eql(output);
                })
                .then(done, done);
        });

        it('must NOT optimize file', function (done) {
            var file = 'file.ext',
                output = [{ name: file, savedBytes: 0, exitCode: 0 }];

            algorithm1.returns(Q.resolve(new File('file.algorithm1.ext', 10)));
            algorithm2.returns(Q.resolve(new File('file.algorithm2.ext', 11)));

            imageOptim([file], 'optim', { png: [algorithm1, algorithm2] })
                .then(function (res) {
                    res.must.be.eql(output);
                })
                .then(done, done);
        });

        it('must handle not existing file', function (done) {
            var file = 'fake.ext',
                output = [{ name: file, exitCode: 2 }];

            imageOptim([file], 'optim', { png: [algorithm1, algorithm2] })
                .then(function (res) {
                    res.must.be.eql(output);
                })
                .then(done, done);
        });

        it('must handle invalid file', function (done) {
            var file = 'file.ext',
                output = [{ name: file, exitCode: 1 }];

            algorithm1.returns(Q.reject());
            algorithm2.returns(Q.reject());

            imageOptim([file], 'optim', { png: [algorithm1, algorithm2] })
                .then(function (res) {
                    algorithm2.callCount.must.be.equal(0);
                    res.must.be.eql(output);
                })
                .then(done, done);
        });
    });

    describe('lint', function () {
        it('must lint optimized file', function (done) {
            var file = 'file.ext',
                output = [{ name: file, isOptimized: true, exitCode: 0 }];

            algorithm1.returns(Q.resolve(new File('file.algorithm1.ext', 10)));
            algorithm2.returns(Q.resolve(new File('file.algorithm2.ext', 11)));

            imageOptim([file], 'lint', { png: [algorithm1, algorithm2] })
                .then(function (res) {
                    res.must.be.eql(output);
                })
                .then(done, done);
        });

        it('must lint NOT optimized file', function (done) {
            var file = 'file.ext',
                output = [{ name: file, isOptimized: false, exitCode: 0 }];

            algorithm1.returns(Q.resolve(new File('file.algorithm1.ext', 9)));
            algorithm2.returns(Q.resolve(new File('file.algorithm2.ext', 8)));

            imageOptim([file], 'lint', { png: [algorithm1, algorithm2] })
                .then(function (res) {
                    algorithm2.callCount.must.be.equal(0);
                    res.must.be.eql(output);
                })
                .then(done, done);
        });

        it('must handle not existing file', function (done) {
            var file = 'fake.ext',
                output = [{ name: file, exitCode: 2 }];

            imageOptim([file], 'lint', { png: [algorithm1, algorithm2] })
                .then(function (res) {
                    res.must.be.eql(output);
                })
                .then(done, done);
        });

        it('must handle invalid file', function (done) {
            var file = 'file.ext',
                output = [{ name: file, exitCode: 1 }];

            algorithm1.returns(Q.reject());
            algorithm2.returns(Q.reject());

            imageOptim([file], 'lint', { png: [algorithm1, algorithm2] })
                .then(function (res) {
                    algorithm2.callCount.must.be.equal(0);
                    res.must.be.eql(output);
                })
                .then(done, done);
        });

        it('must work option \'tolerance\'', function (done) {
            var file = 'file.ext',
                output = [{ name: file, isOptimized: true, exitCode: 0 }];

            algorithm1.returns(Q.resolve(new File('file.algorithm1.ext', 10)));
            algorithm2.returns(Q.resolve(new File('file.algorithm2.ext', 9)));

            imageOptim([file], 'lint', { png: [algorithm1, algorithm2] }, { tolerance: 10 })
                .then(function (res) {
                    res.must.be.eql(output);
                })
                .then(done, done);
        });
    });
});
