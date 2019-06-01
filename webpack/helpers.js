/**
 * Get public path according to build type
 * @param path
 * @returns {*}
 */
exports.getPublicPath = (path) => {

  if(process.env.__CDN_STAGING__) {
    return 'https://cdn-stage.namchey.group' + path;
  }

  if(process.env.__CDN_PROD__) {
    return 'https://cdn-prod.namchey.group' + path;
  }

  return path;

};