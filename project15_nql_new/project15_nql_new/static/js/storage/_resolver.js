/**
 * @file _resolver.js
 * @author Yuvv
 * @date 2017/12/17
 */

var Urls = {};

Urls.resolve = function (name, kwargs) {
  var path = Urls._urls[name] || false;
  if (!path) {
      throw('URL not found for view: ' + name);
  }

  var _path = path;
  if (kwargs instanceof Object) {
    for (var key in kwargs) {
      if (kwargs.hasOwnProperty(key)) {
        if (!path.match('<' + key +'>')) {
            throw(key + ' does not exist in ' + _path);
        }
        path = path.replace('<' + key +'>', kwargs[key]);
      }
    }
  } else {
    for(var j=1; j<arguments.length; j++) {
      path = path.replace('<>', arguments[j]);
    }
  }

  var re = new RegExp('<.*?>', 'g');
  var missing_args = path.match(re);
  if (missing_args) {
    throw('Missing arguments (' + missing_args.join(", ") + ') for url ' + _path);
  }
  return path;
};