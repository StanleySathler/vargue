const Sqrl = require('squirrelly-fork');
const { readLayoutFile } = require('./fs');

module.exports.injectPostIntoPostLayout = post => {
  const template = readLayoutFile('post');
  return Sqrl.Render(
    template,
    post
  );
};

module.exports.injectPostsIntoIndexLayout = posts => {
  const template = readLayoutFile('index');
  return Sqrl.Render(
    template,
    { posts },
  );
};
