"use strict";

var linterOptions = {
	name: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/name": ["error",{trivial:true,},], },
	},
};

QUnit.test( "NAME: arrow with variable declaration", function test(assert){
	var code = `
		var x = y => y;
	`;

	var results = eslinter.verify( code, linterOptions.name );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "NAME: arrow with variable assignment", function test(assert){
	var code = `
		x = y => y;
	`;

	var results = eslinter.verify( code, linterOptions.name );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "NAME: arrow with property name", function test(assert){
	var code = `
		var o = { x: y => y };
	`;

	var results = eslinter.verify( code, linterOptions.name );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "NAME: arrow in default value clause", function test(assert){
	var code = `
		function f(x = y => y) {}
		[z = (w,q) => w * q] = arr;
		[[z] = [(a,b) => a * b]] = arr;
	`;

	var results = eslinter.verify( code, linterOptions.name );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/name", "ruleId" );
	assert.strictEqual( messageId, "noName", "messageId" );
} );

QUnit.test( "NAME: arrow in default module export", function test(assert){
	var code = `
		export default x => x;
	`;

	var results = eslinter.verify( code, { ...linterOptions.name, parserOptions: { ...linterOptions.name.parserOptions, sourceType: "module", }, }, );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "NAME: arrow in expression", function test(assert){
	var code = `
		var x = 1 + (y => y);
	`;

	var results = eslinter.verify( code, linterOptions.name );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/name", "ruleId" );
	assert.strictEqual( messageId, "noName", "messageId" );
} );

QUnit.test( "NAME: arrow as IIFE", function test(assert){
	var code = `
		(x => x)(3);
	`;

	var results = eslinter.verify( code, linterOptions.name );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/name", "ruleId" );
	assert.strictEqual( messageId, "noName", "messageId" );
} );

QUnit.test( "NAME: arrows as returns", function test(assert){
	var code = `
		function x() { return y => y; }
		var z = w => r => r[w];
	`;

	var results = eslinter.verify( code, linterOptions.name );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
	] = results || [];

	assert.expect( 5 );
	assert.strictEqual( results.length, 2, "only 2 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/name", "ruleId1" );
	assert.strictEqual( messageId1, "noName", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/name", "ruleId2" );
	assert.strictEqual( messageId2, "noName", "messageId2" );
} );

QUnit.test( "NAME: arrow as argument", function test(assert){
	var code = `
		x(y => y);
	`;

	var results = eslinter.verify( code, linterOptions.name );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/name", "ruleId" );
	assert.strictEqual( messageId, "noName", "messageId" );
} );

QUnit.test( "NAME: arrow in array", function test(assert){
	var code = `
		var x = [y => y];
	`;

	var results = eslinter.verify( code, linterOptions.name );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/name", "ruleId" );
	assert.strictEqual( messageId, "noName", "messageId" );
} );
