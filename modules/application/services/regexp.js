/**
 * Escape for special characters for regular expression
 * https://stackoverflow.com/questions/2593637/how-to-escape-regular-expression-in-javascript
 * @param text
 * @returns {*}
 */
exports.escape =  (text) => {
  return (text+'').replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
};
