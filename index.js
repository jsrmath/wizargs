var _ = require('underscore');

// Take arguments and actual values and return object
var makeArgs = function (args, vals) {
	var argObj = {};

	_.each(args, function (arg, i) {
		if (typeof(arg) === 'string') {
			argObj[arg] = vals[i];
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