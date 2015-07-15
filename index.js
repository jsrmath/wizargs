var _ = require('underscore');
var assert = require('assert');

var ArgumentError = function(message) {
  var err = new Error();
  err.message = message;
  Error.captureStackTrace(err, ArgumentError);
  return err;
};

// Standard, required argument
var req = function (name) {
  return {
    req: true,
    name: name
  };
};

// Optional argument, potentially with a default
// e.g. wiz.opt('a', 1), wiz.opt('a')
var opt = function (name, val) {
  return {
    opt: true,
    name: name,
    val: ifUndef(val, null)
  };
};

// Argument that should be first passed into a given function
// e.g. wiz.parse('a', parseInt)
var parse = function (name, func) {
  return {
    parse: true,
    name: name,
    func: func
  };
};

// Argument that when passed to a given function must return true
// e.g. wiz.must('a', isFinite)
var must = function (name, func) {
  return {
    must: true,
    name: name,
    func: func
  }
};

// Argument that absorbs rest of unbound arguments in an array
var splat = function (name) {
  return {
    splat: true,
    name: name
  }
};

var ifUndef = function (val, def) {
  return typeof val === 'undefined' ? def : val;
};

var nonNegative = function (x) { // Return 0 if x is negative
  return x < 0 ? 0 : x;
};

var isRequired = function (arg) {
  return arg.req || arg.parse || arg.must;
};

var isOptional = function (arg) {
  return arg.opt;
};

var isSplat = function (arg) {
  return arg.splat;
};

// Take arguments and actual values and return object
var makeArgs = function (args, vals) {
  var argObj = {};
  var numVals = vals.length; // How many values are passed in
  var numReq = _.filter(args, isRequired).length; // How many arguments are required
  var numOpt = _.filter(args, isOptional).length; // How many requirements are optional (no splats)
  var optAllowances = nonNegative(numVals - numReq); // How many values left over for optional arguments
  var splatAllowances = nonNegative(optAllowances - numOpt); // How many values are left over for a splat
  var i = 0;

  _.each(args, function (arg) {
    if (isRequired(arg)) {
      if (i >= numVals) {
        throw new ArgumentError('Missing value for required argument: ' + arg.name);
      }

      else if (arg.req) {
        argObj[arg.name] = vals[i];
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

      i += 1;
    }

    else if (isOptional(arg)) {      
      if (optAllowances) {
        assert(i < numVals);

        argObj[arg.name] = vals[i];
        optAllowances -= 1;
        i += 1;
      }

      else { // Use default value
        argObj[arg.name] = arg.val;
      }
    }

    else if (isSplat(arg)) {
      argObj[arg.name] = vals.slice(i, i + splatAllowances);
      i += splatAllowances;
      splatAllowances = 0; // We've used up all our splat allowances
    }

    else throw new ArgumentError('Invalid argument: ' + arg);
  });

  return argObj;
};

module.exports.req = req;
module.exports.opt = opt;
module.exports.parse = parse;
module.exports.must = must;
module.exports.splat = splat;

module.exports.func = function (/* arguments */) {
  var func = _.last(arguments);
  var args = _.initial(arguments);

  args = args.map(function (arg) { // Convert strings into req()'s
    return typeof arg === 'string' ? req(arg) : arg;
  });

  return function () { // Return function that takes arbitrary number of arguments
    var argObj = makeArgs(args, _.toArray(arguments))
    return func(argObj); // Call function with argument object
  };
};