/*! markdown-it-hashtag 0.0.1 https://github.com/svbergerem/markdown-it-hashtag @license MIT */!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.markdownitHashtag=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

module.exports = function hashtag_plugin(md, options) {
  function hashtag(state) {
    var tagName,
        max = state.posMax,
        start = state.pos,
        pos,
        preceedingChar = /\s/,
        hashtagChar    = /\w/;

    if (options) {
      if (typeof options.preceedingChar !== 'undefined') {
        preceedingChar = options.preceedingChar;
      }
      if (typeof options.hashtagChar !== 'undefined') {
        hashtagChar = options.hashtagChar;
      }
    }

    if (state.src.charCodeAt(start) !== 0x23/* # */) { return false; }
    // either the tag is at the beginning of the line or
    // there has to be a whitespace in front of the tag
    if (start > 0 && !preceedingChar.test(state.src.charAt(start - 1))) {
      return false;
    }
    // we need at least one char for a tag
    if (start + 1 > max || !hashtagChar.test(state.src.charAt(start + 1))) {
      return false;
    }

    pos = start + 1;

    while (pos < max && hashtagChar.test(state.src.charAt(pos))) {
      pos++;
    }

    tagName = state.src.slice(start + 1, pos);

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

},{}]},{},[1])(1)
});