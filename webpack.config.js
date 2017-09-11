var path = require('path');

module.exports = {
  entry: './lineup_generator.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};
