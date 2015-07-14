var wiz = require('./');
var assert = require('assert');

describe('#func', function () {
  it('should create a function with regular arguments', function () {
  	var foo = wiz.func('a', 'b', 'c', function (args) {
  	  assert.equal(args.a, 0);
  	  assert.equal(args.b, 1);
  	  assert.equal(args.c, 2);
  	});
  	foo(0, 1, 2);
  });
});