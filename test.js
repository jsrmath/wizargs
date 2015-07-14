var wiz = require('./');
var assert = require('assert');

describe('#func', function () {
  it('should create a function with regular arguments', function () {
    var foo = wiz.func('a', 'b', 'c', function (args) {
      return args;
    });

    var args = foo(0, 1, 2);
    assert.equal(args.a, 0);
    assert.equal(args.b, 1);
    assert.equal(args.c, 2);
  });

  it('should create a function with optional arguments', function () {
    var foo = wiz.func(wiz.opt('a', 5), function (args) {
      return args;
    });
    assert.equal(foo().a, 5);
    assert.equal(foo(3).a, 3);
  });

  it('should create a function with parsed arguments', function () {
    var foo = wiz.func(wiz.parse('a', parseInt), function (args) {
      return args;
    });
    assert(foo('5').a === 5);
  });

  it('should create a function with `must` arguments', function () {
    var foo = wiz.func(wiz.must('a', isNaN), function (args) {});
    assert.throws(function () {
      foo(5);
    });
  });
});