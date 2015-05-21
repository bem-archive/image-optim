var qexec = require('../../lib/qexec');

describe('qexec', function () {
    it('should exec `pwd` command', function (done) {
        qexec('pwd')
            .then(function (res) {
                res.should.be.equal(process.cwd());
            })
            .then(done, done);
    });
});
