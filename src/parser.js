const fs = require('fs');
const path = require('path');
const FrontMatter = require('parser-front-matter');
const marked = require('marked');
const Sqrl = require('squirrelly-fork');
const chalk = require('chalk');
const Prism = require('prismjs');
const loadPrismLanguages = require('prismjs/components/');
const format = require('date-fns/format');
const br = require('date-fns/locale/pt-BR');

/**
 * Date filter.
 */
Sqrl.defineFilter('date', date => {
  return format(date, 'dd MMM yyyy', { locale: br });
});

/**
 * Read all file names in a dir.
 * @param {string} dir e.g. '/home/blog/posts'
 * @returns {string[]} e.g. [
 *  'home/blog/posts/post-1.md',
 *  'home/blog/posts/post-2.md'
 * ]
 */
const readDir = dir => {
  const names = fs.readdirSync(path.join(
    process.cwd(),
    dir
  ));

  return names.map(name =>
    path.join(process.cwd(), dir, name)
  );
};

/**
 * Read a file and return its content.
 */
const readFile = file =>
  fs.readFileSync(
    file,
    { encoding: 'utf8' }
  );

/**
 *
 * @param {*} code
 * @param {*} lang
 */
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

/**
 * Read a Markdown file, parse its headers and compile
 * the Markdown content to HTML.
 * @param {string} file e.g. '/home/stanley/blog/post-1.md'
 * @returns {object} e.g. {
 *  filename: 'post-1',
 *  headers: { title: 'Stanley' },
 *  html: '<h1>Post title</h1>'
 * }
 */
const compileMarkdownFile = file => {
  // Read markdown file (content and headers)
  const fileContent = readFile(file);

  // Parse headers and content using FrontMatter
  const { data: headers, content } = FrontMatter.parseSync(fileContent);

  // // Compile markdown to HTML
  marked.setOptions({ highlight });
  const html = marked(content);

  // Extract file name (e.g. "post-1")
  const filename = path.parse(file).name;

  return {
    filename,
    headers,
    html,
    url: `/public/${filename}.html`
  };
};

/**
 * Read a layout file.
 *
 * @param {string} name e.g. 'post'
 * @returns {string} e.g. `
 *  <html>
 *    <head>
 *      <title>{{headers.title}}</title>
 *    </head>
 *    <body>
 *      {{html}}
 *    </body>
 *  </html>
 * `
 */
const readLayoutFile = name =>
  readFile(
    path.join(
      process.cwd(),
      'layouts',
      `${name}.layout.html`
    )
  );

/**
 * Inject the post object into the template file.
 *
 * @param {object} post e.g. {
 *  headers: { title: 'Post title' },
 *  filename: 'post-1',
 *  html: '<h1>Post content</h1>'
 * }
 * @returns e.g. `
 *  <html>
 *    <head>
 *      <title>Post title</title>
 *    </head>
 *    <body>
 *      <h1>Post content</h1>
 *    </body>
 *  </html>
 * `
 */
const injectPostIntoPostLayout = post => {
  // Read template file.
  const template = readLayoutFile('post');

  // Inject variables into template file.
  return Sqrl.Render(
    template,
    post
  );
};

/**
 * Write a post file in the output dir.
 * @param {String} filename e.g. 'post-1'
 * @param {String} html e.g. <html><body>...</body></html>
 */
const writePostFile = (filename, html) => {
  fs.writeFileSync(
    path.join(
      process.cwd(),
      'public',
      `${filename}.html`
    ),
    html
  );
};

/**
 * Get a list of posts and inject them into the
 * index template.
 *
 * @param {object[]} posts e.g. [{ headers, filename, html }]
 */
const injectPostsIntoIndexLayout = posts => {
  // Read template file.
  const template = readLayoutFile('index');

  // Inject variables into template file.
  return Sqrl.Render(
    template,
    { posts },
  );
};

/**
 * Write the index file in the root dir.
 * @param {String} html e.g. <html><body>...</body></html>
 */
const writeIndexFile = html => {
  fs.writeFileSync(
    path.join(
      process.cwd(),
      `index.html`
    ),
    html
  );
};

module.exports.generate = function() {
  loadPrismLanguages(['textile']);

  const postFiles = readDir('posts');

  // Parse every single post.
  // Post: { filename, headers, html }
  const posts = postFiles.map(compileMarkdownFile);

  // Build a page for every post.
  posts.forEach(post => {
    const pageHtml = injectPostIntoPostLayout(post);
    writePostFile(post.filename, pageHtml);
  });

  // Build the index page.
  const indexHtml = injectPostsIntoIndexLayout(posts);
  writeIndexFile(indexHtml);

  console.log(chalk.blueBright(
    `[+] Posts: ${path.join(process.cwd(), 'public')}`
  ));
  console.log(chalk.green.bold(
    '✨ Files emitted successfully!'
  ));
}
