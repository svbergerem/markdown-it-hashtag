const path = require("path"),
      generate = require("markdown-it-testgen"),
      MarkdownIt = require("markdown-it"),
      hashtagPlugin = require("../");

describe("markdown-it", function() {
  const md = new MarkdownIt({
    html: true,
    langPrefix: "",
    typographer: true,
    linkify: true
  });

  md.use(hashtagPlugin);
  generate(path.join(__dirname, "fixtures/vendor/markdown-it"), md);
});
