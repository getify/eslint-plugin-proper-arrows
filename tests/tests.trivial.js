"use strict";

var linterOptions = {
	trivialDefault: {
		parserOptions: { ecmaVersion: 2015, },
		rules: {
			"@getify/proper-arrows/params": "error",
			"@getify/proper-arrows/name": "error",
			"@getify/proper-arrows/where": "error",
			"@getify/proper-arrows/return": "error",
			"@getify/proper-arrows/this": "error",
		},
	},
	trivial: {
		parserOptions: { ecmaVersion: 2015, },
		rules: {
			"@getify/proper-arrows/params": ["error",{trivial:true,},],
			"@getify/proper-arrows/name": ["error",{trivial:true,},],
			"@getify/proper-arrows/where": ["error",{trivial:true,},],
			"@getify/proper-arrows/return": ["error",{trivial:true,},],
			"@getify/proper-arrows/this": ["error","nested",{trivial:true,},],
		},
	},
	trivialModuleDefault: {
		parserOptions: { ecmaVersion: 2015, sourceType: "module", },
		rules: {
			"@getify/proper-arrows/where": "error",
		},
	},
	trivialModule: {
		parserOptions: { ecmaVersion: 2015, sourceType: "module", },
		rules: {
			"@getify/proper-arrows/where": ["error",{trivial:true,},],
		},
	},
};

