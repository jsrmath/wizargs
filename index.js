var _ = require('underscore');

var ArgumentError = function(message) {
  var err = new Error();
  err.message = message;
  Error.captureStackTrace(err, ArgumentError);
  return err;
};

var ifUndef = function (val, def) {
  return typeof val === 'undefined' ? def : val;
};

var opt = function (name, val) { // Optional argument, potentially with a default, e.g. wiz.opt('a', 1)
  return {
    opt: true,
    name: name,
    val: ifUndef(val, null)
  };
};

var parse = function (name, func) { // Argument that should be parsed, e.g. wiz.parse('a', parseInt)
  return {
    parse: true,
    name: name,
    func: func
  };
};

var must = function (name, func) { // Argument that when passed to a given function must return true
  return {
    must: true,
    name: name,
    func: func
  }
}

// Take arguments and actual values and return object
var makeArgs = function (args, vals) {
  var argObj = {};

  _.each(args, function (arg, i) {
    if (typeof(arg) === 'string') { // Regular argument, e.g. 'a'
      argObj[arg] = vals[i];
    }
    else if (arg.opt) {
      argObj[arg.name] = ifUndef(vals[i], arg.val);
    }
    else if (arg.parse) {
      argObj[arg.name] = arg.func(vals[i]);
    }
    else if (arg.must) {
      if (!arg.func(vals[i])) {
        throw new ArgumentError('Argument "' + arg.name + '" failed `must` condition.');
      }
      argObj[arg.name] = vals[i];
    }
  });

  return argObj;
};

module.exports.opt = opt;
module.exports.parse = parse;
module.exports.must = must;

module.exports.func = function (/* arguments */) {
  var func = _.last(arguments);
  var args = _.initial(arguments);

  return function () { // Return function that takes arbitrary number of arguments
    var argObj = makeArgs(args, arguments)
    return func(argObj); // Call function with argument object
  };
};