# wizargs
A utility for defining functions with complex arguments

## A Simple Example
Let's start by defining and invoking a simple function.

    var wiz = require('wizargs');
    var foo = wiz.func('a', wiz.opt('b', 5), function (args) {
      console.log(args.a, args.b);
    });
    foo(1); // 1, 5
    foo(1, 2); // 1, 2
    foo(); // Throws an error

In this call to `wiz.func`, we define a function `foo` with two arguments: a required one `a`, and an optional one `b` with a default value of 5.  When `foo` is invoked, the values passed in are stored in an object and passed in as the function's first and only argument.
When wizargs binds arguments, it will first bind the required arguments and then fill in the optional arguments with whatever is left over.  Consider this example.

    var foo = wiz.func('a', wiz.splat('b'), wiz.opt('c', -1), 'd', function (args) {
      console.log(args.a, args.b, args.c, args.d);
    });
    foo(1, 2, 3, 4, 5); // 1, [2, 3], 4, 5
    foo(1, 2, 3); // 1, [], 2, 3
    foo(1, 2); // 1, [], -1, 2

## Argument Types
wizargs includes a variety of different argument types

### Required
e.g., `wiz.req('a')` or just `'a'`

A required argument.  If it is not passed a value, wizargs throws an error.

### Optional
e.g., `wiz.opt('a', 5)` or `wiz.opt('a')`

An optional argument with an optional default value.  If wizargs cannot bind anything to an optional argument after binding all required arguments, it will be given its default value.  If no default value is specified, it will be given `null`.

### Splat
e.g., `wiz.splat('a')`

An argument that absorbs as many arguments as it can into an array.  Once wizargs has bound all other arguments, the remaining ones will be put into an array and bound to a splat.  If there are multiple splats, all others after the first will be empty.

### Parsed
e.g., `wiz.parse('a', parseInt)`

A required argument where the value is passed through a function, in this case `parseInt()`, before being bound.

### Must
e.g., `wiz.must('a', isFinite)`

A required argument where a value to be bound to it must pass a condition.  The value will be passed through a given function, in this case `isFinite()`.  If the function returns false, wizargs will throw an error.