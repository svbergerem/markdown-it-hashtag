# markdown-it-hashtag

[![Build Status](https://img.shields.io/travis/svbergerem/markdown-it-hashtag/master.svg?style=flat)](https://travis-ci.org/svbergerem/markdown-it-hashtag)
[![Coverage Status](https://img.shields.io/coveralls/svbergerem/markdown-it-hashtag/master.svg?style=flat)](https://coveralls.io/r/svbergerem/markdown-it-hashtag?branch=master)
[![npm version](https://img.shields.io/npm/v/markdown-it-hashtag.svg?style=flat)](https://npmjs.com/package/markdown-it-hashtag)

> hashtag (`#tag`) plugin for [markdown-it](https://github.com/markdown-it/markdown-it) markdown parser.

`#hashtag` => `<a href="/tags/hashtag" class="tag">#hashtag</a>`

## Install

node.js, bower:

```bash
npm install markdown-it-hashtag --save
bower install markdown-it-hashtag --save
```

## Use

#### Basic

```js
var md = require('markdown-it')()
            .use(require('markdown-it-hashtag'));

md.render('#hashtag'); // => '<p><a href="/tags/hashtag" class="tag">#hashtag</a></p>'
```

_Differences in browser._ If you load the script directly into the page, without
package system, module will add itself globally as `window.markdownitHashtag`.

#### Advanced

You can specify the RegExp for hashtags and specify the allowed preceding content. You can also
modify the output of the renderer. Here is an example with default values:

```js
var md = require('markdown-it')()
            .use(require('markdown-it-hashtag'),{
              // pattern for hashtags with normal string escape rules
              hashtagRegExp: '\\w+',
              // pattern for allowed preceding content
              preceding:     '^|\\s'
            });

md.renderer.rules.hashtag_open  = function(tokens, idx) {
  var tagName = tokens[idx].content.toLowerCase(); 
  return '<a href="/tags/' + tagName + '" class="tag">';
}

md.renderer.rules.hashtag_text  = function(tokens, idx) {
  return '#' + tokens[idx].content;
}

md.renderer.rules.hashtag_close = function { return '</a>'; }

md.render('#hashtag'); // => '<p><a href="/tags/hashtag" class="tag">#hashtag</a></p>'
```

## License

[MIT](https://github.com/svbergerem/markdown-it-hashtag/blob/master/LICENSE)
