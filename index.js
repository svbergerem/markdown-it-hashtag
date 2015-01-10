// Process #hashtag

'use strict';

//////////////////////////////////////////////////////////////////////////
// Renderer partials

function hashtag_open(tokens, idx) {
  var tagName = tokens[idx].content.toLowerCase();
  return '<a href="/tags/' + tagName + '" class="tag">';
}

function hashtag_close() { return '</a>'; }

function hashtag_text(tokens, idx) {
  return '#' + tokens[idx].content;
}

//////////////////////////////////////////////////////////////////////////

function isLinkOpen(str)  { return /^<a[>\s]/i.test(str); }
function isLinkClose(str) { return /^<\/a\s*>/i.test(str); }

module.exports = function hashtag_plugin(md, options) {

  var arrayReplaceAt = md.utils.arrayReplaceAt;

  function hashtag(state) {
    var i, j, l, m,
        tagName,
        token,
        tokens,
        blockTokens = state.tokens,
        htmlLinkLevel,
        matches,
        text,
        nodes,
        pos,
        level,
        regex,
        preceding     = '^|\\s',
        hashtagRegExp = '\\w+';

    if (options) {
      if (typeof options.preceding !== 'undefined') {
        preceding = options.preceding;
      }
      if (typeof options.hashtagRegExp !== 'undefined') {
        hashtagRegExp = options.hashtagRegExp;
      }
    }

    regex = new RegExp('(' + preceding + ')#(' + hashtagRegExp + ')', 'g');

    for (j = 0, l = blockTokens.length; j < l; j++) {
      if (blockTokens[j].type !== 'inline') { continue; }
      tokens = blockTokens[j].children;
      htmlLinkLevel = 0;

      for (i = tokens.length - 1; i >= 0; i--) {
        token = tokens[i];

        // skip content of markdown links
        if (token.type === 'link_close') {
          i--;
          while (tokens[i].level !== token.level && tokens[i].type !== 'link_open') {
            i--;
          }
          continue;
        }

        // skip content of html links
        if (token.type === 'html_inline') {
          // we are going backwards, so isLinkOpen shows end of link
          if (isLinkOpen(token.content) && htmlLinkLevel > 0) {
            htmlLinkLevel--;
          }
          if (isLinkClose(token.content)) {
            htmlLinkLevel++;
          }
        }
        if (htmlLinkLevel > 0) { continue; }

        if (token.type !== 'text') { continue; }

        // find hashtags
        text = token.content;
        matches = text.match(regex);
        if (matches === null) { continue; }
        nodes = [];
        level = token.level;

        for (m = 0; m < matches.length; m++) {
          tagName = matches[m].split('#', 2)[1];

          pos = text.indexOf(tagName);

          if (pos > 0) {
            nodes.push({
              type: 'text',
              // char at pos-1 is '#'
              content: text.slice(0, pos - 1),
              level: level
            });
          }
          nodes.push({
            type: 'hashtag_open',
            content: tagName,
            level: level++
          });
          nodes.push({
            type: 'hashtag_text',
            content: tagName,
            level: level
          });
          nodes.push({
            type: 'hashtag_close',
            level: --level
          });
          text = text.slice(pos + tagName.length);
        }

        if (text.length > 0) {
          nodes.push({
            type: 'text',
            content: text,
            level: state.level
          });
        }

        // replace current node
        tokens = arrayReplaceAt(tokens, i, nodes);
        blockTokens[j].children = tokens;
      }
    }
  }

  md.core.ruler.after('inline', 'hashtag', hashtag);
  md.renderer.rules.hashtag_open  = hashtag_open;
  md.renderer.rules.hashtag_text  = hashtag_text;
  md.renderer.rules.hashtag_close = hashtag_close;
};
