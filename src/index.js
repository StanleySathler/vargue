const path = require('path');
const chalk = require('chalk');
const loadPrismLanguages = require('prismjs/components/');

const { compileMarkdownFile } = require('./parser');
const {
  injectPostIntoPostLayout,
  injectPostsIntoIndexLayout,
} = require('./layouts');
const {
  readDir,
  writePostFile,
  writeIndexFile,
} = require('./fs');

/**
 * Start compiling every post and building
 * HTML files.
 */
module.exports.build = function() {
  loadPrismLanguages(['textile']);

  const postFiles = readDir('posts').reverse();

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
    '✨ Files emitted successfully!!!'
  ));
}
