"use strict";

QUnit.test( "THIS: one arrow, this (always)", function test(assert){
	var code = `
		var x = y => this.foo(y);
	`;

	var results = eslinter.verify( code, thisAlwaysOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS: two nested arrows, both this (always)", function test(assert){
	var code = `
		var x = y => this.foo(z => this.bar(z));
	`;

	var results = eslinter.verify( code, thisAlwaysOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS: one arrow with param arrow, both this (always)", function test(assert){
	var code = `
		var x = (y = z => this.foo(z)) => this.bar(w);
	`;

	var results = eslinter.verify( code, thisAlwaysOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS: two separate arrows, both this (always)", function test(assert){
	var code = `
		var x = y => this.foo(y);
		var z = w => this.bar(w);
	`;

	var results = eslinter.verify( code, thisAlwaysOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS: simple arrow, no this (always)", function test(assert){
	var code = `
		var x = y => y;
	`;

	var results = eslinter.verify( code, thisAlwaysOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThis", "messageId" );
} );

QUnit.test( "THIS: two separate arrows, no this (always)", function test(assert){
	var code = `
		var x = y => foo(y);
		var z = w => bar(w);
	`;

	var results = eslinter.verify( code, thisAlwaysOptions );
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

QUnit.test( "THIS: two nested arrows, one this nested (always)", function test(assert){
	var code = `
		var x = y => z => this.foo(z);
	`;

	var results = eslinter.verify( code, thisAlwaysOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThis", "messageId" );
} );

QUnit.test( "THIS: two nested arrows, one this not-nested (always)", function test(assert){
	var code = `
		var x = y => this.foo(z => z);
	`;

	var results = eslinter.verify( code, thisAlwaysOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThis", "messageId" );
} );

QUnit.test( "THIS: two nested arrows, no this (always)", function test(assert){
	var code = `
		var x = y => z => z;
	`;

	var results = eslinter.verify( code, thisAlwaysOptions );
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

QUnit.test( "THIS: one arrow with param arrow, nested this (always)", function test(assert){
	var code = `
		var x = (y = z => foo(z)) => this.bar(w);
	`;

	var results = eslinter.verify( code, thisAlwaysOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThis", "messageId" );
} );

QUnit.test( "THIS: one arrow with param arrow, param this (always)", function test(assert){
	var code = `
		var x = (y = z => this.foo(z)) => bar(w);
	`;

	var results = eslinter.verify( code, thisAlwaysOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThis", "messageId" );
} );

QUnit.test( "THIS: one non-arrow and one arrow, nested this (always)", function test(assert){
	var code = `
		var x = function(){ return y => this.foo(y); };
	`;

	var results = eslinter.verify( code, thisAlwaysOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );


// **********************************************


QUnit.test( "THIS: inner arrow, this (always + no-global)", function test(assert){
	var code = `
		function x() { return y => this.foo(y); }
	`;

	var results = eslinter.verify( code, thisAlwaysNoGlobalOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS: parameter arrow, this (always + no-global)", function test(assert){
	var code = `
		function x(z = y => this.foo(y)) { }
	`;

	var results = eslinter.verify( code, thisAlwaysNoGlobalOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS: outer arrow, this (always + no-global)", function test(assert){
	var code = `
		var x = y => this.foo(y);
	`;

	var results = eslinter.verify( code, thisAlwaysNoGlobalOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noGlobal", "messageId" );
} );

QUnit.test( "THIS: property arrow, this (always + no-global)", function test(assert){
	var code = `
		var o = { x: y => this.foo(y) };
	`;

	var results = eslinter.verify( code, thisAlwaysNoGlobalOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noGlobal", "messageId" );
} );


// **********************************************


QUnit.test( "THIS: one arrow, this (nested)", function test(assert){
	var code = `
		var x = y => this.foo(y);
	`;

	var results = eslinter.verify( code, thisNestedOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS: two nested arrows, both this (nested)", function test(assert){
	var code = `
		var x = y => this.foo(z => this.bar(z));
	`;

	var results = eslinter.verify( code, thisNestedOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS: one arrow with param arrow, both this (nested)", function test(assert){
	var code = `
		var x = (y = z => this.foo(z)) => this.bar(w);
	`;

	var results = eslinter.verify( code, thisNestedOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS: two separate arrows, both this (nested)", function test(assert){
	var code = `
		var x = y => this.foo(y);
		var z = w => this.bar(w);
	`;

	var results = eslinter.verify( code, thisNestedOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS: simple arrow, no this (nested)", function test(assert){
	var code = `
		var x = y => y;
	`;

	var results = eslinter.verify( code, thisNestedOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS: two separate arrows, no this (nested)", function test(assert){
	var code = `
		var x = y => foo(y);
		var z = w => bar(w);
	`;

	var results = eslinter.verify( code, thisNestedOptions );
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

QUnit.test( "THIS: two nested arrows, one this nested (nested)", function test(assert){
	var code = `
		var x = y => z => this.foo(z);
	`;

	var results = eslinter.verify( code, thisNestedOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS: two nested arrows, one this not-nested (nested)", function test(assert){
	var code = `
		var x = y => this.foo(z => z);
	`;

	var results = eslinter.verify( code, thisNestedOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS: two nested arrows, no this (nested)", function test(assert){
	var code = `
		var x = y => z => z;
	`;

	var results = eslinter.verify( code, thisNestedOptions );
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

QUnit.test( "THIS: one arrow with param arrow, nested this (nested)", function test(assert){
	var code = `
		var x = (y = z => foo(z)) => this.bar(w);
	`;

	var results = eslinter.verify( code, thisNestedOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS: one arrow with param arrow, param this (nested)", function test(assert){
	var code = `
		var x = (y = z => this.foo(z)) => bar(w);
	`;

	var results = eslinter.verify( code, thisNestedOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS: two arrows with non-arrow between, both this (nested)", function test(assert){
	var code = `
		var x = y => this.foo(function(){ return z => this.bar(z); });
	`;

	var results = eslinter.verify( code, thisNestedOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS: two arrows with non-arrow between, nested this (nested)", function test(assert){
	var code = `
		var x = y => foo(function(){ return z => this.bar(z); });
	`;

	var results = eslinter.verify( code, thisNestedOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS: two arrows with method between, nested this (nested)", function test(assert){
	var code = `
		var x = y => foo({ method(){ return z => this.bar(z); } });
	`;

	var results = eslinter.verify( code, thisNestedOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS: two arrows with getter between, nested this (nested)", function test(assert){
	var code = `
		var x = y => foo({ get baz(){ return z => this.bar(z); } });
	`;

	var results = eslinter.verify( code, thisNestedOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS: two arrows with setter between, nested this (nested)", function test(assert){
	var code = `
		var x = y => foo({ set baz(v){ return z => this.bar(z); } });
	`;

	var results = eslinter.verify( code, thisNestedOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS: one arrow and non-arrow with arrow param, param this (nested)", function test(assert){
	var code = `
		var x = y => foo(function(z = w => this.bar(w)){ return bar(z); });
	`;

	var results = eslinter.verify( code, thisNestedOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS: two arrows with non-arrow between, not-nested this (nested)", function test(assert){
	var code = `
		var x = y => this.foo(function(){ return z => bar(z); });
	`;

	var results = eslinter.verify( code, thisNestedOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS: two arrows with non-arrow between, no this (nested)", function test(assert){
	var code = `
		var x = y => foo(function(){ return z => bar(z); });
	`;

	var results = eslinter.verify( code, thisNestedOptions );
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

QUnit.test( "THIS: one arrow and one non-arrow, both this (nested)", function test(assert){
	var code = `
		var x = y => this.foo(function(){ return this.bar(z); });
	`;

	var results = eslinter.verify( code, thisNestedOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS: one arrow and one non-arrow, nested this (nested)", function test(assert){
	var code = `
		var x = y => foo(function(){ return this.bar(z); });
	`;

	var results = eslinter.verify( code, thisNestedOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );


// **********************************************


QUnit.test( "THIS: outer arrow, this (nested + no-global)", function test(assert){
	var code = `
		var x = y => z => this.foo(z);
	`;

	var results = eslinter.verify( code, thisNestedNoGlobalOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noGlobal", "messageId" );
} );

QUnit.test( "THIS: property arrow, this (nested + no-global)", function test(assert){
	var code = `
		var o = { x: y => z => this.foo(z) };
	`;

	var results = eslinter.verify( code, thisNestedNoGlobalOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noGlobal", "messageId" );
} );


// **********************************************


QUnit.test( "THIS: one arrow, this (default: nested)", function test(assert){
	var code = `
		var x = y => this.foo(y);
	`;

	var results = eslinter.verify( code, thisDefaultOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS: two nested arrows, both this (default: nested)", function test(assert){
	var code = `
		var x = y => this.foo(z => this.bar(z));
	`;

	var results = eslinter.verify( code, thisDefaultOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS: one arrow with param arrow, both this (default: nested)", function test(assert){
	var code = `
		var x = (y = z => this.foo(z)) => this.bar(w);
	`;

	var results = eslinter.verify( code, thisDefaultOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS: two separate arrows, both this (default: nested)", function test(assert){
	var code = `
		var x = y => this.foo(y);
		var z = w => this.bar(w);
	`;

	var results = eslinter.verify( code, thisDefaultOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS: simple arrow, no this (default: nested)", function test(assert){
	var code = `
		var x = y => y;
	`;

	var results = eslinter.verify( code, thisDefaultOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS: two separate arrows, no this (default: nested)", function test(assert){
	var code = `
		var x = y => foo(y);
		var z = w => bar(w);
	`;

	var results = eslinter.verify( code, thisDefaultOptions );
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

QUnit.test( "THIS: two nested arrows, one this nested (default: nested)", function test(assert){
	var code = `
		var x = y => z => this.foo(z);
	`;

	var results = eslinter.verify( code, thisDefaultOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS: two nested arrows, one this not-nested (default: nested)", function test(assert){
	var code = `
		var x = y => this.foo(z => z);
	`;

	var results = eslinter.verify( code, thisDefaultOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS: two nested arrows, no this (default: nested)", function test(assert){
	var code = `
		var x = y => z => z;
	`;

	var results = eslinter.verify( code, thisDefaultOptions );
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

QUnit.test( "THIS: one arrow with param arrow, nested this (default: nested)", function test(assert){
	var code = `
		var x = (y = z => foo(z)) => this.bar(w);
	`;

	var results = eslinter.verify( code, thisDefaultOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS: one arrow with param arrow, param this (default: nested)", function test(assert){
	var code = `
		var x = (y = z => this.foo(z)) => bar(w);
	`;

	var results = eslinter.verify( code, thisDefaultOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS: two arrows with non-arrow between, both this (default: nested)", function test(assert){
	var code = `
		var x = y => this.foo(function(){ return z => this.bar(z); });
	`;

	var results = eslinter.verify( code, thisDefaultOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS: two arrows with non-arrow between, nested this (default: nested)", function test(assert){
	var code = `
		var x = y => foo(function(){ return z => this.bar(z); });
	`;

	var results = eslinter.verify( code, thisDefaultOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS: two arrows with method between, nested this (default: nested)", function test(assert){
	var code = `
		var x = y => foo({ method(){ return z => this.bar(z); } });
	`;

	var results = eslinter.verify( code, thisDefaultOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS: two arrows with getter between, nested this (default: nested)", function test(assert){
	var code = `
		var x = y => foo({ get baz(){ return z => this.bar(z); } });
	`;

	var results = eslinter.verify( code, thisDefaultOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS: two arrows with setter between, nested this (default: nested)", function test(assert){
	var code = `
		var x = y => foo({ set baz(v){ return z => this.bar(z); } });
	`;

	var results = eslinter.verify( code, thisDefaultOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS: one arrow and non-arrow with arrow param, param this (default: nested)", function test(assert){
	var code = `
		var x = y => foo(function(z = w => this.bar(w)){ return bar(z); });
	`;

	var results = eslinter.verify( code, thisDefaultOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS: two arrows with non-arrow between, not-nested this (default: nested)", function test(assert){
	var code = `
		var x = y => this.foo(function(){ return z => bar(z); });
	`;

	var results = eslinter.verify( code, thisDefaultOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );

QUnit.test( "THIS: two arrows with non-arrow between, no this (default: nested)", function test(assert){
	var code = `
		var x = y => foo(function(){ return z => bar(z); });
	`;

	var results = eslinter.verify( code, thisDefaultOptions );
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

QUnit.test( "THIS: one arrow and one non-arrow, both this (default: nested)", function test(assert){
	var code = `
		var x = y => this.foo(function(){ return this.bar(z); });
	`;

	var results = eslinter.verify( code, thisDefaultOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS: one arrow and one non-arrow, nested this (default: nested)", function test(assert){
	var code = `
		var x = y => foo(function(){ return this.bar(z); });
	`;

	var results = eslinter.verify( code, thisDefaultOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "noThisNested", "messageId" );
} );


// **********************************************


QUnit.test( "THIS: one arrow, this (never)", function test(assert){
	var code = `
		var x = y => this.foo(y);
	`;

	var results = eslinter.verify( code, thisNeverOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "neverThis", "messageId" );
} );

QUnit.test( "THIS: two nested arrows, both this (never)", function test(assert){
	var code = `
		var x = y => this.foo(z => this.bar(z));
	`;

	var results = eslinter.verify( code, thisNeverOptions );
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

QUnit.test( "THIS: one arrow with param arrow, both this (never)", function test(assert){
	var code = `
		var x = (y = z => this.foo(z)) => this.bar(w);
	`;

	var results = eslinter.verify( code, thisNeverOptions );
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

QUnit.test( "THIS: two separate arrows, both this (never)", function test(assert){
	var code = `
		var x = y => this.foo(y);
		var z = w => this.bar(w);
	`;

	var results = eslinter.verify( code, thisNeverOptions );
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

QUnit.test( "THIS: simple arrow, no this (never)", function test(assert){
	var code = `
		var x = y => y;
	`;

	var results = eslinter.verify( code, thisNeverOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS: two separate arrows, no this (never)", function test(assert){
	var code = `
		var x = y => foo(y);
		var z = w => bar(w);
	`;

	var results = eslinter.verify( code, thisNeverOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS: two separate arrows, one this (never)", function test(assert){
	var code = `
		var x = y => this.foo(y);
		var z = w => bar(w);
	`;

	var results = eslinter.verify( code, thisNeverOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "neverThis", "messageId" );
} );

QUnit.test( "THIS: two nested arrows, one this nested (never)", function test(assert){
	var code = `
		var x = y => foo(z => this.bar(z));
	`;

	var results = eslinter.verify( code, thisNeverOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "neverThis", "messageId" );
} );

QUnit.test( "THIS: two nested arrows, one this not-nested (never)", function test(assert){
	var code = `
		var x = y => this.foo(z => z);
	`;

	var results = eslinter.verify( code, thisNeverOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "neverThis", "messageId" );
} );

QUnit.test( "THIS: two nested arrows, no this (never)", function test(assert){
	var code = `
		var x = y => z => z;
	`;

	var results = eslinter.verify( code, thisNeverOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "THIS: one arrow with param arrow, param this (never)", function test(assert){
	var code = `
		var x = (y = z => this.foo(z)) => bar(w);
	`;

	var results = eslinter.verify( code, thisNeverOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "neverThis", "messageId" );
} );

QUnit.test( "THIS: one arrow and one non-arrow, both this (never)", function test(assert){
	var code = `
		var x = y => this.foo(function(){ return this.bar(z); });
	`;

	var results = eslinter.verify( code, thisNeverOptions );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/this", "ruleId" );
	assert.strictEqual( messageId, "neverThis", "messageId" );
} );

QUnit.test( "THIS: one arrow and one non-arrow, nested this (never)", function test(assert){
	var code = `
		var x = y => foo(function(){ return this.bar(z); });
	`;

	var results = eslinter.verify( code, thisNeverOptions );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );
