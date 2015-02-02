var fs = require('fs'),
    mockFs = require('mock-fs'),
    File = require('../../lib/file'),
    PNG_IMG = new Buffer([137, 80, 78, 71]);

describe('File', function () {
    beforeEach(function () {
        mockFs({
            'file.ext': PNG_IMG
        });
    });

    afterEach(function () {
        mockFs.restore();
    });

    it('must load size', function (done) {
        var file = new File('file.ext');

        file.loadSize()
            .then(function () {
                file.size.must.be.equal(4);
            })
            .then(done, done);
    });

    it('must load type', function (done) {
        var file = new File('file.ext');

        file.loadType()
            .then(function () {
                file.type.must.be.equal('png');
            })
            .then(done, done);
    });

    it('must remove file', function (done) {
        var file = new File('file.ext');

        file.remove()
            .then(function () {
                fs.readdirSync('.').must.be.eql([]);
            })
            .then(done, done);
    });

    it('must detect large file', function () {
        var file = new File('big.ext', 256001);

        file.isLarge().must.be(true);
    });

    it('must detect small file', function () {
        var file = new File('small.ext', 2047);

        file.isSmall().must.be(true);
    });
});
