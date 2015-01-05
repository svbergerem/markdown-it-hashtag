// Process #hashtag

'use strict';

//////////////////////////////////////////////////////////////////////////
// Renderer partials

function hashtag_open(tokens, idx) {
  var tagName = tokens[idx].content.toLowerCase();
  return '<a class="tag" href="/tags/' + tagName + '">';
}

function hashtag_close() { return '</a>'; }

function hashtag_text(tokens, idx) {
  return '#' + tokens[idx].content;
}


//////////////////////////////////////////////////////////////////////////

function findHashtag(string, start, end, validChar, specialTags) {
  var tagName, pos;
  // we need at least one char for a tag
  if (start + 1 > end) {
    return null;
  }

  // check if we have special tags
  if (typeof specialTags !== 'undefined') {
    var match = specialTags.exec(string.slice(start + 1, end));
    // we found a special tag
    if (match !== null && match.index === 0) {
      tagName = match[0];
      pos = start + 1 + tagName.length;
      return { tag: tagName, pos: pos };
    }
  }

  // no special tag and no valid char -> no hashtag
  if (!validChar.test(string.charAt(start + 1))) {
    return null;
  }

  // there is a regular tag
  pos = start + 1;
  while (pos < end && validChar.test(string.charAt(pos))) {
    pos++;
  }
  tagName = string.slice(start + 1, pos);
  return { tag: tagName, pos: pos };
}



//////////////////////////////////////////////////////////////////////////

module.exports = function hashtag_plugin(md, options) {
  function hashtag(state) {
    var tagName,
        max = state.posMax,
        start = state.pos,
        pos,
        preceedingChar = /\s/,
        hashtagChar    = /\w/,
        specialTags;

    if (options) {
      if (typeof options.preceedingChar !== 'undefined') {
        preceedingChar = options.preceedingChar;
      }
      if (typeof options.hashtagChar !== 'undefined') {
        hashtagChar = options.hashtagChar;
      }
      if (typeof options.specialTags !== 'undefined') {
        specialTags = options.specialTags;
      }
    }

    if (state.src.charCodeAt(start) !== 0x23/* # */) { return false; }
    // either the tag is at the beginning of the line or
    // there has to be a whitespace in front of the tag
    if (start > 0 && !preceedingChar.test(state.src.charAt(start - 1))) {
      return false;
    }

    var result = findHashtag(state.src, start, max, hashtagChar, specialTags);

    if (result === null) {
      return false;
    }

    pos = result.pos;
    tagName = result.tag;

    state.posMax = pos;
    state.pos = start + 1;

    state.push({
      type: 'hashtag_open',
      level: state.level++,
      content: tagName
    });
    state.push({
      type: 'hashtag_text',
      level: state.level,
      content: tagName
    });
    state.push({ type: 'hashtag_close', level: --state.level });

    state.pos = pos;
    state.posMax = max;
    return true;
  }

  md.inline.ruler.before('text', 'hashtag', hashtag);
  md.renderer.rules.hashtag_open  = hashtag_open;
  md.renderer.rules.hashtag_text  = hashtag_text;
  md.renderer.rules.hashtag_close = hashtag_close;
};
