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
	whereGlobalOn: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/where": ["error",{global:true,property:false,export:false,trivial:true,},], },
	},
	whereGlobalOff: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/where": ["error",{global:false,property:false,export:false,trivial:true,},], },
	},
	whereModuleGlobalDefault: {
		parserOptions: { ecmaVersion: 2015, sourceType: "module", },
		rules: { "@getify/proper-arrows/where": ["error",{property:false,export:false,trivial:true,},], },
	},
	whereModuleGlobalOn: {
		parserOptions: { ecmaVersion: 2015, sourceType: "module", },
		rules: { "@getify/proper-arrows/where": ["error",{global:true,property:false,export:false,trivial:true,},], },
	},
	whereModuleGlobalOff: {
		parserOptions: { ecmaVersion: 2015, sourceType: "module", },
		rules: { "@getify/proper-arrows/where": ["error",{global:false,property:false,export:false,trivial:true,},], },
	},
	whereGlobalDefaultDeclarationOn: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/where": ["error",{"global-declaration":true,property:false,export:false,trivial:true,},], },
	},
	whereGlobalOnDeclarationOn: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/where": ["error",{global:true,"global-declaration":true,property:false,export:false,trivial:true,},], },
	},
	whereGlobalOffDeclarationOn: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/where": ["error",{global:false,"global-declaration":true,property:false,export:false,trivial:true,},], },
	},
	whereModuleGlobalDefaultDeclarationOn: {
		parserOptions: { ecmaVersion: 2015, sourceType: "module", },
		rules: { "@getify/proper-arrows/where": ["error",{"global-declaration":true,property:false,export:false,trivial:true,},], },
	},
	whereModuleGlobalOnDeclarationOn: {
		parserOptions: { ecmaVersion: 2015, sourceType: "module", },
		rules: { "@getify/proper-arrows/where": ["error",{global:true,"global-declaration":true,property:false,export:false,trivial:true,},], },
	},
	whereModuleGlobalOffDeclarationOn: {
		parserOptions: { ecmaVersion: 2015, sourceType: "module", },
		rules: { "@getify/proper-arrows/where": ["error",{global:false,"global-declaration":true,property:false,export:false,trivial:true,},], },
	},
	whereGlobalOffDeclarationOff: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/where": ["error",{global:false,"global-declaration":false,property:false,export:false,trivial:true,},], },
	},
	whereModuleGlobalOffDeclarationOff: {
		parserOptions: { ecmaVersion: 2015, sourceType: "module", },
		rules: { "@getify/proper-arrows/where": ["error",{global:false,"global-declaration":false,property:false,export:false,trivial:true,},], },
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
		f = x => y;
		var o = { fn: z => z };
		var g = w => w;
	`;

	var results = eslinter.verify( code, linterOptions.whereDefault );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
		{ ruleId: ruleId3, messageId: messageId3, } = {},
		{ ruleId: ruleId4, messageId: messageId4, } = {},
	] = results || [];

	assert.expect( 9 );
	assert.strictEqual( results.length, 4, "only 4 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/where", "ruleId1" );
	assert.strictEqual( messageId1, "noGlobal", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/where", "ruleId2" );
	assert.strictEqual( messageId2, "noGlobal", "messageId2" );
	assert.strictEqual( ruleId3, "@getify/proper-arrows/where", "ruleId3" );
	assert.strictEqual( messageId3, "noProperty", "messageId3" );
	assert.strictEqual( ruleId4, "@getify/proper-arrows/where", "ruleId4" );
	assert.strictEqual( messageId4, "noGlobalDeclaration", "messageId3" );
} );

QUnit.test( "WHERE (global/default, global-declaration/default): conforming", function test(assert){
	var code = `
		function foo() {
			f = x => y;
			var g = z => w;
		}
	`;

	var results = eslinter.verify( code, linterOptions.whereGlobalDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "WHERE (global/default, global-declaration/default): violating", function test(assert){
	var code = `
		f = x => y;
		var g = z => w;
	`;

	var results = eslinter.verify( code, linterOptions.whereGlobalDefault );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
	] = results || [];

	assert.expect( 5 );
	assert.strictEqual( results.length, 2, "only 2 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/where", "ruleId1" );
	assert.strictEqual( messageId1, "noGlobal", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/where", "ruleId2" );
	assert.strictEqual( messageId2, "noGlobalDeclaration", "messageId1" );
} );

QUnit.test( "WHERE (global/on, global-declaration/default): conforming", function test(assert){
	var code = `
		function foo() {
			f = x => y;
			var g = z => w;
		}
	`;

	var results = eslinter.verify( code, linterOptions.whereGlobalOn );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "WHERE (global/on, global-declaration/default): violating", function test(assert){
	var code = `
		f = x => y;
		var g = z => w;
	`;

	var results = eslinter.verify( code, linterOptions.whereGlobalOn );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
	] = results || [];

	assert.expect( 5 );
	assert.strictEqual( results.length, 2, "only 2 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/where", "ruleId1" );
	assert.strictEqual( messageId1, "noGlobal", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/where", "ruleId2" );
	assert.strictEqual( messageId2, "noGlobalDeclaration", "messageId2" );
} );

QUnit.test( "WHERE (global/off, global-declaration/default): conforming", function test(assert){
	var code = `
		function foo() {
			f = x => y;
			var g = z => w;
		}
		f = x => y;
		var g = z => w;
	`;

	var results = eslinter.verify( code, linterOptions.whereGlobalOff );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "WHERE (module-global/default, global-declaration/default): conforming", function test(assert){
	var code = `
		function foo() {
			f = x => y;
			var g = z => w;
		}
	`;

	var results = eslinter.verify( code, linterOptions.whereModuleGlobalDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "WHERE (module-global/default, global-declaration/default): violating", function test(assert){
	var code = `
		f = x => y;
		var g = z => w;
	`;

	var results = eslinter.verify( code, linterOptions.whereModuleGlobalDefault );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
	] = results || [];

	assert.expect( 5 );
	assert.strictEqual( results.length, 2, "only 2 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/where", "ruleId1" );
	assert.strictEqual( messageId1, "noGlobal", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/where", "ruleId2" );
	assert.strictEqual( messageId2, "noGlobalDeclaration", "messageId2" );
} );

QUnit.test( "WHERE (module-global/on, global-declaration/default): conforming", function test(assert){
	var code = `
		function foo() {
			f = x => y;
			var g = z => w;
		}
	`;

	var results = eslinter.verify( code, linterOptions.whereModuleGlobalOn );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "WHERE (module-global/on, global-declaration/default): violating", function test(assert){
	var code = `
		f = x => y;
		var g = z => w;
	`;

	var results = eslinter.verify( code, linterOptions.whereModuleGlobalOn );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
	] = results || [];

	assert.expect( 5 );
	assert.strictEqual( results.length, 2, "only 2 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/where", "ruleId1" );
	assert.strictEqual( messageId1, "noGlobal", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/where", "ruleId2" );
	assert.strictEqual( messageId2, "noGlobalDeclaration", "messageId2" );
} );

QUnit.test( "WHERE (module-global/off, global-declaration/default): conforming", function test(assert){
	var code = `
		function foo() {
			f = x => y;
			var g = z => w;
		}
		f = x => y;
		var g = z => w;
	`;

	var results = eslinter.verify( code, linterOptions.whereModuleGlobalOff );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "WHERE (global/default, global-declaration/on): conforming", function test(assert){
	var code = `
		function foo() {
			f = x => y;
			var g = z => w;
		}
	`;

	var results = eslinter.verify( code, linterOptions.whereGlobalDefaultDeclarationOn );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "WHERE (global/default, global-declaration/on): violating", function test(assert){
	var code = `
		f = x => y;
		var g = z => w;
	`;

	var results = eslinter.verify( code, linterOptions.whereGlobalDefaultDeclarationOn );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
	] = results || [];

	assert.expect( 5 );
	assert.strictEqual( results.length, 2, "only 2 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/where", "ruleId1" );
	assert.strictEqual( messageId1, "noGlobal", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/where", "ruleId2" );
	assert.strictEqual( messageId2, "noGlobalDeclaration", "messageId1" );
} );

QUnit.test( "WHERE (global/on, global-declaration/on): conforming", function test(assert){
	var code = `
		function foo() {
			f = x => y;
			var g = z => w;
		}
	`;

	var results = eslinter.verify( code, linterOptions.whereGlobalOnDeclarationOn );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "WHERE (global/on, global-declaration/on): violating", function test(assert){
	var code = `
		f = x => y;
		var g = z => w;
	`;

	var results = eslinter.verify( code, linterOptions.whereGlobalOnDeclarationOn );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
	] = results || [];

	assert.expect( 5 );
	assert.strictEqual( results.length, 2, "only 2 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/where", "ruleId1" );
	assert.strictEqual( messageId1, "noGlobal", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/where", "ruleId2" );
	assert.strictEqual( messageId2, "noGlobalDeclaration", "messageId2" );
} );

QUnit.test( "WHERE (global/off, global-declaration/on): conforming", function test(assert){
	var code = `
		function foo() {
			f = x => y;
			var g = z => w;
		}
		f = x => y;
		var g = z => w;
	`;

	var results = eslinter.verify( code, linterOptions.whereGlobalOffDeclarationOn );

	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
	] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/where", "ruleId1" );
	assert.strictEqual( messageId1, "noGlobalDeclaration", "messageId1" );
} );

QUnit.test( "WHERE (module-global/default, global-declaration/on): conforming", function test(assert){
	var code = `
		function foo() {
			f = x => y;
			var g = z => w;
		}
	`;

	var results = eslinter.verify( code, linterOptions.whereModuleGlobalDefaultDeclarationOn );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "WHERE (module-global/default, global-declaration/on): violating", function test(assert){
	var code = `
		f = x => y;
		var g = z => w;
	`;

	var results = eslinter.verify( code, linterOptions.whereModuleGlobalDefaultDeclarationOn );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
	] = results || [];

	assert.expect( 5 );
	assert.strictEqual( results.length, 2, "only 2 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/where", "ruleId1" );
	assert.strictEqual( messageId1, "noGlobal", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/where", "ruleId2" );
	assert.strictEqual( messageId2, "noGlobalDeclaration", "messageId2" );
} );

QUnit.test( "WHERE (module-global/on, global-declaration/on): conforming", function test(assert){
	var code = `
		function foo() {
			f = x => y;
			var g = z => w;
		}
	`;

	var results = eslinter.verify( code, linterOptions.whereModuleGlobalOnDeclarationOn );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "WHERE (module-global/on, global-declaration/on): violating", function test(assert){
	var code = `
		f = x => y;
		var g = z => w;
	`;

	var results = eslinter.verify( code, linterOptions.whereModuleGlobalOnDeclarationOn );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
	] = results || [];

	assert.expect( 5 );
	assert.strictEqual( results.length, 2, "only 2 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/where", "ruleId1" );
	assert.strictEqual( messageId1, "noGlobal", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/where", "ruleId2" );
	assert.strictEqual( messageId2, "noGlobalDeclaration", "messageId2" );
} );

QUnit.test( "WHERE (module-global/off, global-declaration/on): conforming", function test(assert){
	var code = `
		function foo() {
			f = x => y;
			var g = z => w;
		}
		f = x => y;
		var g = z => w;
	`;

	var results = eslinter.verify( code, linterOptions.whereModuleGlobalOffDeclarationOn );

	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
	] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/where", "ruleId1" );
	assert.strictEqual( messageId1, "noGlobalDeclaration", "messageId1" );
} );

QUnit.test( "WHERE (global/off, global-declaration/off): conforming", function test(assert){
	var code = `
		function foo() {
			f = x => y;
			var g = z => w;
		}
		f = x => y;
		var g = z => w;
	`;

	var results = eslinter.verify( code, linterOptions.whereGlobalOffDeclarationOff );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "WHERE (module-global/off, global-declaration/off): conforming", function test(assert){
	var code = `
		function foo() {
			f = x => y;
			var g = z => w;
		}
		f = x => y;
		var g = z => w;
	`;

	var results = eslinter.verify( code, linterOptions.whereModuleGlobalOffDeclarationOff );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
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

QUnit.test( "WHERE (default-export, default): violating", function test(assert){
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

QUnit.test( "WHERE (default-export): violating", function test(assert){
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

QUnit.test( "WHERE (named-declaration-export, default): violating", function test(assert){
	var code = `
		export var x = () => {};
	`;

	var results = eslinter.verify( code, linterOptions.whereExportDefault );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/where", "ruleId" );
	assert.strictEqual( messageId, "noExport", "messageId" );
} );

QUnit.test( "WHERE (named-declaration-export): violating", function test(assert){
	var code = `
		export var x = () => {};
	`;

	var results = eslinter.verify( code, linterOptions.whereExport );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/where", "ruleId" );
	assert.strictEqual( messageId, "noExport", "messageId" );
} );
