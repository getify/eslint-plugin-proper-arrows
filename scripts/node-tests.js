#!/usr/bin/env node

"use strict";

var path = require("path");

var Linter = require("eslint").Linter;
var eslinter = global.eslinter = new Linter();
var properArrows;

/* istanbul ignore next */
if (process.env.TEST_DIST) {
	properArrows = require(path.join(__dirname,"..","dist","eslint-plugin-proper-arrows.js"));
}
/* istanbul ignore next */
else if (process.env.TEST_PACKAGE) {
	properArrows = require(path.join(__dirname,".."));
}
else {
	properArrows = require(path.join(__dirname,"..","lib","index.js"));
}

eslinter.defineRule("@getify/proper-arrows/name",properArrows.rules.name);
eslinter.defineRule("@getify/proper-arrows/object-return",properArrows.rules["object-return"]);
eslinter.defineRule("@getify/proper-arrows/this",properArrows.rules.this);

global.nameOptions = {
	parserOptions: { ecmaVersion: 2015, },
	rules: { "@getify/proper-arrows/name": "error", },
};
global.objectReturnOptions = {
	parserOptions: { ecmaVersion: 2015, },
	rules: { "@getify/proper-arrows/object-return": "error", },
};
global.thisAlwaysOptions = {
	parserOptions: { ecmaVersion: 2015, },
	rules: { "@getify/proper-arrows/this": ["error","always",], },
};
global.thisNestedOptions = {
	parserOptions: { ecmaVersion: 2015, },
	rules: { "@getify/proper-arrows/this": ["error","nested",], },
};
global.thisAlwaysNoGlobalOptions = {
	parserOptions: { ecmaVersion: 2015, },
	rules: { "@getify/proper-arrows/this": ["error","always","no-global",], },
};
global.thisNestedNoGlobalOptions = {
	parserOptions: { ecmaVersion: 2015, },
	rules: { "@getify/proper-arrows/this": ["error","nested","no-global",], },
};
global.thisNeverOptions = {
	parserOptions: { ecmaVersion: 2015, },
	rules: { "@getify/proper-arrows/this": ["error","never",], },
};
global.thisDefaultOptions = {
	parserOptions: { ecmaVersion: 2015, },
	rules: { "@getify/proper-arrows/this": ["error",], },
};

global.QUnit = require("qunit");

require(path.join("..","tests","qunit.config.js"));
require(path.join("..","tests","tests.name.js"));
require(path.join("..","tests","tests.object-return.js"));
require(path.join("..","tests","tests.this.js"));

QUnit.start();
