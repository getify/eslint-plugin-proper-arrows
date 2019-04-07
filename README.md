# ESLint Plugin: proper-arrows

[![Build Status](https://travis-ci.org/getify/eslint-plugin-proper-arrows.svg?branch=master)](https://travis-ci.org/getify/eslint-plugin-proper-arrows)
[![npm Module](https://badge.fury.io/js/%40getify%2Feslint-plugin-proper-arrows.svg)](https://www.npmjs.org/package/@getify/eslint-plugin-proper-arrows)
[![Dependencies](https://david-dm.org/getify/eslint-plugin-proper-arrows.svg)](https://david-dm.org/getify/eslint-plugin-proper-arrows)
[![devDependencies](https://david-dm.org/getify/eslint-plugin-proper-arrows/dev-status.svg)](https://david-dm.org/getify/eslint-plugin-proper-arrows?type=dev)
[![Coverage Status](https://coveralls.io/repos/github/getify/eslint-plugin-proper-arrows/badge.svg?branch=master)](https://coveralls.io/github/getify/eslint-plugin-proper-arrows?branch=master)

## Overview

The **proper-arrows** ESLint plugin provides rules that control the definitions of `=>` arrow functions, restricting them to a narrower and more proper/readable form.

The rules defined in this plugin:

* [`"params"`](#rule-params): controls definitions of `=>` arrow function parameters, such as forbidding unused parameters, forbidding short/unsemantic parameter names, etc.

* [`"name"`](#rule-name): requires `=>` arrow functions to only be used in positions where they receive an inferred name (i.e., assigned to a variable or property, etc), to avoid the poor readbility/debuggability of anonymous function expressions.

   **Note:** This rule is like the "as-needed" mode of the [built-in ESLint "func-names" rule](https://eslint.org/docs/rules/func-names), but applied to `=>` arrow functions; the built-in rule ignores them.

* [`"where"`](#rule-where): restricts where in program structure `=>` arrow functions can be used: forbidding them in the top-level/global scope, object properties, `export` statements, etc.

* [`"return"`](#rule-return): restricts the concise return value kind for `=>` arrow functions, such as forbidding object literal concise returns (`x => ({ x })`), forbidding concise returns of conditional/ternary expressions (`x => x ? y : z`), etc.

* [`"this"`](#rule-this): requires/disallows `=>` arrow functions using a `this` reference, in the `=>` arrow function itself or in a nested `=>` arrow function.

   This rule can optionally forbid `this`-containing `=>` arrow functions from the global scope.

### Trivial `=>` Arrow Functions

It's common for `=>` arrow functions to be used as a shorthand for simple/trivial function roles, such as:

```js
// no-op function
() => {};

// constant function
() => 42;

// closure function
() => v;

// identity function
v => v;
```

**Note:** To be specific on the definition of "trivial" being used here: trivial functions have no more than 1 parameter (simple identifier only), and either have no return (`{}`) or a concise return of: a single variable, primitive (non-object) literal, or a `void __` expression.

These types of functions are so simple that they don't suffer much from readability issues despite their concise syntax. As such, it's likely preferred to allow them even if one of the rules here would normally report them.

By default, **all rules ignore** these trivial functions. To **force a rule to check trivial functions**, include this configuration option for the rule:

```json
{ "trivial": true }
```

**Note:** The `"trivial"` option **will not necessarily report** trivial functions, but it will force trivial functions to be checked by the rule/mode in question.

## Enabling The Plugin

To use **proper-arrows**, load it as a plugin into ESLint and configure the rules as desired.

### `extends`

If you'd like to use the **proper-arrows** plugin in a recommended configuration preset, you can add the plugin in the `extends` clause of your ESLint configuration, and pick a preset by name:

```js
"extends": [
    // ..
    "plugin:@getify/proper-arrows/CONFIG-PRESET-NAME",
    // ..
]
```

**Note:** All included configuration presets not only define specific rule configurations but also automatically load the plugin itself, so you *don't* need to list **proper-arrows** in the `plugins` clause.

The available configuration presets to choose from:

* `getify-says`: This is my personal configuration. See the [preset definition](/lib/index.js#L5-L14).

* ..TBA..

It's important to note that you can still override any of the preset rule definitions in your configuration. Think of these presets as convenience "defaults" that can still be customized.

### `.eslintrc.json`

To load the plugin and enable its rules via a local or global `.eslintrc.json` configuration file:

```json
"plugins": [
    "@getify/proper-arrows"
],
"rules": {
    "@getify/proper-arrows/params": ["error",{"unused":"trailing"}],
    "@getify/proper-arrows/name": ["error",{"trivial":false}],
    "@getify/proper-arrows/where": ["error",{"global":true}],
    "@getify/proper-arrows/return": ["error",{"object":true}],
    "@getify/proper-arrows/this": ["error","always",{"no-global":true}]
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
        "@getify/proper-arrows/params": ["error",{"unused":"trailing"}],
        "@getify/proper-arrows/name": ["error",{"trivial":false}],
        "@getify/proper-arrows/name": ["error",{"global":true}],
        "@getify/proper-arrows/return": ["error",{"object":true}],
        "@getify/proper-arrows/this": ["error","always",{"no-global":true}]
    }
}
```

### ESLint CLI parameters

To load the plugin and enable its rules via ESLint CLI parameters, use `--plugin` and `--rule` flags:

```cmd
eslint .. --plugin='@getify/proper-arrows' --rule='@getify/proper-arrows/params: [error,{"unused":"trailing"}]' ..
```

```cmd
eslint .. --plugin='@getify/proper-arrows' --rule='@getify/proper-arrows/name: [error,{"trivial":false}]' ..
```

```cmd
eslint .. --plugin='@getify/proper-arrows' --rule='@getify/proper-arrows/where: [error,{"global":true}]' ..
```

```cmd
eslint .. --plugin='@getify/proper-arrows' --rule='@getify/proper-arrows/return: [error,{"object":true}' ..
```

```cmd
eslint .. --plugin='@getify/proper-arrows' --rule='@getify/proper-arrows/this: [error,always,{"no-global":true}]' ..
```

### ESLint Node API

To use this plugin in Node.js with the ESLint API, require the npm module, and then (for example) pass the rule's definition to `Linter#defineRule(..)`, similar to:

```js
var properArrows = require("@getify/eslint-plugin-proper-arrows");

// ..

var eslinter = new (require("eslint").Linter)();

eslinter.defineRule("@getify/proper-arrows/params",properArrows.rules.params);

eslinter.defineRule("@getify/proper-arrows/name",properArrows.rules.name);

eslinter.defineRule("@getify/proper-arrows/where",properArrows.rules.where);

eslinter.defineRule("@getify/proper-arrows/return",properArrows.rules.return);

eslinter.defineRule("@getify/proper-arrows/this",properArrows.rules.this);
```

Then lint some code like this:

```js
eslinter.verify(".. some code ..",{
    rules: {
        "@getify/proper-arrows/params": ["error",{unused:"trailing"}],
        "@getify/proper-arrows/name": ["error",{trivial:false}],
        "@getify/proper-arrows/where": ["error",{trivial:true}],
        "@getify/proper-arrows/return": ["error",{object:true}],
        "@getify/proper-arrows/this": ["error","always",{"no-global":true}]
    }
});
```

### Inline Comments

Once the plugin is loaded, the rule can be configured using inline code comments if desired, such as:

```js
/* eslint "@getify/proper-arrows/params": ["error",{"unused":"trailing"}] */
```

```js
/* eslint "@getify/proper-arrows/name": "error" */
```

```js
/* eslint "@getify/proper-arrows/return": ["error",{"object":true}] */
```

```js
/* eslint "@getify/proper-arrows/this": ["error","always",{"no-global":true}] */
```

## Rule: `"params"`

The **proper-arrows**/*params* rule controls definitions of parameters for `=>` arrow functions.

This rule can be configured to forbid unused parameter names (`"unused"`), limit the number of parameters (`"count"`), and require parameter names to be at least a certain length (`"length"`). Also, this rule can specify a list of exceptions to always allow certain parameter names (`"allow"`).

To turn this rule on:

```json
"@getify/proper-arrows/params": "error"
```

```json
"@getify/proper-arrows/params": [ "error", { "unused": true, "count": 3, "length": 4, "allow": [ "e", "err" ], "trivial": false } ]
```

The main purpose of this rule is to avoid readability harm for `=>` arrow functions by ensuring the parameters are clean and "proper".

By forbidding unused parameters, the reader is not confused searching for their usage. By requiring parameters that are long enough to have meaningful names, the reader can understand the function better. By limiting the number of parameters, the reader can more easily visually distinguish the whole function definition.

For example:

```js
var fn = (data,user) => ajax(user.id,data);
```

In this snippet, the `=>` arrow function has two parameters, and both are 4 characters long and used in the function body. Therefore, the **proper-arrows**/*this* rule would not report any errors.

By contrast, this rule *would* report errors for:

```js
var fn = (d,u,m,b) => ajax(u.id,d);
```

Here, the `=>` arrow function has 4 parameters (too many!), each one is a single character (too short!), and two of them are unused.

### Rule Configuration

The **proper-arrows**/*params* rule can be configured with any combination of three modes: `"unused"`, `"count"`, and `"length"`. Also, parameter names can be explicitly allowed by name (thus not reporting any error for these modes) in the `"allowed"` setting.

**Note:** The default behavior is that all three modes are turned on. You must specifically configure each mode to (effectively) disable it.

* [`"unused"`](#rule-params-configuration-unused) (default: `"all"`) forbids named parameters that are not used inside the function. Can also be set to `"trailing"` to only report unused errors for trailing parameters -- that is, only those which come after the last parameter that is used -- or set to `"none"` to disable this mode.

* [`"count"`](#rule-params-configuration-count) (default: `3`) is the maximum count for parameters on an `=>` arrow function. All parameters are counted to check against the limit, including any `"allowed"` parameters and the "...rest" parameter. Set to a larger number to effectively disable this mode.

* [`"length"`](#rule-params-configuration-length) (default: `2`) is the minimum length of allowed parameter names. Set to `0` to effectively disable this mode.

* [`"allowed"`](#rule-params-configuration-allowed) (default: `[]`) is a list of parameter names to ignore and not report any errors for.

#### Rule `"params"` Configuration: `"unused"`

**Note:** This rule mode resembles the [built-in "no-unused-vars" rule](https://eslint.org/docs/rules/no-unused-vars), but instead focuses only on the parameters of `=>` arrow functions.

To configure this rule mode (default: `"all"`):

```json
"@getify/proper-arrows/params": "error"
```

```json
"@getify/proper-arrows/params": [ "error", { "unused": "all", "trivial": false } ]
```

The `"unused": "all"` (default) mode checks each parameter to see if it's used anywhere within the function. If not, the parameter is reported as an error.

For example:

```js
var fn1 = (one,two) => one + two;

var fn2 = (one,two = one) => two * 2;

var fn3 = one => two => three => one * two * three;
```

These statements all report no errors, because all parameters are used somewhere in each function.

By contrast, this rule *would* report errors for:

```js
var fn1 = (one,two) => one * 2;

var fn2 = (one,...rest) => one * 2;

var fn3 = one => two => three => one * three;
```

In each statement, a parameter is defined in an `=>` arrow function that is not used within.

##### `"unused": "trailing"`

It is sometimes desired to name some positional parameters that are effectively ignored by the function body, while using other named parameters that come after. As such, it can be helpful to suppress reports except on unused parameters that come after the last used parameter in the function signature.

In the `"unused": "trailing"` mode, only unused parameters that come positionally after the last used parameter are reported:

```js
var fn1 = (one,two,three) => two * 2;
```

In this snippet, since `two` is the last used parameter, only `three` would be reported as an unused parameter (ignores `one`).

##### `"unused": "none"`

Disables this `"unused"` mode; no checks are made for any unused parameters.

#### Rule `"params"` Configuration: `"count"`

To configure this rule mode (default: `3`):

```json
"@getify/proper-arrows/params": "error"
```

```json
"@getify/proper-arrows/params": [ "error", { "count": 3, "trivial": false } ]
```

This rule mode counts all parameters to make sure the maximum `count` limit is not violated.

For example:

```js
var fn0 = () => "";

var fn1 = one => one;

var fn2 = (one,two) => one + two;

var fn3 = (one,two,three) => one * two * three;

var fn3b = (one,two,...three) => one * two * three[0];
```

These statements all report no errors, because all parameter counts are below the limit (default: `3`).

By contrast, this rule *would* report errors for:

```js
var fn4 = (one,two,three,four) => one + two * three / four;

var fn4b = (one,two,three,...four) => one + two * three / four[0];
```

In each statement, the parameter count is above the limit.

#### Rule `"params"` Configuration: `"length"`

**Note:** This rule mode resembles the [built-in ESLint "id-length" rule](https://eslint.org/docs/rules/id-length), but instead focuses only on the parameters of `=>` arrow functions.

To configure this rule mode (default: `2`):

```json
"@getify/proper-arrows/params": "error"
```

```json
"@getify/proper-arrows/params": [ "error", { "length": 2, "trivial": false } ]
```

This rule mode checks all parameters to make sure their basic character length is at least the minimum `"length"` threshold.

For example:

```js
var fn0 = () => 42;

var fn1 = (data) => data.id;

var fn2 = (user,cb) => ajax(user,cb);
```

These statements all report no errors, because all parameters are at least the length threshold specified (default: `2`), and the absence of a parameter is ignored.

By contrast, this rule *would* report errors for:

```js
users.map(v => v * 2);
```

In this statement, the parameter length of `v` is below the minimum threshold.

#### Rule `"params"` Configuration: `"allowed"`

To configure named exceptions to the main three rule modes (default: `[]`):

```json
"@getify/proper-arrows/params": [ "error", { "allowed": [ "e", "err" ], "trivial": false } ]
```

This exception list prevents any listed parameter from being reported as an error by any of this **proper-arrows**/*params* rule's modes.

For example:

```js
var fn = (one,two,three,e) => 0;
```

By default, `e` would report all 3 errors: it's unused, it's beyond the default count limit, and it's below the minimum length threshold. However, no errors will be reported if `"e"` is included in the `"allowed"` exception list.

## Rule: `"name"`

The **proper-arrows**/*name* rule requires `=>` arrow functions to be in a position where they will receive an inferred name, such as from being assigned to a variable or property.

To turn this rule on:

```json
"@getify/proper-arrows/name": "error"
```

```json
"@getify/proper-arrows/name": ["error",{ "trivial": false }]
```

The main purpose of this rule is to reduce the impact of the anonymous nature of `=>` arrow function expressions, making them more readable, improving stack trace output, and giving them a named self-reference (recursion, event unbinding, etc). Primarily, this rule disallows `=>` arrow functions passed directly as inline function expression arguments, as well as returned directly from other functions.

**Note:** This rule is like the "as-needed" mode of the [built-in ESLint "func-names" rule](https://eslint.org/docs/rules/func-names), but applied to `=>` arrow functions; the built-in rule ignores them.

Before being used (passed, called, returned, etc), `=>` arrow functions should be assigned somewhere, to receive a name inference:

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

By contrast, this rule *would* report errors for each of the `=>` arrow functions here:

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

In this snippet, all three `=>` arrow functions remain anonymous because no name inferences are possible.

## Rule: `"where"`

The **proper-arrows**/*where* rule restricts where in program structure `=>` arrow functions can be used.

This rule can be configured to forbid `=>` arrow functions in the top-level/global scope (`"global"`), forbid `=>` arrow functions as object properties (`"property"`), and forbid `=>` arrow functions in `export` statements (`"export"`).

To turn this rule on:

```json
"@getify/proper-arrows/where": "error"
```

```json
"@getify/proper-arrows/where": [ "error", { "global": true, "property": true, "export": true, "trivial": false } ]
```

The main purpose of this rule is to avoid readability harm when using `=>` arrow functions in certain program structure locations.

Placing `=>` arrow functions in the top-level/global scope has no benefit other than preferred style; they're more proper as regular function declarations. Placing `=>` arrow functions on object properties has no benefit other than preferred style; they're more proper as concise object methods. Placing arrow functions in `export` statements offers no benefit other than being more concise; they're more proper as exported named function declarations.

For example:

```js
var PEOPLE_URL = "http://some.tld/api";

var People = {
    getData(id,cb) {
        ajax(PEOPLE_URL,{ id },cb);
    }
};

function onData(data) {
    console.log(data);
}

export default function lookup(id) {
    People.getData(id,onData);
}
```

In this snippet, the `getData(..)` function is a clear and proper concise method on `People` object, `onData(..)` is a regular function declaration, and `lookup(..)` is a named export declaration. Therefore, the **proper-arrows**/*where* rule would not report any errors.

By contrast, this rule *would* default to reporting errors for each of these `=>` arrow functions:

```js
var PEOPLE_URL = "http://some.tld/api";

var People = {
    getData: (id,cb) => ajax(PEOPLE_URL,{ id },cb)
};

var onData = data => {
    console.log(data);
};

export default id => People.getData(id,onData)
```

These usages of `=>` arrow functions are not helping the readability or behavior of this snippet.

### Rule Configuration

The **proper-arrows**/*where* rule can be configured with three (non-exclusive) modes: `"global"`, `"property"`, and `"export"`.

**Note:** The default behavior is that all three modes are turned on for this rule. You must specifically configure each mode to disable it.

* [`"global"`](#rule-where-configuration-global) (default: `true`) forbids `=>` arrow functions in the top-level/global scope.

* [`"property"`](#rule-where-configuration-property) (default: `true`) forbids assigning `=>` arrow functions to object properties.

* [`"export"`](#rule-where-configuration-export) (default: `true`) forbids `=>` arrow functions in `export` statements.

#### Rule `"where"` Configuration: `"global"`

To configure this rule mode (on by default, set as `false` to turn off):

```json
"@getify/proper-arrows/where": [ "error", { "global": true, "trivial": false } ]
```

When defining functions at the top-level/global scope, use a regular function declaration:

```js
function onData(data) {
    console.log(data);
}
```

By contrast, this rule mode *would* report errors for:

```js
var onData = data => {
    console.log(data);
};
```

In this snippet, the `=>` arrow function is less obviously a function than the function declaration form.

#### Rule `"where"` Configuration: `"property"`

To configure this rule mode (on by default, set as `false` to turn off):

```json
"@getify/proper-arrows/where": [ "error", { "property": true, "trivial": false } ]
```

When defining a function in an object literal definition, use the concise method form:

```js
var People = {
    getData(id,cb) {
        ajax(PEOPLE_URL,{ id },cb);
    }
};
```

By contrast, this rule mode *would* report errors for:

```js
var People = {
    getData: (id,cb) => ajax(PEOPLE_URL,{ id },cb)
};
```

In this snippet, the  `=>` arrow function is less obviously a method than the concise method form.

#### Rule `"where"` Configuration: `"export"`

To configure this rule mode (on by default, set as `false` to turn off):

```json
"@getify/proper-arrows/where": [ "error", { "export": true, "trivial": false } ]
```

When exporting a function declaration, use a named function:

```js
export default function lookup(id) {
    People.getData(id,onData);
}
```

By contrast, this rule mode *would* report errors for:

```js
export default id => People.getData(id,onData)
```

In this snippet, the `=>` arrow function is less obviously a function than named function form.

## Rule: `"return"`

The **proper-arrows**/*return* rule restricts the concise return values for `=>` arrow functions.

This rule can be configured to forbid concise return of object literals (`"object"`), forbid concise return of `=>` arrow functions (aka, "chained arrow returns") without visual delimiters like `( .. )` (`"chained"`), forbid concise return of ternary/conditional expressions (`"ternary"`), and forbid concise returns of comma sequences (`"sequence"`).

To turn this rule on:

```json
"@getify/proper-arrows/return": "error"
```

```json
"@getify/proper-arrows/return": [ "error", { "object": true, "chained": true, "sequence": true, "trivial": false } ]
```

The main purpose of this rule is to avoid readability harm for `=>` arrow functions by ensuring concise return values are clean and "proper".

By forbidding concise return of object literals, the reader is not confused at first glance by the `{ .. }` looking like a non-concise function body. By forbidding chained `=>` arrow function concise returns without enclosing visual delimiters (like `( .. )`), the reader doesn't have to visually parse functions in a reverse/right-to-left fashion to determine the function boundaries. By forbidding concise return of comma sequences (ie, `(x = 3,y = foo(x + 1),[x,y])`), the reader doesn't have as much trouble figuring out which value will be returned from the function. By forbidding concise return of ternary/conditional expressions, especially nested ternaries, the function's boundary is not as visually ambiguous.

For example:

```js
var fn1 = prop => ( val => { return { [prop]: val }; } );
var fn2 = (x,y) => { x = 3; y = foo(x + 1); return [x,y]; };
var fn3 = (x,y) => {
    return (
        x > 3 ? x :
        y > 3 ? y :
        3;
    );
};
```

In this snippet, the chained `=>` arrow function `fn1(..)` is surrounded by `( .. )` to visually delimit it, and the object literal being returned is done with a full function body and `return` keyword. For `fn2(..)`, the function body's return value (`[x,y]`) is clear. For `fn3(..)`, the presence of a `return` keyword inside the `{ }` function body more clearly delimits the nested ternary/conditional expression as determining the return value. Therefore, the **proper-arrows**/*return* rule would not report any errors.

By contrast, this rule *would* report errors for each of these statements:

```js
var fn1 = prop => val => ({ [prop]: val });
var fn2 = (x,y) => (x = 3, y = foo(x + 1), [x,y]);
var fn3 = (x,y) => x > 3 ? x : y > 3 ? y : 3;
```

In this snippet, the chained `=>` arrow function return is not as clear, the concise return of the object literal can be confused as a function block at first glance, the concise return of the comma sequence makes it hard to determine which value will actually be returned, and the nested ternary/conditional expression obscures the determination of the return value.

Some claim that extra whitespace solves these readability issues. However, if you go to the trouble to space/indent to this extent, skipping the `return` keyword doesn't really contribute to the readability, and in fact still makes the return values a little less visually distinct than the above forms.

```js
var fn1 = prop
    => val
        => (
            { [prop]: val }
        );
var fn2 = (x,y) => (
    x = 3,
    y = foo(x + 1),
    [x,y]
);
var fn3 = (x,y) =>
    x > 3 ? x :
    y > 3 ? y :
    3;
```

Also, many proponents of this whitespace "solution" advocate it in theory only; in practice, these sorts of functions are often just found in their less readable single-line form.

### Rule Configuration

The **proper-arrows**/*return* rule can be configured with four (non-exclusive) modes: `"object"`, `"ternary"`, `"chained"`, and `"sequence"`.

**Note:** The default behavior is that all four modes are turned on for this rule. You must specifically configure each mode to disable it.

* [`"object"`](#rule-return-configuration-object) (default: `true`) forbids returning object literals as concise return expressions.

* [`"ternary"`](#rule-return-configuration-ternary) (default: `0`) controls whether (and to what extent of nesting) conditional/ternary expressions (`x ? y : z`) are allowed as the concise return expression of an `=>` arrow function.

* [`"chained"`](#rule-return-configuration-chained) (default: `true`) forbids returning `=>` arrow functions (aka, "chained arrow returns") as concise return expressions, without visual delimiters `( .. )`.

* [`"sequence"`](#rule-return-configuration-sequence) (default: `true`) forbids returning comma sequences (ie, `(x = 3, y + x)`) as concise return expressions.

#### Rule `"return"` Configuration: `"object"`

**Note:** This rule is similar to the [built-in ESLint "arrow-body-style" rule](https://eslint.org/docs/rules/arrow-body-style), specifically the `requireReturnForObjectLiteral: true` mode. However, that built-in rule mode is only defined for `as-needed`, which requires always using the concise return expression form for all other `=>` arrow functions where it's possible to do so.

The **proper-arrows**/*return* rule's `"object"` mode is different (more narrowly focused): it only disallows the concise return of an object literal; otherwise, it doesn't place any requirements or restrictions on usage of `=>` arrow functions.

To configure this rule mode (on by default, set as `false` to turn off):

```json
"@getify/proper-arrows/return": [ "error", { "object": true, "trivial": false } ]
```

If returning an object literal from an `=>` arrow function, use the full-body return form:

```js
var fn = prop => val => { return { [prop]: val }; };
```

In this snippet, the `=>` arrow function uses the full-body return form for the object literal. As such, it would pass this rule.

By contrast, this rule mode *would* report errors for:

```js
var fn = prop => val => ({ [prop]: val });
```

In this snippet, the `=>` arrow function has an object literal as the concise return expression.

#### Rule `"return"` Configuration: `"ternary"`

**Note:** This rule is similar to the [built-in ESLint "no-ternary" rule](https://eslint.org/docs/rules/no-ternary) and ["no-nested-ternary" rule](https://eslint.org/docs/rules/no-nested-ternary). However, those built-in rules focus on all conditional/ternary (`? :`) expressions, and aren't configurable to an allowed level of nesting.

The **proper-arrows**/*return* rule's `"ternary"` mode is different (more narrowly focused): it only controls the ternary/conditional expressions as the concise return of an `=>` arrow function; otherwise, it doesn't place any requirements or restrictions on ternary/conditional expressions.

To configure this rule mode (defaults to `0`, set to a higher number to effectively disable):

```json
"@getify/proper-arrows/return": [ "error", { "ternary": 1, "trivial": false } ]
```

The number specified for the `"ternary"` option controls what level of (nested) ternary/conditional expressions are allowed as the concise return of an `=>` arrow function. `0` means none allowed, `1` means a single ternary/conditional allowed, `2` means one level nested (`x ? y ? z : w : u`) allowed, etc.

If this rule mode is set to `1`, it would pass this snippet:

```js
var fn = data => data.id ? lookup(data.id) : lookup(-1);
```

But this rule mode set to `1` *would* report errors for:

```js
var fn = data => data.id ? data.extra ? lookup(data.id,data.extra) : lookup(data.id) : lookup(-1);
```

#### Rule `"return"` Configuration: `"chained"`

To configure this rule mode (on by default, set as `false` to turn off):

```json
"@getify/proper-arrows/return": [ "error", { "chained": true, "trivial": false } ]
```

This rule mode requires `( .. )` surrounding any concise return that is itself an `=>` arrow function, because the parentheses help visually disambiguate where the function boundaries are, especially when there are several `=>` arrow functions chained together.

If concise returning a chained `=>` arrow function, wrap `( .. )` around it:

```js
var fn = prop => ( val => { return { [prop]: val }; } );
```

In this snippet, the chained `=>` arrow function return is visually disambiguated with `( .. )`. As such, it would pass this rule.

**Though this rule does require it**, visual ambiguity can even further be reduced by using whitespace to position the delimiters similarly to regular function bodies delimited by `{ .. }`:

```js
var fn = prop => (
    val => { return { [prop]: val }; }
);
```

**Note:** The extra whitespace is merely a readability suggestion if you plan to use this rule, not a requirement of it.

By contrast, this rule mode *would* report errors for:

```js
var fn = prop => val => { return { [prop]: val }; };
```

In this snippet, the boundary of the chained `=>` arrow function return is less clear.

#### Rule `"return"` Configuration: `"sequence"`

**Note:** This rule is similar to the [built-in ESLint "no-sequences" rule](https://eslint.org/docs/rules/no-sequences).

The **proper-arrows**/*return* rule's `"sequence"` mode is different (more narrowly focused): it only disallows comma sequences as `=>` arrow function concise return expressions.

To configure this rule mode (on by default, set as `false` to turn off):

```json
"@getify/proper-arrows/return": [ "error", { "sequence": true, "trivial": false } ]
```

Comma sequences are not very common, but one place they're a bit more common is as the concise return expression from an `=>` arrow function so that multiple expression-statments can be strung together without needing a full function body. This may be clever or concise, but it's almost always less readable than just using separate statements.

For example:

```js
var fn2 = (x,y) => { x = 3; y = foo(x + 1); return [x,y]; };
```

In this snippet, the `=>` arrow function uses the full-body return form with separate statements and an explicit `return` statement. As such, it would pass this rule.

By contrast, this rule mode *would* report errors for:

```js
var fn2 = (x,y) => (x = 3, y = foo(x + 1), [x,y] );
```

In this snippet, the `=>` arrow function has a comma sequence as the concise return expression.

## Rule: `"this"`

The **proper-arrows**/*this* rule requires `=>` arrow functions to reference the `this` keyword. It also supports a `"never"` configuration mode, which reverses the rule and means that `=>` arrow functions must never use `this`.

To turn this rule on:

```json
"@getify/proper-arrows/this": "error"
```

```json
"@getify/proper-arrows/this": [ "error", "always", { "no-global": true, "trivial": false } ]
```

The main purpose of this rule is to avoid usage of `=>` arrow functions as just function shorthand (i.e., `arr.map(x => x * 2)`), which can be argued is a misusage. Concise `=>` arrow function syntax (with all its myriad variations) can harm readability, so instead `=>` arrow functions should only be used when the "lexical this" behavior is needed.

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

In this snippet, the `=>` arrow function is inside a normal function and therefore looks up and adopts its `this` (aka, "lexical this") -- which is set to the `o` object by the `o.getData()` call. Therefore, the **proper-arrows**/*this* rule would not report an error.

By contrast, this rule *would* report an error for:

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

The **proper-arrows**/*this* rule can be configured in one of three modes: `"nested"` (default), `"always"`, and `"never"`.

* [`"nested"`](#rule-this-configuration-nested) (default) permits a `this` to appear lower in a nested `=>` arrow function (i.e., `x = y => z => this.foo(z)`), as long as there is no non-arrow function boundary crossed.

   Additionally, include the `"no-global"` option (default: `false`) to forbid `this`-containing `=>` arrow functions from the top-level scope (where they might inherit the global object as `this`).

* [`"always"`](#rule-this-configuration-always) is more strict, requiring every single `=>` arrow function to have its own `this` reference.

   Additionally, include the `"no-global"` option (default: `false`) to forbid `this`-containing `=>` arrow functions from the top-level scope (where they might inherit the global object as `this`).

* [`"never"`](#rule-this-configuration-never) is the reverse of the rule: all `=>` arrow functions are forbidden from using `this`.

#### Rule `"this"` Configuration: `"nested"`

To configure this rule mode (default):

```json
"@getify/proper-arrows/this": "error"
```

```json
"@getify/proper-arrows/this": [ "error", "nested" ]
```

```json
"@getify/proper-arrows/this": [ "error", "nested", { "no-global": true, "trivial": false } ]
```

This rule mode allows a `this` to appear either in the `=>` arrow function, or nested deeper in a chain of `=>` arrow functions, as long as there is **no non-arrow function boundary crossed in the nesting**.

If the `"no-global"` option **has not** been set for this mode, these statements will all pass the rule:

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

##### `"no-global"` Option

If the `"no-global"` option **has** been set for this mode, these statements will all pass the rule:

```js
function foo() { return a => this.bar(a); }

function foo() { return a => b => this.bar(a,b); }

function foo(cb = a => this.bar(a)) { .. }

function foo(cb = a => b => this.bar(a,b)) { .. }
```

And these statments will each fail this `"no-global"` option rule:

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

```json
"@getify/proper-arrows/this": [ "error", "always" ]
```

```json
"@getify/proper-arrows/this": [ "error", "always", { "no-global": true, "trivial": false } ]
```

This rule mode requires a `this` reference to appear in every single `=>` arrow function (e.g., nested `this` is not sufficient).

If the `"no-global"` option **has not** been set for this mode, these statements will all pass the rule:

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

##### `"no-global"` Option

If the `"no-global"` option **has** been set for this mode, these statements will all pass the rule:

```js
function foo() { return a => this.bar(a); }

function foo(cb = a => this.bar(a)) { .. }
```

And these statements will each fail this `"no-global"` option rule:

```js
var foo = a => this.bar(a);

var o = {
    foo: a => this.bar(a)
};
```

### Rule `"this"` Configuration: `"never"`

To configure this rule mode:

```json
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

**Note:** The `"no-global"` option and [`"trivial"` option](#trivial--arrow-functions) are not applicable and have no effect for this rule mode.

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

    * `npm run test:dist` will run the test suite against `dist/eslint-plugins-proper-arrows.js` instead of the default of `lib/index.js`.

    * `npm run test:package` will run the test suite as if the package had just been installed via npm. This ensures `package.json`:`main` properly references `dist/eslint-plugins-proper-arrows.js` for inclusion.

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
