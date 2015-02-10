require('colors');

module.exports = [
    'file.ext'.bold + ' - saved ' + '100500'.bold.green + ' bytes',
    'file.fake'.bold + ' - ' + 'compression failed'.bold.red,
    'fake.ext'.bold  + ' - ' + 'does not exist'.bold.red
].join('\n') + '\n';
