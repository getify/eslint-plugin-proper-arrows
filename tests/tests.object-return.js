"use strict";

QUnit.test( "OBJECT-RETURN: arrow with regular return", function test(assert){
	var code = `
		var x = y => { return { y }; };
	`;

	var results = eslinter.verify( code, objectReturnOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "OBJECT-RETURN: arrow with concise-object return", function test(assert){
	var code = `
		var x = y => ({ y });
	`;

	var results = eslinter.verify( code, objectReturnOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/object-return", "ruleId" );
	assert.strictEqual( messageId, "noConciseObject", "messageId" );
} );
