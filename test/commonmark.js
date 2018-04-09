const p = require("path"),
      load = require("markdown-it-testgen").load,
      assert = require("chai").assert,
      MarkdownIt = require("markdown-it"),
      hashtagPlugin = require("../");

function normalize(text) {
  return text.replace(/<blockquote>\n<\/blockquote>/g, "<blockquote></blockquote>");
}

function generate(path, md) {
  load(path, function(data) {
    let desc;
    data.meta = data.meta || {};
    desc = data.meta.desc || p.relative(path, data.file);
    (data.meta.skip ? describe.skip : describe)(desc, function() {
      data.fixtures.forEach(function(fixture) {
        it(fixture.header ? fixture.header : "line " + (fixture.first.range[0] - 1), function() {
          assert.strictEqual(md.render(fixture.first.text), normalize(fixture.second.text));
        });
      });
    });
  });
}

describe("CommonMark", function() {
  const md = new MarkdownIt("commonmark");
  md.use(hashtagPlugin);
  generate(p.join(__dirname, "fixtures/vendor/commonmark/good.txt"), md);
});
