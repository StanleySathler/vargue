const fs = require('fs');
const path = require('path');

const readFile = file =>
  fs.readFileSync(
    file,
    { encoding: 'utf8' }
  );

const readDir = dir => {
  const names = fs.readdirSync(path.join(
    process.cwd(),
    dir
  ));

  return names.map(name =>
    path.join(process.cwd(), dir, name)
  );
};

const readLayoutFile = name =>
  readFile(
    path.join(
      process.cwd(),
      'layouts',
      `${name}.layout.html`
    )
  );

const existDir = dir =>
  fs.existsSync(
    path.join(
      process.cwd(),
      dir
    )
  );

const createDir = dir =>
  fs.mkdirSync(
    path.join(
      process.cwd(),
      dir
    )
  );

const writePostFile = (filename, html) => {
  if (!existDir('public'))
    createDir('public');

  fs.writeFileSync(
    path.join(
      process.cwd(),
      'public',
      `${filename}.html`
    ),
    html
  );
};

const writeIndexFile = html => {
  fs.writeFileSync(
    path.join(
      process.cwd(),
      `index.html`
    ),
    html
  );
};

module.exports = {
  readFile,
  readDir,
  readLayoutFile,
  writePostFile,
  writeIndexFile,
};
