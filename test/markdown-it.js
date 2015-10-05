'use strict';

var path = require('path');
var generate = require('markdown-it-testgen');

describe('markdown-it', function () {
  var md = require('markdown-it')({
    html: true,
    langPrefix: '',
    typographer: true,
    linkify: true
  });

  md.use(require('../'));
  generate(path.join(__dirname, 'fixtures/vendor/markdown-it'), md);
});
