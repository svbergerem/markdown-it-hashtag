'use strict';

var path     = require('path');
var generate = require('markdown-it-testgen');

describe('markdown-it-hashtag', function () {
  var md;

  beforeEach(function () {
    md = require('markdown-it')({
      html: true,
      langPrefix: '',
      typographer: true,
      linkify: true
    });
  });

  it('applies markup to hashtags', function () {
    md.use(require('../'));
    generate(path.join(__dirname, 'fixtures/hashtag/default.txt'), md);
  });

  it('accepts options', function () {
    md.use(require('../'), {
      hashtagRegExp: '[\\x0080-\\xFFFF\\w\\-]+|<3',
      preceding:     '^|\\s'
    });
    generate(path.join(__dirname, 'fixtures/hashtag/options.txt'), md);
  });
});
