"use strict";

var linterOptions = {
	thisDefault: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/this": "error", },
	},
	thisAlways: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/this": ["error","always",{trivial:true,},], },
	},
	thisNested: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/this": ["error","nested",{trivial:true,},], },
	},
	thisAlwaysNoGlobal: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/this": ["error","always",{"no-global": true,trivial:true,},], },
	},
	thisAlwaysNoGlobalNodeCommonJS: {
		parserOptions: { ecmaVersion: 2015, ecmaFeatures: { globalReturn: true, }, },
		rules: { "@getify/proper-arrows/this": ["error","always",{"no-global": true,trivial:true,},], },
	},
	thisNestedNoGlobal: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/this": ["error","nested",{"no-global": true,trivial:true,},], },
	},
	thisNever: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/this": ["error","never",], },
	},
};

QUnit.test( "THIS (always): one arrow, this", function test(assert){
	var code = `
		var x = y => this.foo(y);
	`;

	var results = eslinter.verify( code, linterOptions.thisAlways );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS (always): two nested arrows, both this", function test(assert){
	var code = `
		var x = y => this.foo(z => this.bar(z));
	`;

	var results = eslinter.verify( code, linterOptions.thisAlways );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS (always): one arrow with param arrow, both this", function test(assert){
	var code = `
		var x = (y = z => this.foo(z)) => this.bar(w);
	`;

	var results = eslinter.verify( code, linterOptions.thisAlways );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS (always): two separate arrows, both this", function test(assert){
	var code = `
		var x = y => this.foo(y);
		var z = w => this.bar(w);
	`;

	var results = eslinter.verify( code, linterOptions.thisAlways );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS (always): simple arrow, no this", function test(assert){
	var code = `
		var x = y => y;
	`;

	var results = eslinter.verify( code, linterOptions.thisAlways );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThis", "messageId" );
} );

QUnit.test( "THIS (always): two separate arrows, no this", function test(assert){
	var code = `
		var x = y => foo(y);
		var z = w => bar(w);
	`;

	var results = eslinter.verify( code, linterOptions.thisAlways );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
	] = results || [];

	assert.expect( 5 );
	assert.strictEqual( results.length, 2, "only 2 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/this", "ruleId1" );
	assert.strictEqual( messageId1, "noThis", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/this", "ruleId2" );
	assert.strictEqual( messageId2, "noThis", "messageId2" );
} );

QUnit.test( "THIS (always): two nested arrows, one this nested", function test(assert){
	var code = `
		var x = y => z => this.foo(z);
	`;

	var results = eslinter.verify( code, linterOptions.thisAlways );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThis", "messageId" );
} );

QUnit.test( "THIS (always): two nested arrows, one this not-nested", function test(assert){
	var code = `
		var x = y => this.foo(z => z);
	`;

	var results = eslinter.verify( code, linterOptions.thisAlways );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThis", "messageId" );
} );

QUnit.test( "THIS (always): two nested arrows, no this", function test(assert){
	var code = `
		var x = y => z => z;
	`;

	var results = eslinter.verify( code, linterOptions.thisAlways );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
	] = results || [];

	assert.expect( 5 );
	assert.strictEqual( results.length, 2, "only 2 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/this", "ruleId1" );
	assert.strictEqual( messageId1, "noThis", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/this", "ruleId2" );
	assert.strictEqual( messageId2, "noThis", "messageId2" );
} );

QUnit.test( "THIS (always): one arrow with param arrow, nested this", function test(assert){
	var code = `
		var x = (y = z => foo(z)) => this.bar(w);
	`;

	var results = eslinter.verify( code, linterOptions.thisAlways );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThis", "messageId" );
} );

QUnit.test( "THIS (always): one arrow with param arrow, param this", function test(assert){
	var code = `
		var x = (y = z => this.foo(z)) => bar(w);
	`;

	var results = eslinter.verify( code, linterOptions.thisAlways );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThis", "messageId" );
} );

