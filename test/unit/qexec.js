var qexec = require('../../lib/qexec');

describe('qexec', function () {
    it('must exec \'pwd\' command', function (done) {
        qexec('pwd')
            .then(function (res) {
                res.must.be.equal(process.cwd());
            })
            .then(done, done);
    });
});
