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

eslinter.defineRule("@getify/proper-arrows/params",properArrows.rules.params);
eslinter.defineRule("@getify/proper-arrows/name",properArrows.rules.name);
eslinter.defineRule("@getify/proper-arrows/where",properArrows.rules.where);
eslinter.defineRule("@getify/proper-arrows/return",properArrows.rules.return);
eslinter.defineRule("@getify/proper-arrows/this",properArrows.rules.this);

global.QUnit = require("qunit");

require(path.join("..","tests","qunit.config.js"));
require(path.join("..","tests","tests.params.js"));
require(path.join("..","tests","tests.name.js"));
require(path.join("..","tests","tests.where.js"));
require(path.join("..","tests","tests.return.js"));
require(path.join("..","tests","tests.this.js"));
require(path.join("..","tests","tests.trivial.js"));

QUnit.start();
