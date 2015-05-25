var chalk = require('chalk'),
    bold = chalk.bold,
    boldGreen = bold.green,
    boldRed = bold.red;

module.exports = [
    bold('file1.ext') + ' - ' + boldGreen('optimized'),
    bold('file2.ext') + ' - ' + boldRed('not optimized'),
    bold('file.fake') + ' - ' + boldRed('compression failed'),
    bold('fake.ext')  + ' - ' + boldRed('does not exist')
].join('\n') + '\n';
