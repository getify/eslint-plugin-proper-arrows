"use strict";

var linterOptions = {
	locationDefault: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/location": ["error",{trivial:true,},], },
	},
	locationGlobalDefault: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/location": ["error",{property:false,export:false,trivial:true,},], },
	},
	locationGlobal: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/location": ["error",{global:true,property:false,export:false,trivial:true,},], },
	},
	locationPropertyDefault: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/location": ["error",{global:false,export:false,trivial:true,},], },
	},
	locationProperty: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/location": ["error",{global:false,property:true,export:false,trivial:true,},], },
	},
	locationExportDefault: {
		parserOptions: { ecmaVersion: 2015, sourceType: "module", },
		rules: { "@getify/proper-arrows/location": ["error",{global:false,property:false,trivial:true,},], },
	},
	locationExport: {
		parserOptions: { ecmaVersion: 2015, sourceType: "module", },
		rules: { "@getify/proper-arrows/location": ["error",{global:false,property:false,export:true,trivial:true,},], },
	},
};

QUnit.test( "LOCATION (default): conforming", function test(assert){
	var code = `
		function foo() {
			var f = x => y;
			return { fn: f };
		}
	`;

	var results = eslinter.verify( code, linterOptions.locationDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "LOCATION (default): violating", function test(assert){
	var code = `
		var f = x => y;
		var o = { fn: z => z };
	`;

	var results = eslinter.verify( code, linterOptions.locationDefault );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
		{ ruleId: ruleId3, messageId: messageId3, } = {},
	] = results || [];

	assert.expect( 7 );
	assert.strictEqual( results.length, 3, "only 3 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/location", "ruleId1" );
	assert.strictEqual( messageId1, "noGlobal", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/location", "ruleId2" );
	assert.strictEqual( messageId2, "noGlobal", "messageId2" );
	assert.strictEqual( ruleId3, "@getify/proper-arrows/location", "ruleId3" );
	assert.strictEqual( messageId3, "noProperty", "messageId3" );
} );

QUnit.test( "LOCATION (global, default): conforming", function test(assert){
	var code = `
		function foo() {
			var f = x => y;
		}
	`;

	var results = eslinter.verify( code, linterOptions.locationGlobalDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "LOCATION (global, default): violating", function test(assert){
	var code = `
		var f = x => y;
	`;

	var results = eslinter.verify( code, linterOptions.locationGlobalDefault );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/location", "ruleId" );
	assert.strictEqual( messageId, "noGlobal", "messageId" );
} );

QUnit.test( "LOCATION (global): conforming", function test(assert){
	var code = `
		function foo() {
			var f = x => y;
		}
	`;

	var results = eslinter.verify( code, linterOptions.locationGlobal );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "LOCATION (global): violating", function test(assert){
	var code = `
		var f = x => y;
	`;

	var results = eslinter.verify( code, linterOptions.locationGlobal );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/location", "ruleId" );
	assert.strictEqual( messageId, "noGlobal", "messageId" );
} );

QUnit.test( "LOCATION (property, default): violating", function test(assert){
	var code = `
		var o = { f: x => y };
	`;

	var results = eslinter.verify( code, linterOptions.locationPropertyDefault );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/location", "ruleId" );
	assert.strictEqual( messageId, "noProperty", "messageId" );
} );

QUnit.test( "LOCATION (property): violating", function test(assert){
	var code = `
		var o = { f: x => y };
	`;

	var results = eslinter.verify( code, linterOptions.locationProperty );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/location", "ruleId" );
	assert.strictEqual( messageId, "noProperty", "messageId" );
} );

QUnit.test( "LOCATION (export, default): violating", function test(assert){
	var code = `
		export default () => {};
	`;

	var results = eslinter.verify( code, linterOptions.locationExportDefault );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/location", "ruleId" );
	assert.strictEqual( messageId, "noExport", "messageId" );
} );

QUnit.test( "LOCATION (export): violating", function test(assert){
	var code = `
		export default () => {};
	`;

	var results = eslinter.verify( code, linterOptions.locationExport );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/location", "ruleId" );
	assert.strictEqual( messageId, "noExport", "messageId" );
} );
