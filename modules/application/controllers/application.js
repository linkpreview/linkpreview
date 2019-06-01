
const path = require('path'),
  fs = require('fs');

exports.errorView = (templatePath) => (req, res, next) => {
  const errorTemplate = fs.createReadStream(path.resolve(templatePath));
  res.setHeader('Content-Type', 'text/html');
  return errorTemplate.pipe(res);
};


exports.openSearch = (req, res, next) => {

}


exports.favicon = (req, res, next) => {

}

exports.sitemap = (req, res, next) => {

}
