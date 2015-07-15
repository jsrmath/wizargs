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

  it('should throw an error when a required argument is not passed a value', function () {
    assert.throws(function () {
      wiz.func('a', function () {})();
    });
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

  it('should create a function with optional arguments', function () {
    var foo = wiz.func('a', wiz.opt('b'), 'c', wiz.opt('d', 3), function (args) {
      return args;
    });

    var args = foo(0, 1, 2);
    assert.equal(args.a, 0);
    assert.equal(args.b, 1);
    assert.equal(args.c, 2);
    assert.equal(args.d, 3);

    args = foo(0, 1);
    assert.equal(args.a, 0);
    assert.equal(args.b, null);
    assert.equal(args.c, 1);
    assert.equal(args.d, 3);
  });

  it('should create a function with a splat', function () {
    var foo = wiz.func('a', wiz.splat('b'), 'c', function (args) {
      return args;
    });

    var args = foo(0, 1, 2, 3, 4);
    assert.equal(args.a, 0);
    assert.equal(args.c, 4);
    assert.equal(args.b.length, 3);

    args = foo(0, 1);
    assert.equal(args.a, 0);
    assert.equal(args.c, 1);
    assert(args.b);
    assert.equal(args.b.length, 0);
  });

  it('should create a function with a splat and optional arguments', function () {
    var foo = wiz.func(wiz.opt('a', 0), wiz.splat('b'), wiz.opt('c', 1), function (args) {
      return args;
    });

    var args = foo(0, 1, 2, 3, 4);
    assert.equal(args.a, 0);
    assert.equal(args.c, 4);
    assert.equal(args.b.length, 3);

    args = foo(0, 1);
    assert.equal(args.a, 0);
    assert.equal(args.c, 1);
    assert(args.b);
    assert.equal(args.b.length, 0);

    args = foo();
    assert.equal(args.a, 0);
    assert.equal(args.c, 1);
  });

  it('should create a function with two splats and leave the second empty', function () {
    var foo = wiz.func('a', wiz.splat('b'), 'c', wiz.splat('d'), function (args) {
      return args;
    });

    var args = foo(0, 1, 2, 3, 4);
    assert.equal(args.a, 0);
    assert.equal(args.c, 4);
    assert(args.b);
    assert(args.d);
    assert.equal(args.b.length, 3);
    assert.equal(args.d.length, 0);
  });
});