QUnit.test( "THIS (always): one non-arrow and one arrow, nested this", function test(assert){
	var code = `
		var x = function(){ return y => this.foo(y); };
	`;

	var results = eslinter.verify( code, linterOptions.thisAlways );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );


// **********************************************


QUnit.test( "THIS (always + no-global): inner arrow, this", function test(assert){
	var code = `
		function x() { return y => this.foo(y); }
	`;

	var results = eslinter.verify( code, linterOptions.thisAlwaysNoGlobal );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS (always + no-global): parameter arrow, this", function test(assert){
	var code = `
		function x(z = y => this.foo(y)) { }
	`;

	var results = eslinter.verify( code, linterOptions.thisAlwaysNoGlobal );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS (always + no-global): outer arrow, this", function test(assert){
	var code = `
		var x = y => this.foo(y);
	`;

	var results = eslinter.verify( code, linterOptions.thisAlwaysNoGlobal );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noGlobal", "messageId" );
} );

QUnit.test( "THIS (always + no-global): property arrow, this", function test(assert){
	var code = `
		var o = { x: y => this.foo(y) };
	`;

	var results = eslinter.verify( code, linterOptions.thisAlwaysNoGlobal );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noGlobal", "messageId" );
} );

QUnit.test( "THIS (always + no-global + node/commonjs): outer arrow, this", function test(assert){
	var code = `
		var x = y => this.foo(y);
	`;

	var results = eslinter.verify( code, linterOptions.thisAlwaysNoGlobalNodeCommonJS );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noGlobal", "messageId" );
} );


// **********************************************


QUnit.test( "THIS (nested): one arrow, this", function test(assert){
	var code = `
		var x = y => this.foo(y);
	`;

	var results = eslinter.verify( code, linterOptions.thisNested );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS (nested): two nested arrows, both this", function test(assert){
	var code = `
		var x = y => this.foo(z => this.bar(z));
	`;

	var results = eslinter.verify( code, linterOptions.thisNested );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS (nested): one arrow with param arrow, both this", function test(assert){
	var code = `
		var x = (y = z => this.foo(z)) => this.bar(w);
	`;

	var results = eslinter.verify( code, linterOptions.thisNested );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS (nested): two separate arrows, both this", function test(assert){
	var code = `
		var x = y => this.foo(y);
		var z = w => this.bar(w);
	`;

	var results = eslinter.verify( code, linterOptions.thisNested );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS (nested): simple arrow, no this", function test(assert){
	var code = `
		var x = y => y;
	`;

	var results = eslinter.verify( code, linterOptions.thisNested );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS (nested): two separate arrows, no this", function test(assert){
	var code = `
		var x = y => foo(y);
		var z = w => bar(w);
	`;

	var results = eslinter.verify( code, linterOptions.thisNested );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
	] = results || [];

	assert.expect( 5 );
	assert.strictEqual( results.length, 2, "only 2 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/this", "ruleId1" );
	assert.strictEqual( messageId1, "noThisNested", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/this", "ruleId2" );
	assert.strictEqual( messageId2, "noThisNested", "messageId2" );
} );

QUnit.test( "THIS (nested): two nested arrows, one this nested", function test(assert){
	var code = `
		var x = y => z => this.foo(z);
	`;

	var results = eslinter.verify( code, linterOptions.thisNested );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS (nested): two nested arrows, one this not-nested", function test(assert){
	var code = `
		var x = y => this.foo(z => z);
	`;

	var results = eslinter.verify( code, linterOptions.thisNested );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS (nested): two nested arrows, no this", function test(assert){
	var code = `
		var x = y => z => z;
	`;

	var results = eslinter.verify( code, linterOptions.thisNested );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
	] = results || [];

	assert.expect( 5 );
	assert.strictEqual( results.length, 2, "only 2 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/this", "ruleId1" );
	assert.strictEqual( messageId1, "noThisNested", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/this", "ruleId2" );
	assert.strictEqual( messageId2, "noThisNested", "messageId2" );
} );

QUnit.test( "THIS (nested): one arrow with param arrow, nested this", function test(assert){
	var code = `
		var x = (y = z => foo(z)) => this.bar(w);
	`;

	var results = eslinter.verify( code, linterOptions.thisNested );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS (nested): one arrow with param arrow, param this", function test(assert){
	var code = `
		var x = (y = z => this.foo(z)) => bar(w);
	`;

	var results = eslinter.verify( code, linterOptions.thisNested );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS (nested): two arrows with non-arrow between, both this", function test(assert){
	var code = `
		var x = y => this.foo(function(){ return z => this.bar(z); });
	`;

	var results = eslinter.verify( code, linterOptions.thisNested );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS (nested): two arrows with non-arrow between, nested this", function test(assert){
	var code = `
		var x = y => foo(function(){ return z => this.bar(z); });
	`;

	var results = eslinter.verify( code, linterOptions.thisNested );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS (nested): two arrows with method between, nested this", function test(assert){
	var code = `
		var x = y => foo({ method(){ return z => this.bar(z); } });
	`;

	var results = eslinter.verify( code, linterOptions.thisNested );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS (nested): two arrows with getter between, nested this", function test(assert){
	var code = `
		var x = y => foo({ get baz(){ return z => this.bar(z); } });
	`;

	var results = eslinter.verify( code, linterOptions.thisNested );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS (nested): two arrows with setter between, nested this", function test(assert){
	var code = `
		var x = y => foo({ set baz(v){ return z => this.bar(z); } });
	`;

	var results = eslinter.verify( code, linterOptions.thisNested );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS (nested): one arrow and non-arrow with arrow param, param this", function test(assert){
	var code = `
		var x = y => foo(function(z = w => this.bar(w)){ return bar(z); });
	`;

	var results = eslinter.verify( code, linterOptions.thisNested );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS (nested): two arrows with non-arrow between, not-nested this", function test(assert){
	var code = `
		var x = y => this.foo(function(){ return z => bar(z); });
	`;

	var results = eslinter.verify( code, linterOptions.thisNested );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS (nested): two arrows with non-arrow between, no this", function test(assert){
	var code = `
		var x = y => foo(function(){ return z => bar(z); });
	`;

	var results = eslinter.verify( code, linterOptions.thisNested );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
	] = results || [];

	assert.expect( 5 );
	assert.strictEqual( results.length, 2, "only 2 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/this", "ruleId1" );
	assert.strictEqual( messageId1, "noThisNested", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/this", "ruleId2" );
	assert.strictEqual( messageId2, "noThisNested", "messageId2" );
} );

QUnit.test( "THIS (nested): one arrow and one non-arrow, both this", function test(assert){
	var code = `
		var x = y => this.foo(function(){ return this.bar(z); });
	`;

	var results = eslinter.verify( code, linterOptions.thisNested );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS (nested): one arrow and one non-arrow, nested this", function test(assert){
	var code = `
		var x = y => foo(function(){ return this.bar(z); });
	`;

	var results = eslinter.verify( code, linterOptions.thisNested );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );


// **********************************************


QUnit.test( "THIS (nested + no-global): outer arrow, this", function test(assert){
	var code = `
		var x = y => z => this.foo(z);
	`;

	var results = eslinter.verify( code, linterOptions.thisNestedNoGlobal );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noGlobal", "messageId" );
} );

QUnit.test( "THIS (nested + no-global): property arrow, this", function test(assert){
	var code = `
		var o = { x: y => z => this.foo(z) };
	`;

	var results = eslinter.verify( code, linterOptions.thisNestedNoGlobal );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noGlobal", "messageId" );
} );


// **********************************************


QUnit.test( "THIS (default: nested): one arrow, this", function test(assert){
	var code = `
		var x = y => this.foo(y);
	`;

	var results = eslinter.verify( code, linterOptions.thisDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS (default: nested): two nested arrows, both this", function test(assert){
	var code = `
		var x = y => this.foo(z => this.bar(z));
	`;

	var results = eslinter.verify( code, linterOptions.thisDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS (default: nested): one arrow with param arrow, both this", function test(assert){
	var code = `
		var x = (y = z => this.foo(z)) => this.bar(w);
	`;

	var results = eslinter.verify( code, linterOptions.thisDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS (default: nested): two separate arrows, both this", function test(assert){
	var code = `
		var x = y => this.foo(y);
		var z = w => this.bar(w);
	`;

	var results = eslinter.verify( code, linterOptions.thisDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS (default: nested): simple arrow, no this", function test(assert){
	var code = `
		var x = y => y + 1;
	`;

	var results = eslinter.verify( code, linterOptions.thisDefault );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS (default: nested): two separate arrows, no this", function test(assert){
	var code = `
		var x = y => foo(y);
		var z = w => bar(w);
	`;

	var results = eslinter.verify( code, linterOptions.thisDefault );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
	] = results || [];

	assert.expect( 5 );
	assert.strictEqual( results.length, 2, "only 2 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/this", "ruleId1" );
	assert.strictEqual( messageId1, "noThisNested", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/this", "ruleId2" );
	assert.strictEqual( messageId2, "noThisNested", "messageId2" );
} );

QUnit.test( "THIS (default: nested): two nested arrows, one this nested", function test(assert){
	var code = `
		var x = y => z => this.foo(z);
	`;

	var results = eslinter.verify( code, linterOptions.thisDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS (default: nested): two nested arrows, one this not-nested", function test(assert){
	var code = `
		var x = y => this.foo(z => z + 1);
	`;

	var results = eslinter.verify( code, linterOptions.thisDefault );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS (default: nested): two nested arrows, no this", function test(assert){
	var code = `
		var x = y => z => z + 1;
	`;

	var results = eslinter.verify( code, linterOptions.thisDefault );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
	] = results || [];

	assert.expect( 5 );
	assert.strictEqual( results.length, 2, "only 2 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/this", "ruleId1" );
	assert.strictEqual( messageId1, "noThisNested", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/this", "ruleId2" );
	assert.strictEqual( messageId2, "noThisNested", "messageId2" );
} );

QUnit.test( "THIS (default: nested): one arrow with param arrow, nested this", function test(assert){
	var code = `
		var x = (y = z => foo(z)) => this.bar(w);
	`;

	var results = eslinter.verify( code, linterOptions.thisDefault );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS (default: nested): one arrow with param arrow, param this", function test(assert){
	var code = `
		var x = (y = z => this.foo(z)) => bar(w);
	`;

	var results = eslinter.verify( code, linterOptions.thisDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS (default: nested): two arrows with non-arrow between, both this", function test(assert){
	var code = `
		var x = y => this.foo(function(){ return z => this.bar(z); });
	`;

	var results = eslinter.verify( code, linterOptions.thisDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS (default: nested): two arrows with non-arrow between, nested this", function test(assert){
	var code = `
		var x = y => foo(function(){ return z => this.bar(z); });
	`;

	var results = eslinter.verify( code, linterOptions.thisDefault );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS (default: nested): two arrows with method between, nested this", function test(assert){
	var code = `
		var x = y => foo({ method(){ return z => this.bar(z); } });
	`;

	var results = eslinter.verify( code, linterOptions.thisDefault );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS (default: nested): two arrows with getter between, nested this", function test(assert){
	var code = `
		var x = y => foo({ get baz(){ return z => this.bar(z); } });
	`;

	var results = eslinter.verify( code, linterOptions.thisDefault );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS (default: nested): two arrows with setter between, nested this", function test(assert){
	var code = `
		var x = y => foo({ set baz(v){ return z => this.bar(z); } });
	`;

	var results = eslinter.verify( code, linterOptions.thisDefault );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS (default: nested): one arrow and non-arrow with arrow param, param this", function test(assert){
	var code = `
		var x = y => foo(function(z = w => this.bar(w)){ return bar(z); });
	`;

	var results = eslinter.verify( code, linterOptions.thisDefault );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS (default: nested): two arrows with non-arrow between, not-nested this", function test(assert){
	var code = `
		var x = y => this.foo(function(){ return z => bar(z); });
	`;

	var results = eslinter.verify( code, linterOptions.thisDefault );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS (default: nested): two arrows with non-arrow between, no this", function test(assert){
	var code = `
		var x = y => foo(function(){ return z => bar(z); });
	`;

	var results = eslinter.verify( code, linterOptions.thisDefault );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
	] = results || [];

	assert.expect( 5 );
	assert.strictEqual( results.length, 2, "only 2 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/this", "ruleId1" );
	assert.strictEqual( messageId1, "noThisNested", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/this", "ruleId2" );
	assert.strictEqual( messageId2, "noThisNested", "messageId2" );
} );

QUnit.test( "THIS (default: nested): one arrow and one non-arrow, both this", function test(assert){
	var code = `
		var x = y => this.foo(function(){ return this.bar(z); });
	`;

	var results = eslinter.verify( code, linterOptions.thisDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS (default: nested): one arrow and one non-arrow, nested this", function test(assert){
	var code = `
		var x = y => foo(function(){ return this.bar(z); });
	`;

	var results = eslinter.verify( code, linterOptions.thisDefault );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );


// **********************************************


QUnit.test( "THIS (never): one arrow, this", function test(assert){
	var code = `
		var x = y => this.foo(y);
	`;

	var results = eslinter.verify( code, linterOptions.thisNever );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "neverThis", "messageId" );
} );

QUnit.test( "THIS (never): two nested arrows, both this", function test(assert){
	var code = `
		var x = y => this.foo(z => this.bar(z));
	`;

	var results = eslinter.verify( code, linterOptions.thisNever );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
	] = results || [];

	assert.expect( 5 );
	assert.strictEqual( results.length, 2, "only 2 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/this", "ruleId1" );
	assert.strictEqual( messageId1, "neverThis", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/this", "ruleId2" );
	assert.strictEqual( messageId2, "neverThis", "messageId2" );
} );

QUnit.test( "THIS (never): one arrow with param arrow, both this", function test(assert){
	var code = `
		var x = (y = z => this.foo(z)) => this.bar(w);
	`;

	var results = eslinter.verify( code, linterOptions.thisNever );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
	] = results || [];

	assert.expect( 5 );
	assert.strictEqual( results.length, 2, "only 2 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/this", "ruleId1" );
	assert.strictEqual( messageId1, "neverThis", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/this", "ruleId2" );
	assert.strictEqual( messageId2, "neverThis", "messageId2" );
} );

QUnit.test( "THIS (never): two separate arrows, both this", function test(assert){
	var code = `
		var x = y => this.foo(y);
		var z = w => this.bar(w);
	`;

	var results = eslinter.verify( code, linterOptions.thisNever );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
	] = results || [];

	assert.expect( 5 );
	assert.strictEqual( results.length, 2, "only 2 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/this", "ruleId1" );
	assert.strictEqual( messageId1, "neverThis", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/this", "ruleId2" );
	assert.strictEqual( messageId2, "neverThis", "messageId2" );
} );

QUnit.test( "THIS (never): simple arrow, no this", function test(assert){
	var code = `
		var x = y => y;
	`;

	var results = eslinter.verify( code, linterOptions.thisNever );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS (never): two separate arrows, no this", function test(assert){
	var code = `
		var x = y => foo(y);
		var z = w => bar(w);
	`;

	var results = eslinter.verify( code, linterOptions.thisNever );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS (never): two separate arrows, one this", function test(assert){
	var code = `
		var x = y => this.foo(y);
		var z = w => bar(w);
	`;

	var results = eslinter.verify( code, linterOptions.thisNever );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "neverThis", "messageId" );
} );

QUnit.test( "THIS (never): two nested arrows, one this nested", function test(assert){
	var code = `
		var x = y => foo(z => this.bar(z));
	`;

	var results = eslinter.verify( code, linterOptions.thisNever );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "neverThis", "messageId" );
} );

QUnit.test( "THIS (never): two nested arrows, one this not-nested", function test(assert){
	var code = `
		var x = y => this.foo(z => z);
	`;

	var results = eslinter.verify( code, linterOptions.thisNever );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "neverThis", "messageId" );
} );

QUnit.test( "THIS (never): two nested arrows, no this", function test(assert){
	var code = `
		var x = y => z => z;
	`;

	var results = eslinter.verify( code, linterOptions.thisNever );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS (never): one arrow with param arrow, param this", function test(assert){
	var code = `
		var x = (y = z => this.foo(z)) => bar(w);
	`;

	var results = eslinter.verify( code, linterOptions.thisNever );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "neverThis", "messageId" );
} );

QUnit.test( "THIS (never): one arrow and one non-arrow, both this", function test(assert){
	var code = `
		var x = y => this.foo(function(){ return this.bar(z); });
	`;

	var results = eslinter.verify( code, linterOptions.thisNever );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "neverThis", "messageId" );
} );

QUnit.test( "THIS (never): one arrow and one non-arrow, nested this", function test(assert){
	var code = `
		var x = y => foo(function(){ return this.bar(z); });
	`;

	var results = eslinter.verify( code, linterOptions.thisNever );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );
