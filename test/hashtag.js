const path = require("path"),
      generate = require("markdown-it-testgen"),
      MarkdownIt = require("markdown-it"),
      hashtagPlugin = require("../");

describe("markdown-it-hashtag", function() {
  let md;

  beforeEach(function() {
    md = new MarkdownIt({
      html: true,
      langPrefix: "",
      typographer: true,
      linkify: true
    });
  });

  it("applies markup to hashtags", function() {
    md.use(hashtagPlugin);
    generate(path.join(__dirname, "fixtures/hashtag/default.txt"), md);
  });

  it("accepts options", function() {
    md.use(hashtagPlugin, {
      hashtagRegExp: "[\\x0080-\\xFFFF\\w\\-]+|<3",
      preceding: "^|\\s"
    });
    generate(path.join(__dirname, "fixtures/hashtag/options.txt"), md);
  });
});
