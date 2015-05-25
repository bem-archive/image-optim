var path = require('path'),
    fs = require('fs'),
    qfs = require('q-io/fs'),
    sinon = require('sinon'),
    HtmlDiffer = require('html-differ').HtmlDiffer,
    htmlDiffer = new HtmlDiffer(),
    logger = require('html-differ/lib/logger'),
    reporters = require('../../lib/reporters'),
    BaseReporterClass = require('../../lib/reporters/reporter');

describe('reporters', function () {
    describe('base class', function () {
        var baseReporterClass = new BaseReporterClass();

        it('should throw on usage of private not implemeted method `_format`', function () {
            (function () {
                baseReporterClass._format();
            }).should.throw();
        });

        it('should throw on usage of private not implemeted method `_handle`', function () {
            (function () {
                baseReporterClass._handle();
            }).should.throw();
        });
    });

    describe('flat', function () {
        beforeEach(function () {
            sinon.stub(process.stdout, 'write');
        });

        afterEach(function () {
            process.stdout.write.restore();
        });

        it('should report optim results', function (done) {
            var input = [
                    { name: 'file.fake', exitCode: 1 },
                    { name: 'fake.ext', exitCode: 2 },
                    { name: 'file.ext', savedBytes: 100500, exitCode: 0 }
                ],
                output = require('./fixtures/optim');

            reporters.mk('flat', 'optim').write(input)
                .then(function () {
                    process.stdout.write.lastCall.args[0].should.be.equal(output);
                })
                .then(done, done);
        });

        it('should report lint results', function (done) {
            var input = [
                    { name: 'file.fake', exitCode: 1 },
                    { name: 'file2.ext', isOptimized: false, exitCode: 0 },
                    { name: 'file1.ext', isOptimized: true, exitCode: 0 },
                    { name: 'fake.ext', exitCode: 2 }
                ],
                output = require('./fixtures/lint');

            reporters.mk('flat', 'lint').write(input)
                .then(function () {
                    process.stdout.write.lastCall.args[0].should.be.equal(output);
                })
                .then(done, done);
        });
    });

    describe('html', function () {
        function assertHtmlDiff(stub, output) {
            var html = stub.lastCall.args[1],
                diff = htmlDiffer.diffHtml(html, output);

            logger.logDiffText(diff, { charsAroundDiff: 40 });
            htmlDiffer.isEqual(html, output).should.be.equal(true);
        }

        beforeEach(function () {
            sinon.stub(qfs, 'write');
        });

        afterEach(function () {
            qfs.write.restore();
        });

        it('should report optim results', function (done) {
            var input = [
                    { name: 'file.fake', exitCode: 1 },
                    { name: 'fake.ext', exitCode: 2 },
                    { name: 'file.ext', savedBytes: 100500, exitCode: 0 }
                ],
                output = fs.readFileSync(path.join(__dirname, 'fixtures/optim.html'), 'utf-8');

            reporters.mk('html', 'optim').write(input)
                .then(function () {
                    assertHtmlDiff(qfs.write, output);
                })
                .then(done, done);
        });

        it('should report lint results', function (done) {
            var input = [
                    { name: 'file.fake', exitCode: 1 },
                    { name: 'file2.ext', isOptimized: false, exitCode: 0 },
                    { name: 'file1.ext', isOptimized: true, exitCode: 0 },
                    { name: 'fake.ext', exitCode: 2 }
                ],
                output = fs.readFileSync(path.join(__dirname, 'fixtures/lint.html'), 'utf-8');

            reporters.mk('html', 'lint').write(input)
                .then(function () {
                    assertHtmlDiff(qfs.write, output);
                })
                .then(done, done);
        });
    });
});
