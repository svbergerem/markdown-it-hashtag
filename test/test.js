'use strict';

var path     = require('path');
var generate = require('markdown-it-testgen');

/*eslint-env mocha*/

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
      hashtagChar:    /[\x0080-\xFFFF\w\-]/,
      preceedingChar: /\s/,
      specialTags:    /<3/
    });
    generate(path.join(__dirname, 'fixtures/hashtag/options.txt'), md);
  });

  it('doesn\'t break normal markup', function () {
    md.use(require('../'));
    generate(path.join(__dirname, 'fixtures/markdown-it'), md);
  });
});
