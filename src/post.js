const isPublished = post =>
  !post.headers.draft;

module.exports = {
  isPublished
};
