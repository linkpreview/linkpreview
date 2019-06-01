
const path = require('path');
const sizeof = require('object-sizeof');

const cache = {};

//50MB limit in bytes
const SIZE_LIMIT = 50 * 1024 * 1024;

exports.set = (key, value) => {
  if(sizeof(cache) > SIZE_LIMIT) {
    return null;
  }

  if(!cache[key]) {
    cache[key] = value;
  }
  return cache;
};

exports.get = (key) => {
  return cache[key];
}

exports.remove = (key) => {
  if(cache[key]) {
    return delete cache[key];
  }
  return false;
}

exports.purge = () => {
  return Object.keys(cache).forEach((key) => { delete cache[key]; });
}
