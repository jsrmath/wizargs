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

  it('should create a function with default arguments', function () {
    var foo = wiz.func(wiz.default('a', 5), function (args) {
      assert.equal(args.a, 5);
    });
    foo();

    var bar = wiz.func(wiz.default('a', 5), function (args) {
      assert.equal(args.a, 3);
    });
    bar(3);
  });

  it('should create a function with parsed arguments', function () {
    var foo = wiz.func(wiz.parse('a', parseInt), function (args) {
      assert(args.a === 5);
      assert(args.a !== '5');
    });
    foo('5');
  });
});