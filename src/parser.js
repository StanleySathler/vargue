const path = require('path');
const FrontMatter = require('parser-front-matter');
const marked = require('marked');
const Prism = require('prismjs');
require('./filters');

const { readFile } = require('./fs');

const highlight = (code, lang) => {
  const grammar = ['html', 'javascript'].includes(lang)
    ? Prism.languages[lang]
    : Prism.languages.textile;

  return Prism.highlight(
    code,
    grammar,
    lang,
  );
};

module.exports.compileMarkdownFile = file => {
  const fileContent = readFile(file);
  const { data: headers, content } = FrontMatter
    .parseSync(fileContent);

  marked.setOptions({ highlight });
  const html = marked(content);

  const filename = path.parse(file).name;

  return {
    filename,
    headers,
    html,
    url: `/public/${filename}.html`
  };
};
