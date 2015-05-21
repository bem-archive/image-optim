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

    it('should load size', function (done) {
        var file = new File('file.ext');

        file.loadSize()
            .then(function () {
                file.size.should.be.equal(4);
            })
            .then(done, done);
    });

    it('should load type', function (done) {
        var file = new File('file.ext');

        file.loadType()
            .then(function () {
                file.type.should.be.equal('png');
            })
            .then(done, done);
    });

    it('should remove file', function (done) {
        var file = new File('file.ext');

        file.remove()
            .then(function () {
                fs.readdirSync('.').should.be.eql([]);
            })
            .then(done, done);
    });

    it('should detect large file', function () {
        var file = new File('big.ext', 256001);

        file.isLarge().should.be.equal(true);
    });

    it('should detect small file', function () {
        var file = new File('small.ext', 2047);

        file.isSmall().should.be.equal(true);
    });
});
