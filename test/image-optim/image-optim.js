var fs = require('fs'),
    mockFs = require('mock-fs'),
    algorithms = require('./mocks/algorithms'),
    errorAlgorithms = require('./mocks/error-algorithms'),
    modes = require('../../lib/modes'),
    imageOptim = require('../../lib/image-optim');

describe('image-optim', function () {
    beforeEach(function () {
        mockFs({
            '1.ext': new Buffer(10),
            '2.ext': new Buffer(6)
        });
    });

    afterEach(function () {
        mockFs.restore();
    });

    describe('optim', function () {
        it('must optimize files', function (done) {
            var files = fs.readdirSync('.');
            files.push('fake.ext');

            var output = [
                    { name: '1.ext', savedBytes: 1 },
                    { name: '2.ext', savedBytes: 1 },
                    { name: 'fake.ext', savedBytes: 'Does not exist' }
                ];

            imageOptim(files, modes.optim, algorithms)
                .then(function (res) {
                    res.must.be.eql(output);
                })
                .then(done, done);
        });

        it('must not optimize invalid files', function (done) {
            var files = fs.readdirSync('.'),
                output = [
                    { name: '1.ext', savedBytes: 'Can not be compressed' },
                    { name: '2.ext', savedBytes: 'Can not be compressed' }
                ];

            imageOptim(files, modes.optim, errorAlgorithms)
                .then(function (res) {
                    res.must.be.eql(output);
                })
                .then(done, done);
        });
    });

    describe('lint', function () {
        it('must lint files', function (done) {
            var files = fs.readdirSync('.');
            files.push('fake.ext');

            var output = [
                { name: '1.ext', isOptimized: false },
                { name: '2.ext', isOptimized: false },
                { name: 'fake.ext', isOptimized: 'Does not exist' }
            ];

            imageOptim(files, modes.lint, algorithms)
                .then(function (res) {
                    res.must.be.eql(output);
                })
                .then(done, done);
        });

        it('must not lint invalid files', function (done) {
            var files = fs.readdirSync('.'),
                output = [
                    { name: '1.ext', isOptimized: 'Can not be compressed' },
                    { name: '2.ext', isOptimized: 'Can not be compressed' }
                ];

            imageOptim(files, modes.lint, errorAlgorithms)
                .then(function (res) {
                    res.must.be.eql(output);
                })
                .then(done, done);
        });

        it('must work option \'tolerance\'', function (done) {
            var files = fs.readdirSync('.'),
                output = [{ name: '1.ext', isOptimized: true }, { name: '2.ext', isOptimized: true }];

            imageOptim(files, modes.lint, algorithms, { tolerance: 1 })
                .then(function (res) {
                    res.must.be.eql(output);
                })
                .then(done, done);
        });
    });
});
