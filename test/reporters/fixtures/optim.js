var chalk = require('chalk'),
    bold = chalk.bold,
    boldGreen = bold.green,
    boldRed = bold.red;

module.exports = [
    bold('file.ext') + ' - saved ' + boldGreen('100500') + ' bytes',
    bold('file.fake') + ' - ' + boldRed('compression failed'),
    bold('fake.ext')  + ' - ' + boldRed('does not exist')
].join('\n') + '\n';
