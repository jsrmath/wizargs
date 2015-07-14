var _ = require('underscore');

// Take arguments and actual values and return object

var _default = function (name, val) {
	return {
		default: true,
		name: name,
		val: val
	}
};

var makeArgs = function (args, vals) {
	var argObj = {};

	_.each(args, function (arg, i) {
		if (typeof(arg) === 'string') { // Regular argument, e.g. 'a'
			argObj[arg] = vals[i];
		}
		else if (arg.default) { // Argument that has a default, e.g. wiz.default('a', 1)
			argObj[arg.name] = vals[i] || arg.val;
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