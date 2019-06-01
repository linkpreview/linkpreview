const path = require('path');
const fs = require('fs');
const config = require(path.resolve('server/config'));

const checkFileExists = (path) => {
  return fs.existsSync(path);
};

const assetPath = 'public/assets/asset-manifest.json';
let assetManifest = {};
if(checkFileExists(assetPath)) {
  assetManifest = require(path.resolve(assetPath));
}

if(config.isDev) {
  assetManifest = {
    'images/linkpreview-logo.png': '/assets/images/linkpreview-logo.png',
  };
}

exports.images = {
  logo: assetManifest['images/linkpreview-logo.png'],
};
