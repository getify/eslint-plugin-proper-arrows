"use strict";

var linterOptions = {
	returnDefault: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/return": "error", },
	},
	returnObjectDefault: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/return": ["error",{ternary:1000,chained:false,sequence:false,trivial:true,},], },
	},
	returnObject: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/return": ["error",{object:true,ternary:1000,chained:false,sequence:false,trivial:true,},], },
	},
	returnTernaryDefault: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/return": ["error",{object:false,chained:false,sequence:false,trivial:true,},], },
	},
	returnTernary1: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/return": ["error",{object:false,ternary:1,chained:false,sequence:false,trivial:true,},], },
	},
	returnTernary2: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/return": ["error",{object:false,ternary:2,chained:false,sequence:false,trivial:true,},], },
	},
	returnChainedDefault: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/return": ["error",{object:false,ternary:1000,sequence:false,trivial:true,},], },
	},
	returnChained: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/return": ["error",{object:false,ternary:1000,chained:true,sequence:false,trivial:true,},], },
	},
	returnSequenceDefault: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/return": ["error",{object:false,ternary:1000,chained:false,trivial:true,},], },
	},
	returnSequence: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/return": ["error",{object:false,ternary:1000,chained:false,sequence:true,trivial:true,},], },
	},
};

QUnit.test( "RETURN (default): conforming", function test(assert){
	var code = `
		var x = y => { return { y }; };
		var f = a => { return (1,a,2); };
		var g = r => (k => r + k);
	`;

	var results = eslinter.verify( code, linterOptions.returnDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "RETURN (default): violating", function test(assert){
	var code = `
		var x = y => z => ({ y, z });
		var f = a => (1,a,2);
	`;

	var results = eslinter.verify( code, linterOptions.returnDefault );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
		{ ruleId: ruleId3, messageId: messageId3, } = {},
	] = results || [];

	assert.expect( 7 );
	assert.strictEqual( results.length, 3, "only 3 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/return", "ruleId1" );
	assert.strictEqual( messageId1, "noChainedArrow", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/return", "ruleId2" );
	assert.strictEqual( messageId2, "noConciseObject", "messageId2" );
	assert.strictEqual( ruleId3, "@getify/proper-arrows/return", "ruleId3" );
	assert.strictEqual( messageId3, "noSequence", "messageId3" );
} );

QUnit.test( "RETURN (object, default): conforming", function test(assert){
	var code = `
		var x = y => { return { y }; };
	`;

	var results = eslinter.verify( code, linterOptions.returnObjectDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "RETURN (object, default): violating", function test(assert){
	var code = `
		var x = y => ({ y });
	`;

	var results = eslinter.verify( code, linterOptions.returnObjectDefault );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/return", "ruleId" );
	assert.strictEqual( messageId, "noConciseObject", "messageId" );
} );

QUnit.test( "RETURN (ternary, default): conforming", function test(assert){
	var code = `
		var x = (y = a ? a : 1) => { return x ? x : y; };
		var w = g ? g : 1;
	`;

	var results = eslinter.verify( code, linterOptions.returnTernaryDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "RETURN (ternary, default): violating", function test(assert){
	var code = `
		var x = y => x ? x : y;
	`;

	var results = eslinter.verify( code, linterOptions.returnTernaryDefault );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/return", "ruleId" );
	assert.strictEqual( messageId, "noTernary", "messageId" );
} );

QUnit.test( "RETURN (ternary:1): conforming", function test(assert){
	var code = `
		var x = y => x ? x : y;
	`;

	var results = eslinter.verify( code, linterOptions.returnTernary1 );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "RETURN (ternary:1): violating", function test(assert){
	var code = `
		var x = y => x ? x : y ? y : 42;
	`;

	var results = eslinter.verify( code, linterOptions.returnTernary1 );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/return", "ruleId" );
	assert.strictEqual( messageId, "noTernary", "messageId" );
} );

QUnit.test( "RETURN (ternary:2): conforming", function test(assert){
	var code = `
		var x = y => x ? x : y ? y : 42;
	`;

	var results = eslinter.verify( code, linterOptions.returnTernary2 );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "RETURN (ternary:2): violating", function test(assert){
	var code = `
		var x = y => x ? x : y ? z ? z : 42 : null;
	`;

	var results = eslinter.verify( code, linterOptions.returnTernary2 );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/return", "ruleId" );
	assert.strictEqual( messageId, "noTernary", "messageId" );
} );

QUnit.test( "RETURN (object): conforming", function test(assert){
	var code = `
		var x = y => { return { y }; };
	`;

	var results = eslinter.verify( code, linterOptions.returnObject );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "RETURN (object): violating", function test(assert){
	var code = `
		var x = y => ({ y });
	`;

	var results = eslinter.verify( code, linterOptions.returnObject );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/return", "ruleId" );
	assert.strictEqual( messageId, "noConciseObject", "messageId" );
} );

QUnit.test( "RETURN (chained, default): conforming", function test(assert){
	var code = `
		var f;
		f = x => (y => x + y);
		f = x => { return y => x + y; };
		f = x => (y => ({x,y}));
		f = x => ((y) => ({x,y}));
		f = x => (y => (z => x + y + z));
	`;

	var results = eslinter.verify( code, linterOptions.returnChained );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "RETURN (chained, default): violating", function test(assert){
	var code = `
		var f;
		f = x => y => x + y;
		f = x => y => ({x,y});
		f = x => (y) => ({x,y});
		f = x => (y) => (y);
		f = x => y => (z => x + y + z);
		f = x => y => z => x + y + z;
	`;

	var results = eslinter.verify( code, linterOptions.returnChained );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
		{ ruleId: ruleId3, messageId: messageId3, } = {},
		{ ruleId: ruleId4, messageId: messageId4, } = {},
		{ ruleId: ruleId5, messageId: messageId5, } = {},
		{ ruleId: ruleId6, messageId: messageId6, } = {},
		{ ruleId: ruleId7, messageId: messageId7, } = {},
	] = results || [];

	assert.expect( 15 );
	assert.strictEqual( results.length, 7, "only 7 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/return", "ruleId1" );
	assert.strictEqual( messageId1, "noChainedArrow", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/return", "ruleId2" );
	assert.strictEqual( messageId2, "noChainedArrow", "messageId2" );
	assert.strictEqual( ruleId3, "@getify/proper-arrows/return", "ruleId3" );
	assert.strictEqual( messageId3, "noChainedArrow", "messageId3" );
	assert.strictEqual( ruleId4, "@getify/proper-arrows/return", "ruleId4" );
	assert.strictEqual( messageId4, "noChainedArrow", "messageId4" );
	assert.strictEqual( ruleId5, "@getify/proper-arrows/return", "ruleId5" );
	assert.strictEqual( messageId5, "noChainedArrow", "messageId5" );
	assert.strictEqual( ruleId6, "@getify/proper-arrows/return", "ruleId6" );
	assert.strictEqual( messageId6, "noChainedArrow", "messageId6" );
	assert.strictEqual( ruleId7, "@getify/proper-arrows/return", "ruleId7" );
	assert.strictEqual( messageId7, "noChainedArrow", "messageId7" );
} );

QUnit.test( "RETURN (sequence, default): conforming", function test(assert){
	var code = `
		var x = y => { return (1,y,2); };
	`;

	var results = eslinter.verify( code, linterOptions.returnSequenceDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "RETURN (sequence, default): violating", function test(assert){
	var code = `
		var x = y => (1,y,2);
	`;

	var results = eslinter.verify( code, linterOptions.returnSequenceDefault );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/return", "ruleId" );
	assert.strictEqual( messageId, "noSequence", "messageId" );
} );

QUnit.test( "RETURN (sequence): conforming", function test(assert){
	var code = `
		var x = y => { return (1,y,2); };
	`;

	var results = eslinter.verify( code, linterOptions.returnSequence );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "RETURN (sequence): violating", function test(assert){
	var code = `
		var x = y => (1,y,2);
	`;

	var results = eslinter.verify( code, linterOptions.returnSequence );
	var [{ ruleId, messageId, } = {},] = results || [];

	assert.expect( 3 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/return", "ruleId" );
	assert.strictEqual( messageId, "noSequence", "messageId" );
} );
