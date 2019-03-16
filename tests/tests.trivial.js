"use strict";

var linterOptions = {
	trivialDefault: {
		parserOptions: { ecmaVersion: 2015, },
		rules: {
			"@getify/proper-arrows/params": "error",
			"@getify/proper-arrows/name": "error",
			"@getify/proper-arrows/return": "error",
			"@getify/proper-arrows/this": "error",
		},
	},
	trivial: {
		parserOptions: { ecmaVersion: 2015, },
		rules: {
			"@getify/proper-arrows/params": ["error",{trivial:true,},],
			"@getify/proper-arrows/name": ["error",{trivial:true,},],
			"@getify/proper-arrows/return": ["error",{trivial:true,},],
			"@getify/proper-arrows/this": ["error","nested",{trivial:true,},],
		},
	},
};

QUnit.test( "TRIVIAL (default): violating", function test(assert){
	var code = `
		var f;
		f = () => () => {};
		f(() => 1);
		f(() => e);
		f(j => {});
		f(z => z);
		f(g => h);
		f(k => null);
	`;

	var results = eslinter.verify( code, linterOptions.trivialDefault );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "TRIVIAL (trivial:true): violating", function test(assert){
	var code = `
		var f;
		f = () => () => {};
		f(() => 1);
		f(() => e);
		f(j => {});
		f(z => z);
		f(g => h);
		f(k => null);
	`;

	var results = eslinter.verify( code, linterOptions.trivial );
	var [
		{ ruleId: ruleId1, messageId: messageId1, message: message1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, message: message2, } = {},
		{ ruleId: ruleId3, messageId: messageId3, message: message3, } = {},
		{ ruleId: ruleId4, messageId: messageId4, message: message4, } = {},
		{ ruleId: ruleId5, messageId: messageId5, message: message5, } = {},
		{ ruleId: ruleId6, messageId: messageId6, message: message6, } = {},
		{ ruleId: ruleId7, messageId: messageId7, message: message7, } = {},
		{ ruleId: ruleId8, messageId: messageId8, message: message8, } = {},
		{ ruleId: ruleId9, messageId: messageId9, message: message9, } = {},
		{ ruleId: ruleId10, messageId: messageId10, message: message10, } = {},
		{ ruleId: ruleId11, messageId: messageId11, message: message11, } = {},
		{ ruleId: ruleId12, messageId: messageId12, message: message12, } = {},
		{ ruleId: ruleId13, messageId: messageId13, message: message13, } = {},
		{ ruleId: ruleId14, messageId: messageId14, message: message14, } = {},
		{ ruleId: ruleId15, messageId: messageId15, message: message15, } = {},
		{ ruleId: ruleId16, messageId: messageId16, message: message16, } = {},
		{ ruleId: ruleId17, messageId: messageId17, message: message17, } = {},
		{ ruleId: ruleId18, messageId: messageId18, message: message18, } = {},
		{ ruleId: ruleId19, messageId: messageId19, message: message19, } = {},
		{ ruleId: ruleId20, messageId: messageId20, message: message20, } = {},
		{ ruleId: ruleId21, messageId: messageId21, message: message21, } = {},
		{ ruleId: ruleId22, messageId: messageId22, message: message22, } = {},
		{ ruleId: ruleId23, messageId: messageId23, message: message23, } = {},
	] = results || [];

	assert.expect( 54 );
	assert.strictEqual( results.length, 23, "only 23 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/this", "ruleId1" );
	assert.strictEqual( messageId1, "noThisNested", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/return", "ruleId2" );
	assert.strictEqual( messageId2, "noChainedArrow", "messageId2" );
	assert.strictEqual( ruleId3, "@getify/proper-arrows/this", "ruleId3" );
	assert.strictEqual( messageId3, "noThisNested", "messageId3" );
	assert.strictEqual( ruleId4, "@getify/proper-arrows/name", "ruleId4" );
	assert.strictEqual( messageId4, "noName", "messageId4" );
	assert.strictEqual( ruleId5, "@getify/proper-arrows/name", "ruleId5" );
	assert.strictEqual( messageId5, "noName", "messageId5" );
	assert.strictEqual( ruleId6, "@getify/proper-arrows/this", "ruleId6" );
	assert.strictEqual( messageId6, "noThisNested", "messageId6" );
	assert.strictEqual( ruleId7, "@getify/proper-arrows/name", "ruleId7" );
	assert.strictEqual( messageId7, "noName", "messageId7" );
	assert.strictEqual( ruleId8, "@getify/proper-arrows/this", "ruleId8" );
	assert.strictEqual( messageId8, "noThisNested", "messageId8" );
	assert.strictEqual( ruleId9, "@getify/proper-arrows/name", "ruleId9" );
	assert.strictEqual( messageId9, "noName", "messageId9" );
	assert.strictEqual( ruleId10, "@getify/proper-arrows/params", "ruleId10" );
	assert.strictEqual( messageId10, "tooShort", "messageId10" );
	assert.ok( /`j`/.test(message10), "message10" );
	assert.strictEqual( ruleId11, "@getify/proper-arrows/params", "ruleId11" );
	assert.strictEqual( messageId11, "unused", "messageId11" );
	assert.ok( /`j`/.test(message11), "message11" );
	assert.strictEqual( ruleId12, "@getify/proper-arrows/this", "ruleId12" );
	assert.strictEqual( messageId12, "noThisNested", "messageId12" );
	assert.strictEqual( ruleId13, "@getify/proper-arrows/name", "ruleId13" );
	assert.strictEqual( messageId13, "noName", "messageId13" );
	assert.strictEqual( ruleId14, "@getify/proper-arrows/this", "ruleId14" );
	assert.strictEqual( messageId14, "noThisNested", "messageId14" );
	assert.strictEqual( ruleId15, "@getify/proper-arrows/params", "ruleId15" );
	assert.strictEqual( messageId15, "tooShort", "messageId15" );
	assert.ok( /`z`/.test(message15), "message15" );
	assert.strictEqual( ruleId16, "@getify/proper-arrows/name", "ruleId16" );
	assert.strictEqual( messageId16, "noName", "messageId16" );
	assert.strictEqual( ruleId17, "@getify/proper-arrows/params", "ruleId17" );
	assert.strictEqual( messageId17, "tooShort", "messageId17" );
	assert.ok( /`g`/.test(message17), "message17" );
	assert.strictEqual( ruleId18, "@getify/proper-arrows/params", "ruleId18" );
	assert.strictEqual( messageId18, "unused", "messageId18" );
	assert.ok( /`g`/.test(message18), "message18" );
	assert.strictEqual( ruleId19, "@getify/proper-arrows/this", "ruleId19" );
	assert.strictEqual( messageId19, "noThisNested", "messageId19" );
	assert.strictEqual( ruleId20, "@getify/proper-arrows/name", "ruleId20" );
	assert.strictEqual( messageId20, "noName", "messageId20" );
	assert.strictEqual( ruleId21, "@getify/proper-arrows/params", "ruleId21" );
	assert.strictEqual( messageId21, "tooShort", "messageId21" );
	assert.ok( /`k`/.test(message21), "message21" );
	assert.strictEqual( ruleId22, "@getify/proper-arrows/params", "ruleId22" );
	assert.strictEqual( messageId22, "unused", "messageId22" );
	assert.ok( /`k`/.test(message22), "message22" );
	assert.strictEqual( ruleId23, "@getify/proper-arrows/this", "ruleId23" );
	assert.strictEqual( messageId23, "noThisNested", "messageId23" );
} );
