require('colors');

module.exports = [
    'file1.ext'.bold + ' - ' + 'optimized'.bold.green,
    'file2.ext'.bold + ' - ' + 'not optimized'.bold.red,
    'file.fake'.bold + ' - ' + 'compression failed'.bold.red,
    'fake.ext'.bold  + ' - ' + 'does not exist'.bold.red
].join('\n') + '\n';
