# ESLint Rule: proper-arrows

[![Build Status](https://travis-ci.org/getify/eslint-plugin-proper-arrows.svg?branch=master)](https://travis-ci.org/getify/eslint-plugin-proper-arrows)
[![npm Module](https://badge.fury.io/js/%40getify%2Feslint-plugin-proper-arrows.svg)](https://www.npmjs.org/package/@getify/eslint-plugin-proper-arrows)
[![Dependencies](https://david-dm.org/getify/eslint-plugin-proper-arrows.svg)](https://david-dm.org/getify/eslint-plugin-proper-arrows)
[![devDependencies](https://david-dm.org/getify/eslint-plugin-proper-arrows/dev-status.svg)](https://david-dm.org/getify/eslint-plugin-proper-arrows?type=dev)
[![Coverage Status](https://coveralls.io/repos/github/getify/eslint-plugin-proper-arrows/badge.svg?branch=master)](https://coveralls.io/github/getify/eslint-plugin-proper-arrows?branch=master)

## Overview

The **proper-arrows** ESLint Plugin defines rules that control the definitions of `=>` arrow functions, restricting them to a narrower and more proper usage.

The rules defined in this plugin:

* [`"name"`](#rule-name): requires `=>` arrow functions to only be used in positions where they receive an inferred name (i.e., assigned to a variable or property, etc), to avoid the poor readbility/debuggability of anonymous function expressions.

   **Note:** This rule is like the [built-in ESLint "func-names" rule](https://eslint.org/docs/rules/func-names), specifically its "as-needed" mode, but applied to `=>` arrow functions, since the built-in rule does not.

* [`"object-return"`](#rule-object-return): forbids `=>` arrow functions from returning objects in the concise-expression-body form, such as `x => ({ x })`.

   **Note:** This rule is similar to the [built-in ESLint "arrow-body-style" rule](https://eslint.org/docs/rules/arrow-body-style), specifically the `requireReturnForObjectLiteral: true` mode, but differs a bit.

* [`"this"`](#rule-this): controls if `=>` arrow functions must have a `this` reference, in the `=>` arrow function itself or in a nested `=>` arrow function.

   This rule can also optionally forbid `this`-containing `=>` arrow functions from the global scope.

## Enabling The Plugin

To use **proper-arrows**, load it as a plugin into ESLint and configure the rules as desired.

### `.eslintrc.json`

To load the plugin and enable its rules via a local or global `.eslintrc.json` configuration file:

```json
"plugins": [
    "@getify/proper-arrows"
],
"rules": {
    "@getify/proper-arrows/name": "error",
    "@getify/proper-arrows/object-return": "error",
    "@getify/proper-arrows/this": ["error","always"]
}
```

### `package.json`

To load the plugin and enable its rules via a project's `package.json`:

```json
"eslintConfig": {
    "plugins": [
        "@getify/proper-arrows"
    ],
    "rules": {
        "@getify/proper-arrows/name": "error",
        "@getify/proper-arrows/object-return": "error",
        "@getify/proper-arrows/this": ["error","always"]
    }
}
```

### ESLint CLI parameters

To load the plugin and enable its rules via ESLint CLI parameters, use `--plugin` and `--rule` flags:

```cmd
eslint .. --plugin='@getify/proper-arrows' --rule='@getify/proper-arrows/name: error' ..
```

```cmd
eslint .. --plugin='@getify/proper-arrows' --rule='@getify/proper-arrows/object-return: error' ..
```

```cmd
eslint .. --plugin='@getify/proper-arrows' --rule='@getify/proper-arrows/this: [error,always]' ..
```

### ESLint Node API

To use this plugin in Node.js with the ESLint API, require the npm module, and then (for example) pass the rule's definition to `Linter#defineRule(..)`, similar to:

```js
var properArrows = require("@getify/eslint-plugin-proper-arrows");

// ..

var eslinter = new (require("eslint").Linter)();

eslinter.defineRule("@getify/proper-arrows/name",properArrows.rules.name);

eslinter.defineRule("@getify/proper-arrows/name",properArrows.rules["object-return"]);

eslinter.defineRule("@getify/proper-arrows/this",properArrows.rules.this);
```

Then lint some code like this:

```js
eslinter.verify(".. some code ..",{
    rules: {
        "@getify/proper-arrows/name": "error",
        "@getify/proper-arrows/object-return": "error",
        "@getify/proper-arrows/this": ["error","always"]
    }
});
```

### Inline Comments

Once the plugin is loaded, the rule can be configured using inline code comments if desired, such as:

```js
/* eslint "@getify/proper-arrows/name": "error" */
```

```js
/* eslint "@getify/proper-arrows/object-return": "error" */
```

```js
/* eslint "@getify/proper-arrows/this": ["error","always"] */
```

## Rule: `"name"`

The **proper-arrows**/*name* rule requires `=>` arrow functions to be in a position where they will receive an inferred name, such as from being assigned to a variable or property.

To turn this rule on:

```js
"@getify/proper-arrows/name": "error"
```

The main purpose of this rule is to reduce the impact of the anonymous nature of `=>` arrow function expressions, making them more readable and improving stack trace output. Primarily, this rule disallows `=>` arrow functions passed directly as inline function expression arguments, as well as returned directly from other functions.

**Note:** This rule is like the [built-in ESLint "func-names" rule](https://eslint.org/docs/rules/func-names), specifically its "as-needed" mode, but applied to `=>` arrow functions, since the built-in rule does not.

Before being used (passed, called, returned, etc), `=>` arrow functions should be assigned to a variable/property/etc to receive a name inference:

```js
function multiplier(x) {
    var multipliedBy = v => v * x;
    return multipliedBy;
}

var tripled = v => v * 3;
var fns = {
    doubled: multiplier(2),
    tripled,
    quadrupled: v => v * 4
};

[1,2,3].map(fns.doubled);     // [2,4,6]
[1,2,3].map(fns.tripled);     // [3,6,9]
[1,2,3].map(fns.quadrupled);  // [4,8,12]

fns.doubled.name;             // "multipledBy"
fns.tripled.name;             // "tripled"
fns.quadrupled.name;          // "quadrupled"
```

In this snippet, each `=>` arrow function is first assigned to a variable or property, giving it an inferred name (`"multipledBy"`, `"tripled"`, or `"quadrupled"`). As such, they would all pass this rule.

By contrast, this rule *would* report errors for:

```js
function getName(fn) {
    return fn.name;
}

function multiplier(x) {
    return v => v * x;
}

fns = [ multiplier(2), v => v * 3 ];
getName( fns[0] );         // ""
getName( fns[1] );         // ""
getName( v => v * 4 );     // ""
```

In this snippet, all three arrow functions are anonymous (no name inference possible).

## Rule: `"object-return"`

The **proper-arrows**/*object-return* rule forbids `=>` arrow functions from returning object literals in the concise-expression-body form (i.e., `x => ({x})`).

To turn this rule on:

```js
"@getify/proper-arrows/object-return": "error"
```

The main purpose of this rule is to avoid the potential readability confusion of the concise-expression-body form with object literals, where the `{ }` looks like a function body.

**Note:** This rule is similar to the [built-in ESLint "arrow-body-style" rule](https://eslint.org/docs/rules/arrow-body-style), specifically the `requireReturnForObjectLiteral: true` mode. However, that built-in rule mode is only defined for `as-needed`, which requires always using the concise-expression-body form for all other `=>` arrow functions where it's possible to do so.

The **proper-arrows**/*object-return* rule is different (more narrowly focused): it only disallows the concise-expression-body when returning an object; otherwise, it doesn't place any requirements or restrictions on usage of `=>` arrow functions.

If returning an object literal from an arrow function, use the full-body return form:

```js
var x => { return { x, y }; }
```

In this snippet, the `=>` arrow function uses the full-body return form for the object literal. As such, it would pass this rule.

By contrast, this rule *would* report errors for:

```js
var x => ({ x, y });
```

In this snippet, the `=>` arrow function uses the concise-expression-body form with the object literal.

## Rule: `"this"`

The **proper-arrows**/*this* rule requires `=>` arrow functions to reference the `this` keyword. It also supports a `"never"` configuration mode, which reverses the rule and means that `=>` arrow functions must never use `this`.

To turn this rule on:

```js
"@getify/proper-arrows/this": "error"
```

The main purpose of this rule is to prevent usage of `=>` arrow functions as just function shorthand (i.e., `arr.map(x => x * 2)`), which can be argued is a misusage. Concise `=>` arrow function syntax (with all its myriad variations) can harm readability, so instead `=>` arrow functions should only be used when the "lexical this" behavior is needed.

Since `=>` arrow functions don't have their own `this`, they treat any `this` reference as a normal variable (not a special keyword). That means `this` is lexically looked up through any parent scopes until a valid definition of `this` is found -- from a normal non-arrow function, or finally in the global scope itself.

Such `this` behavior is referred to as "lexical this", and it is one of the main design characteristics for `=>` arrow functions.

For example:

```js
var o = {
    id: 42,
    getData() {
        ajax("https://some.tld/api",() => console.log(this.id));
    }
};

o.getData();   // 42
```

In this snippet, the `=>` arrow function is inside a normal function and therefore looks up and adopts its `this` (aka, "lexical this") -- which is set to the `o` object by the `o.getData()` call. Therefore, the **arrow-require-this** rule would not report an error.

By contrast, the **proper-arrows**/*this* rule *would* report an error for:

```js
var o = {
    id: 42,
    getData() {
        ajax("https://some.tld/api",() => console.log(o.id));
    }
};

o.getData();   // 42
```

Here, the `=>` arrow function is lexically closed over the `o` rather than using "lexical this", so it can be considered a misusage of the `=>` arrow function merely for shorthand; rather, the callback should have used `this.id` instead of `o.id`, or just been a regular named function expression (ie, `function onResp(){ console.log(o.id); }`).

To pass the **proper-arrows**/*this* rule without a reported error, all `=>` arrow functions must reference a `this` somewhere in their arguments or body -- or, when using the `"nested"` configuration, any nested `=>` arrow functions.

### Rule Configuration

The **proper-arrows**/*this* rule can be configured in three modes: `"nested"` (default), `"always"`, and `"never"`.

* [`"nested"`](#rule-this-configuration-nested) (default) permits a `this` to appear lower in a nested `=>` arrow function (i.e., `x = y => z => this.foo(z)`), as long as there is no non-arrow function boundary crossed.

   Additionally, include the `"no-global"` option to forbid `this`-containing `=>` arrow functions from the top-level scope (where they might inherit the global object as `this`).

* [`"always"`](#rule-this-configuration-always) is more strict, requiring every single `=>` arrow function to have its own `this` reference.

   Additionally, include the `"no-global"` option to forbid `this`-containing `=>` arrow functions from the top-level scope (where they might inherit the global object as `this`).

* [`"never"`](#rule-this-configuration-never) is the reverse of the rule, which is that all `=>` arrow functions are forbidden from using `this`.

#### Rule `"this"` Configuration: `"nested"`

To configure this rule mode (default):

```js
"@getify/proper-arrows/this": "error"
```

```js
"@getify/proper-arrows/this": [ "error", "nested" ]
```

```js
"@getify/proper-arrows/this": [ "error", "nested", "no-global" ]
```

This rule mode allows a `this` to appear either in the `=>` arrow function, or nested deeper in a chain of `=>` arrow functions, as long as there is **no non-arrow function boundary crossed in the nesting**.

If the `"no-global"` flag **has not** been set for this mode, these statements will all pass the rule:

```js
var a = b => this.foo(b);

var c = d => e => this.foo(e);

var f = (g = h => this.foo(h)) => g;
```

But these statements will each fail this rule:

```js
var a = b => foo(b);

var c = d => this.foo(e => e);

var f = (g = h => h) => this.foo(g);

var h = i => function(j){ this.foo(j); };

var k = l => function(){ return m => this.foo(m); };
```

##### `"no-global"` Flag

If the `"no-global"` flag **has** been set for this mode, these statements will all pass the rule:

```js
function foo() { return a => this.bar(a); }

function foo() { return a => b => this.bar(a,b); }

function foo(cb = a => this.bar(a)) { .. }

function foo(cb = a => b => this.bar(a,b)) { .. }
```

And these statments will each fail this `"no-global"`-flagged rule:

```js
var foo = a => this.bar(a);

var foo = a => b => this.bar(a,b);

var o = {
    foo: a => this.bar(a)
};

var o = {
    foo: a => b => this.bar(a,b)
};
```

#### Rule `"this"` Configuration: `"always"`

To configure this rule mode:

```js
"@getify/proper-arrows/this": [ "error", "always" ]
```

```js
"@getify/proper-arrows/this": [ "error", "always", "no-global" ]
```

This rule mode requires a `this` reference to appear in every single `=>` arrow function (e.g., nested `this` is not sufficient).

If the `"no-global"` flag **has not** been set for this mode, these statements will all pass the rule:

```js
var a = b => this.foo(b);

var c = d => this.foo(e => this.bar(e));

var f = (g = h => this.foo(h)) => this.bar(g);
```

But these statements will each fail this rule:

```js
var a = b => foo(b);

var c = d => e => this.foo(e);

var f = g => this.foo(h => h);

var i = (j = k => k) => this.foo(j);
```

**Note:** In each of the above examples, at least one of the `=>` arrow functions does not have its own `this`, hence the mode's rule failure (doesn't consider nested `this`).

##### `"no-global"` Flag

If the `"no-global"` flag **has** been set for this mode, these statements will all pass the rule:

```js
function foo() { return a => this.bar(a); }

function foo(cb = a => this.bar(a)) { .. }
```

And these statements will each fail this `"no-global"`-flagged rule:

```js
var foo = a => this.bar(a);

var o = {
    foo: a => this.bar(a)
};
```

### Rule `"this"` Configuration: `"never"`

To configure this rule mode:

```js
"@getify/proper-arrows/this": [ "error", "never" ]
```

This rule mode **forbids** a `this` reference from appearing in any `=>` arrow function.

These statements will all pass the rule in this mode:

```js
var a = b => foo(b);

var c = d => foo(e => bar(e));

var f = (g = h => foo(h)) => bar(g);
```

But these statements will each fail the rule in this mode:

```js
var a = b => this.foo(b);

var c = d => e => this.foo(e);

var f = g => foo(h => this.bar(h));
```

**Note:** The `"no-global"` option is not defined for this rule mode.

## npm Package

To use this plugin with a global install of ESLint (recommended):

```cmd
npm install -g @getify/eslint-plugin-proper-arrows
```

To use this plugin with a local install of ESLint:

```cmd
npm install @getify/eslint-plugin-proper-arrows
```

## Builds

[![Build Status](https://travis-ci.org/getify/eslint-plugin-proper-arrows.svg?branch=master)](https://travis-ci.org/getify/eslint-plugin-proper-arrows)
[![npm Module](https://badge.fury.io/js/%40getify%2Feslint-plugin-proper-arrows.svg)](https://www.npmjs.org/package/@getify/eslint-plugin-proper-arrows)

If you need to bundle/distribute this eslint plugin, use `dist/eslint-plugin-proper-arrows.js`, which comes pre-built with the npm package distribution; you shouldn't need to rebuild it under normal circumstances.

However, if you download this repository via Git:

1. The included build utility (`scripts/build-core.js`) builds (and minifies) `dist/eslint-plugin-proper-arrows.js` from source.

2. To install the build and test dependencies, run `npm install` from the project root directory.

3. To manually run the build utility with npm:

    ```cmd
    npm run build
    ```

4. To run the build utility directly without npm:

    ```cmd
    node scripts/build-core.js
    ```

## Tests

A comprehensive test suite is included in this repository, as well as the npm package distribution. The default test behavior runs the test suite against `lib/index.js`.

1. The included Node.js test utility (`scripts/node-tests.js`) runs the test suite.

2. Ensure the test dependencies are installed by running `npm install` from the project root directory.

    - **Note:** Starting with npm v5, the test utility is **not** run automatically during this `npm install`. With npm v4 and before, the test utility automatically runs at this point.

3. To run the test utility with npm:

    ```cmd
    npm test
    ```

    Other npm test scripts:

    * `npm run test:dist` will run the test suite against `dist/arrow-name.js` instead of the default of `lib/index.js`.

    * `npm run test:package` will run the test suite as if the package had just been installed via npm. This ensures `package.json`:`main` properly references `dist/arrow-name.js` for inclusion.

    * `npm run test:all` will run all three modes of the test suite.

4. To run the test utility directly without npm:

    ```cmd
    node scripts/node-tests.js
    ```

### Test Coverage

[![Coverage Status](https://coveralls.io/repos/github/getify/eslint-plugin-proper-arrows/badge.svg?branch=master)](https://coveralls.io/github/getify/eslint-plugin-proper-arrows?branch=master)

If you have [Istanbul](https://github.com/gotwarlost/istanbul) already installed on your system (requires v1.0+), you can use it to check the test coverage:

```cmd
npm run coverage
```

Then open up `coverage/lcov-report/index.html` in a browser to view the report.

To run Istanbul directly without npm:

```cmd
istanbul cover scripts/node-tests.js
```

**Note:** The npm script `coverage:report` is only intended for use by project maintainers; it sends coverage reports to [Coveralls](https://coveralls.io/).

## License

All code and documentation are (c) 2019 Kyle Simpson and released under the [MIT License](http://getify.mit-license.org/). A copy of the MIT License [is also included](LICENSE.txt).
