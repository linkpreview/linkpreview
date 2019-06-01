/**
 * Check Type of a variable in reliable way
 * Src: https://stackoverflow.com/questions/7893776/the-most-accurate-way-to-check-js-objects-type
 * @type {{get: types.'get', null: string, object: string, array: string, string: string, boolean: string, number: string, date: string}}
 */

const types = {
  'get': function(prop) {
    return Object.prototype.toString.call(prop);
  },
  'null': '[object Null]',
  'object': '[object Object]',
  'array': '[object Array]',
  'string': '[object String]',
  'boolean': '[object Boolean]',
  'number': '[object Number]',
  'date': '[object Date]'
};

module.exports =  types;