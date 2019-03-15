"use strict";

var linterOptions = {
	"return": {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/return": "error", },
	},
};

QUnit.test( "RETURN: arrow with regular return", function test(assert){
	var code = `
		var x = y => { return { y }; };
	`;

	var results = eslinter.verify( code, linterOptions["return"] );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "RETURN: arrow with concise-object return", function test(assert){
	var code = `
		var x = y => ({ y });
	`;

	var results = eslinter.verify( code, linterOptions["return"] );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/return", "ruleId" );
	assert.strictEqual( messageId, "noConciseObject", "messageId" );
} );
