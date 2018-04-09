const renderHashtagOpen = (tokens, idx) => '<a href="/tags/' + tokens[idx].content.toLowerCase() + '" class="tag">',
      renderHashtagClose = () => "</a>",
      renderHashtagText = (tokens, idx) => "#" + tokens[idx].content,
      isLinkOpenRegExp = /^<a[>\s]/i,
      isLinkCloseRegExp = /^<\/a\s*>/i,
      isLinkOpen = (str) => isLinkOpenRegExp.test(str),
      isLinkClose = (str) => isLinkCloseRegExp.test(str);

module.exports = function hashtagPlugin(md, options) {
  const arrayReplaceAt = md.utils.arrayReplaceAt,
        escapeHtml = md.utils.escapeHtml,
        assign = md.utils.assign,
        defaultOpts = {
          preceding: "^|\\s",
          hashtagRegExp: "\\w+"
        },
        opts = typeof options === "object" ? assign(defaultOpts, options) : defaultOpts,
        regex = new RegExp("(" + opts.preceding + ")#(" + opts.hashtagRegExp + ")", "gu");

  function hashtag(state) {
    const Token = state.Token,
          blockTokens = state.tokens;
    let i, j, l, m,
        tagName,
        currentToken,
        token,
        tokens,
        htmlLinkLevel,
        matches,
        text,
        nodes,
        pos,
        level;

    for (j = 0, l = blockTokens.length; j < l; j++) {
      if (blockTokens[j].type !== "inline") {
        continue;
      }

      tokens = blockTokens[j].children;

      htmlLinkLevel = 0;

      for (i = tokens.length - 1; i >= 0; i--) {
        currentToken = tokens[i];

        // skip content of markdown links
        if (currentToken.type === "link_close") {
          i--;
          while (tokens[i].level !== currentToken.level && tokens[i].type !== "link_open") {
            i--;
          }
          continue;
        }

        // skip content of html links
        if (currentToken.type === "html_inline") {
          // we are going backwards, so isLinkOpen shows end of link
          if (isLinkOpen(currentToken.content) && htmlLinkLevel > 0) {
            htmlLinkLevel--;
          }
          if (isLinkClose(currentToken.content)) {
            htmlLinkLevel++;
          }
        }
        if (htmlLinkLevel > 0) {
          continue;
        }

        if (currentToken.type !== "text") {
          continue;
        }

        // find hashtags
        text = currentToken.content;
        matches = text.match(regex);

        if (matches === null) {
          continue;
        }

        nodes = [];
        level = currentToken.level;

        for (m = 0; m < matches.length; m++) {
          tagName = matches[m].split("#", 2)[1];

          // find the beginning of the matched text
          pos = text.indexOf(matches[m]);
          // find the beginning of the hashtag
          pos = text.indexOf("#" + tagName, pos);

          if (pos > 0) {
            token = new Token("text", "", 0);
            token.content = text.slice(0, pos);
            token.level = level;
            nodes.push(token);
          }

          token = new Token("hashtag_open", "", 1);
          token.content = tagName;
          token.level = level++;
          nodes.push(token);

          token = new Token("hashtag_text", "", 0);
          token.content = escapeHtml(tagName);
          token.level = level;
          nodes.push(token);

          token = new Token("hashtag_close", "", -1);
          token.level = --level;
          nodes.push(token);

          text = text.slice(pos + 1 + tagName.length);
        }

        if (text.length > 0) {
          token = new Token("text", "", 0);
          token.content = text;
          token.level = level;
          nodes.push(token);
        }

        // replace current node
        blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, nodes);
      }
    }
  }

  md.core.ruler.after("inline", "hashtag", hashtag);
  /* eslint-disable camelcase */
  md.renderer.rules.hashtag_open = renderHashtagOpen;
  md.renderer.rules.hashtag_text = renderHashtagText;
  md.renderer.rules.hashtag_close = renderHashtagClose;
  /* eslint-enable camelcase */
};
