"use strict";

var linterOptions = {
	whereDefault: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/where": ["error",{trivial:true,},], },
	},
	whereGlobalDefault: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/where": ["error",{property:false,export:false,trivial:true,},], },
	},
	whereGlobal: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/where": ["error",{global:true,property:false,export:false,trivial:true,},], },
	},
	wherePropertyDefault: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/where": ["error",{global:false,export:false,trivial:true,},], },
	},
	whereProperty: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/where": ["error",{global:false,property:true,export:false,trivial:true,},], },
	},
	whereExportDefault: {
		parserOptions: { ecmaVersion: 2015, sourceType: "module", },
		rules: { "@getify/proper-arrows/where": ["error",{global:false,property:false,trivial:true,},], },
	},
	whereExport: {
		parserOptions: { ecmaVersion: 2015, sourceType: "module", },
		rules: { "@getify/proper-arrows/where": ["error",{global:false,property:false,export:true,trivial:true,},], },
	},
};

QUnit.test( "WHERE (default): conforming", function test(assert){
	var code = `
		function foo() {
			var f = x => y;
			return { fn: f };
		}
	`;

	var results = eslinter.verify( code, linterOptions.whereDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "WHERE (default): violating", function test(assert){
	var code = `
		var f = x => y;
		var o = { fn: z => z };
	`;

	var results = eslinter.verify( code, linterOptions.whereDefault );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
		{ ruleId: ruleId3, messageId: messageId3, } = {},
	] = results || [];

	assert.expect( 7 );
	assert.strictEqual( results.length, 3, "only 3 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/where", "ruleId1" );
	assert.strictEqual( messageId1, "noGlobal", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/where", "ruleId2" );
	assert.strictEqual( messageId2, "noGlobal", "messageId2" );
	assert.strictEqual( ruleId3, "@getify/proper-arrows/where", "ruleId3" );
	assert.strictEqual( messageId3, "noProperty", "messageId3" );
} );

QUnit.test( "WHERE (global, default): conforming", function test(assert){
	var code = `
		function foo() {
			var f = x => y;
		}
	`;

	var results = eslinter.verify( code, linterOptions.whereGlobalDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "WHERE (global, default): violating", function test(assert){
	var code = `
		var f = x => y;
	`;

	var results = eslinter.verify( code, linterOptions.whereGlobalDefault );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/where", "ruleId" );
	assert.strictEqual( messageId, "noGlobal", "messageId" );
} );

QUnit.test( "WHERE (global): conforming", function test(assert){
	var code = `
		function foo() {
			var f = x => y;
		}
	`;

	var results = eslinter.verify( code, linterOptions.whereGlobal );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "WHERE (global): violating", function test(assert){
	var code = `
		var f = x => y;
	`;

	var results = eslinter.verify( code, linterOptions.whereGlobal );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/where", "ruleId" );
	assert.strictEqual( messageId, "noGlobal", "messageId" );
} );

QUnit.test( "WHERE (property, default): violating", function test(assert){
	var code = `
		var o = { f: x => y };
	`;

	var results = eslinter.verify( code, linterOptions.wherePropertyDefault );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/where", "ruleId" );
	assert.strictEqual( messageId, "noProperty", "messageId" );
} );

QUnit.test( "WHERE (property): violating", function test(assert){
	var code = `
		var o = { f: x => y };
	`;

	var results = eslinter.verify( code, linterOptions.whereProperty );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/where", "ruleId" );
	assert.strictEqual( messageId, "noProperty", "messageId" );
} );

QUnit.test( "WHERE (export, default): violating", function test(assert){
	var code = `
		export default () => {};
	`;

	var results = eslinter.verify( code, linterOptions.whereExportDefault );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/where", "ruleId" );
	assert.strictEqual( messageId, "noExport", "messageId" );
} );

QUnit.test( "WHERE (export): violating", function test(assert){
	var code = `
		export default () => {};
	`;

	var results = eslinter.verify( code, linterOptions.whereExport );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/where", "ruleId" );
	assert.strictEqual( messageId, "noExport", "messageId" );
} );
