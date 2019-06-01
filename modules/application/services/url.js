
exports.urlSafe = function(string) {
  const url = string.replace(/[^a-z0-9_\-]/gi, '-').replace(/-{2,}/g, '-').replace(/^\-|\-$/, '').toLowerCase();
  return url;
};