QUnit.test( "TRIVIAL (default): violating", function test(assert){
	var code = `
		function foo() {
			var f;
			f = () => () => {};
			f(() => 1);
			f(() => e);
			f(j => {});
			f(z => z);
			f(g => h);
			f(k => null);
			f(h => void 0);
			return { f: v => v };
		}
		var f = r => r;
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
		function foo() {
			var f;
			f = () => () => {};
			f(() => 1);
			f(() => e);
			f(j => {});
			f(z => z);
			f(g => h);
			f(k => null);
			f(h => void 0);
			return { f: v => v };
		}
		var f = r => r;
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
		{ ruleId: ruleId24, messageId: messageId24, message: message24, } = {},
		{ ruleId: ruleId25, messageId: messageId25, message: message25, } = {},
		{ ruleId: ruleId26, messageId: messageId26, message: message26, } = {},
		{ ruleId: ruleId27, messageId: messageId27, message: message27, } = {},
		{ ruleId: ruleId28, messageId: messageId28, message: message28, } = {},
		{ ruleId: ruleId29, messageId: messageId29, message: message29, } = {},
		{ ruleId: ruleId30, messageId: messageId30, message: message30, } = {},
		{ ruleId: ruleId31, messageId: messageId31, message: message31, } = {},
		{ ruleId: ruleId32, messageId: messageId32, message: message32, } = {},
		{ ruleId: ruleId33, messageId: messageId33, message: message33, } = {},
	] = results || [];

	assert.expect( 78 );
	assert.strictEqual( results.length, 33, "only 33 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/this", "ruleId1" );
	assert.strictEqual( messageId1, "noThisNested", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/return", "ruleId2" );
	assert.strictEqual( messageId2, "noChainedArrow", "messageId2" );
	assert.strictEqual( ruleId3, "@getify/proper-arrows/name", "ruleId3" );
	assert.strictEqual( messageId3, "noName", "messageId3" );
	assert.strictEqual( ruleId4, "@getify/proper-arrows/this", "ruleId4" );
	assert.strictEqual( messageId4, "noThisNested", "messageId4" );
	assert.strictEqual( ruleId5, "@getify/proper-arrows/this", "ruleId5" );
	assert.strictEqual( messageId5, "noThisNested", "messageId5" );
	assert.strictEqual( ruleId6, "@getify/proper-arrows/name", "ruleId6" );
	assert.strictEqual( messageId6, "noName", "messageId6" );
	assert.strictEqual( ruleId7, "@getify/proper-arrows/this", "ruleId7" );
	assert.strictEqual( messageId7, "noThisNested", "messageId7" );
	assert.strictEqual( ruleId8, "@getify/proper-arrows/name", "ruleId8" );
	assert.strictEqual( messageId8, "noName", "messageId8" );
	assert.strictEqual( ruleId9, "@getify/proper-arrows/params", "ruleId9" );
	assert.strictEqual( messageId9, "tooShort", "messageId9" );
	assert.ok( message9.includes("`j`"), "message9" );
	assert.strictEqual( ruleId10, "@getify/proper-arrows/name", "ruleId10" );
	assert.strictEqual( messageId10, "noName", "messageId10" );
	assert.strictEqual( ruleId11, "@getify/proper-arrows/this", "ruleId11" );
	assert.strictEqual( messageId11, "noThisNested", "messageId11" );
	assert.strictEqual( ruleId12, "@getify/proper-arrows/params", "ruleId12" );
	assert.strictEqual( messageId12, "unused", "messageId12" );
	assert.ok( message12.includes("`j`"), "message12" );
	assert.strictEqual( ruleId13, "@getify/proper-arrows/name", "ruleId13" );
	assert.strictEqual( messageId13, "noName", "messageId13" );
	assert.strictEqual( ruleId14, "@getify/proper-arrows/params", "ruleId14" );
	assert.strictEqual( messageId14, "tooShort", "messageId14" );
	assert.ok( message14.includes("`z`"), "message14" );
	assert.strictEqual( ruleId15, "@getify/proper-arrows/this", "ruleId15" );
	assert.strictEqual( messageId15, "noThisNested", "messageId15" );
	assert.strictEqual( ruleId16, "@getify/proper-arrows/name", "ruleId16" );
	assert.strictEqual( messageId16, "noName", "messageId16" );
	assert.strictEqual( ruleId17, "@getify/proper-arrows/params", "ruleId17" );
	assert.strictEqual( messageId17, "tooShort", "messageId17" );
	assert.ok( message17.includes("`g`"), "message17" );
	assert.strictEqual( ruleId18, "@getify/proper-arrows/params", "ruleId18" );
	assert.strictEqual( messageId18, "unused", "messageId18" );
	assert.ok( message18.includes("`g`"), "message18" );
	assert.strictEqual( ruleId19, "@getify/proper-arrows/this", "ruleId19" );
	assert.strictEqual( messageId19, "noThisNested", "messageId19" );
	assert.strictEqual( ruleId20, "@getify/proper-arrows/name", "ruleId20" );
	assert.strictEqual( messageId20, "noName", "messageId20" );
	assert.strictEqual( ruleId21, "@getify/proper-arrows/params", "ruleId21" );
	assert.strictEqual( messageId21, "unused", "messageId21" );
	assert.ok( message21.includes("`k`"), "message21" );
	assert.strictEqual( ruleId22, "@getify/proper-arrows/this", "ruleId22" );
	assert.strictEqual( messageId22, "noThisNested", "messageId22" );
	assert.strictEqual( ruleId23, "@getify/proper-arrows/params", "ruleId23" );
	assert.strictEqual( messageId23, "tooShort", "messageId23" );
	assert.ok( message23.includes("`k`"), "message23" );
	assert.strictEqual( ruleId24, "@getify/proper-arrows/name", "ruleId24" );
	assert.strictEqual( messageId24, "noName", "messageId24" );
	assert.strictEqual( ruleId25, "@getify/proper-arrows/params", "ruleId25" );
	assert.strictEqual( messageId25, "tooShort", "messageId25" );
	assert.ok( message25.includes("`h`"), "message25" );
	assert.strictEqual( ruleId26, "@getify/proper-arrows/params", "ruleId26" );
	assert.strictEqual( messageId26, "unused", "messageId26" );
	assert.ok( message26.includes("`h`"), "message26" );
	assert.strictEqual( ruleId27, "@getify/proper-arrows/this", "ruleId27" );
	assert.strictEqual( messageId27, "noThisNested", "messageId27" );
	assert.strictEqual( ruleId28, "@getify/proper-arrows/where", "ruleId28" );
	assert.strictEqual( messageId28, "noProperty", "messageId28" );
	assert.strictEqual( ruleId29, "@getify/proper-arrows/params", "ruleId29" );
	assert.strictEqual( messageId29, "tooShort", "messageId29" );
	assert.ok( message29.includes("`v`"), "message29" );
	assert.strictEqual( ruleId30, "@getify/proper-arrows/this", "ruleId30" );
	assert.strictEqual( messageId30, "noThisNested", "messageId30" );
	assert.strictEqual( ruleId31, "@getify/proper-arrows/where", "ruleId31" );
	assert.strictEqual( messageId31, "noGlobal", "messageId31" );
	assert.strictEqual( ruleId32, "@getify/proper-arrows/params", "ruleId32" );
	assert.strictEqual( messageId32, "tooShort", "messageId32" );
	assert.ok( message32.includes("`r`"), "message32" );
	assert.strictEqual( ruleId33, "@getify/proper-arrows/this", "ruleId33" );
	assert.strictEqual( messageId33, "noThisNested", "messageId33" );
} );

QUnit.test( "TRIVIAL (module-export, default): violating", function test(assert){
	var code = `
		export default () => {};
	`;

	var results = eslinter.verify( code, linterOptions.trivialModuleDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "TRIVIAL (module-export, trivial:true): violating", function test(assert){
	var code = `
		export default () => {};
	`;

	var results = eslinter.verify( code, linterOptions.trivialModule );

	assert.expect( 1 );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/where", "ruleId" );
	assert.strictEqual( messageId, "noExport", "messageId" );
} );
