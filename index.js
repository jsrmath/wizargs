var _ = require('underscore');

var _default = function (name, val) {
  return {
    default: true,
    name: name,
    val: val
  };
};

var parse = function (name, func) {
  return {
    parse: true,
    name: name,
    func: func
  };
};

// Take arguments and actual values and return object
var makeArgs = function (args, vals) {
  var argObj = {};

  _.each(args, function (arg, i) {
    if (typeof(arg) === 'string') { // Regular argument, e.g. 'a'
      argObj[arg] = vals[i];
    }
    else if (arg.default) { // Argument that has a default, e.g. wiz.default('a', 1)
      argObj[arg.name] = vals[i] || arg.val;
    }
    else if (arg.parse) { // Argument that should be parsed, e.g. wiz.parse('a', parseInt)
      argObj[arg.name] = arg.func(vals[i]);
    }
  });

  return argObj;
};

module.exports.func = function (/* arguments */) {
  var func = _.last(arguments);
  var args = _.initial(arguments);

  return function () { // Return function that takes arbitrary number of arguments
    var argObj = makeArgs(args, arguments)
    func(argObj); // Call function with argument object
  };
};

module.exports.default = _default;
module.exports.parse = parse;