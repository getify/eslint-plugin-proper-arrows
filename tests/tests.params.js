"use strict";

var linterOptions = {
	paramsDefault: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/params": "error", },
	},
	paramsUnusedAllDefault: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/params": ["error",{count: 1000,length:0,trivial:true,},], },
	},
	paramsUnusedAll: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/params": ["error",{unused:"all",count:1000,length:0,trivial:true,},], },
	},
	paramsUnusedTrailing: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/params": ["error",{unused:"trailing",count:1000,length:0,trivial:true,},], },
	},
	paramsUnusedNone: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/params": ["error",{unused:"none",count:1000,length:0,trivial:true,},], },
	},
	paramsCountDefault: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/params": ["error",{unused:"none",length:0,trivial:true,},], },
	},
	paramsCount0: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/params": ["error",{unused:"none",count:0,length:0,trivial:true,},], },
	},
	paramsLengthDefault: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/params": ["error",{unused:"none",count:1000,trivial:true,},], },
	},
	paramsLength1: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/params": ["error",{unused:"none",count:1000,length:1,trivial:true,},], },
	},
	paramsAllowed: {
		parserOptions: { ecmaVersion: 2015, },
		rules: { "@getify/proper-arrows/params": ["error",{allowed:[],trivial:true,},], },
	},
};

QUnit.test( "PARAMS (default): conforming", function test(assert){
	var code = `
		var f = xx => xx * 2;
		var p = ([yy,,zz]) => yy * zz;
		var r = ({ ww, G: gg }) => ww * gg;
	`;

	var results = eslinter.verify( code, linterOptions.paramsDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "PARAMS (default): violating", function test(assert){
	var code = `
		var f = (x,[y],z,{w}) => y + z;
	`;

	var results = eslinter.verify( code, linterOptions.paramsDefault );
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
	assert.strictEqual( ruleId1, "@getify/proper-arrows/params", "ruleId1" );
	assert.strictEqual( messageId1, "tooShort", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/params", "ruleId2" );
	assert.strictEqual( messageId2, "unused", "messageId2" );
	assert.strictEqual( ruleId3, "@getify/proper-arrows/params", "ruleId3" );
	assert.strictEqual( messageId3, "tooShort", "messageId3" );
	assert.strictEqual( ruleId4, "@getify/proper-arrows/params", "ruleId4" );
	assert.strictEqual( messageId4, "tooShort", "messageId4" );
	assert.strictEqual( ruleId5, "@getify/proper-arrows/params", "ruleId5" );
	assert.strictEqual( messageId5, "tooMany", "messageId5" );
	assert.strictEqual( ruleId6, "@getify/proper-arrows/params", "ruleId6" );
	assert.strictEqual( messageId6, "tooShort", "messageId6" );
	assert.strictEqual( ruleId7, "@getify/proper-arrows/params", "ruleId7" );
	assert.strictEqual( messageId7, "unused", "messageId7" );
} );

QUnit.test( "PARAMS (unused: all, default): conforming", function test(assert){
	var code = `
		var f = (x,y,z,w) => x + y + z + w;
		var p = x => y => z => w => x + y + z + w;
	`;

	var results = eslinter.verify( code, linterOptions.paramsUnusedAllDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "PARAMS (unused: all, default): violating", function test(assert){
	var code = `
		var f = (x,y,z,w) => y + z;
		var p = x => y => z => w => y + z;
	`;

	var results = eslinter.verify( code, linterOptions.paramsUnusedAllDefault );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
		{ ruleId: ruleId3, messageId: messageId3, } = {},
		{ ruleId: ruleId4, messageId: messageId4, } = {},
	] = results || [];

	assert.expect( 9 );
	assert.strictEqual( results.length, 4, "only 4 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/params", "ruleId1" );
	assert.strictEqual( messageId1, "unused", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/params", "ruleId2" );
	assert.strictEqual( messageId2, "unused", "messageId2" );
	assert.strictEqual( ruleId3, "@getify/proper-arrows/params", "ruleId3" );
	assert.strictEqual( messageId3, "unused", "messageId3" );
	assert.strictEqual( ruleId4, "@getify/proper-arrows/params", "ruleId4" );
	assert.strictEqual( messageId4, "unused", "messageId4" );
} );

QUnit.test( "PARAMS (unused: all): conforming | nesting, shadowing", function test(assert){
	var code = `
		var f;
		f = (x) => x;
		f = (x) => () => x;
		f = (x) => { x; };
		f = (x, y = x) => { y; };
		f = (x, y = x) => { var x; x = y; };
		f = (x, y = x) => { var x = y; };
		f = (x, y = () => x) => { y; };
		f = (x, y = () => { x = 3; }) => { y; };
		f = (x, y = (z = x) => z) => { y; };
	`;

	var results = eslinter.verify( code, linterOptions.paramsUnusedAll );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "PARAMS (unused: all): violating | nesting, shadowing", function test(assert){
	var code = `
		var f;

		f = (x) => 3;
		f = (y = 3) => { var y; };
		f = (z = 3) => { var z = 3; };
		f = (w = 3) => { var w; w = 3; };
		f = (r) => { var r = 3; };
		f = (k, m = (k) => k) => m;
		f = (a, b = (k = 3) => { k = 3; }) => b;
		f = (s, t = () => { var s; }) => t;
		f = (d, e = () => { var d = 3; }) => e;
		f = (g, h = () => { var g; g = 3; }) => h;
	`;

	var results = eslinter.verify( code, linterOptions.paramsUnusedAll );
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
	] = results || [];

	assert.expect( 31 );
	assert.strictEqual( results.length, 10, "only 10 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/params", "ruleId1" );
	assert.strictEqual( messageId1, "unused", "messageId1" );
	assert.ok( message1.includes("`x`"), "message1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/params", "ruleId2" );
	assert.strictEqual( messageId2, "unused", "messageId2" );
	assert.ok( message2.includes("`y`"), "message2" );
	assert.strictEqual( ruleId3, "@getify/proper-arrows/params", "ruleId3" );
	assert.strictEqual( messageId3, "unused", "messageId3" );
	assert.ok( message3.includes("`z`"), "message3" );
	assert.strictEqual( ruleId4, "@getify/proper-arrows/params", "ruleId4" );
	assert.strictEqual( messageId4, "unused", "messageId4" );
	assert.ok( message4.includes("`w`"), "message4" );
	assert.strictEqual( ruleId5, "@getify/proper-arrows/params", "ruleId5" );
	assert.strictEqual( messageId5, "unused", "messageId5" );
	assert.ok( message5.includes("`r`"), "message5" );
	assert.strictEqual( ruleId6, "@getify/proper-arrows/params", "ruleId6" );
	assert.strictEqual( messageId6, "unused", "messageId6" );
	assert.ok( message6.includes("`k`"), "message6" );
	assert.strictEqual( ruleId7, "@getify/proper-arrows/params", "ruleId7" );
	assert.strictEqual( messageId7, "unused", "messageId7" );
	assert.ok( message7.includes("`a`"), "message7" );
	assert.strictEqual( ruleId8, "@getify/proper-arrows/params", "ruleId8" );
	assert.strictEqual( messageId8, "unused", "messageId8" );
	assert.ok( message8.includes("`s`"), "message8" );
	assert.strictEqual( ruleId9, "@getify/proper-arrows/params", "ruleId9" );
	assert.strictEqual( messageId9, "unused", "messageId9" );
	assert.ok( message9.includes("`d`"), "message9" );
	assert.strictEqual( ruleId10, "@getify/proper-arrows/params", "ruleId10" );
	assert.strictEqual( messageId10, "unused", "messageId10" );
	assert.ok( message10.includes("`g`"), "message10" );
} );

QUnit.test( "PARAMS (unused: trailing): conforming", function test(assert){
	var code = `
		var f = (x,y,z,w) => z + w;
	`;

	var results = eslinter.verify( code, linterOptions.paramsUnusedTrailing );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "PARAMS (unused: trailing): violating", function test(assert){
	var code = `
		var f = (x,y,z,w) => y + z;
		var p = (a,b,c,d) => a + b;
		var t = (s,t,u,v) => 1;
	`;

	var results = eslinter.verify( code, linterOptions.paramsUnusedTrailing );
	var [
		{ ruleId: ruleId1, messageId: messageId1, message: message1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, message: message2, } = {},
		{ ruleId: ruleId3, messageId: messageId3, message: message3, } = {},
		{ ruleId: ruleId4, messageId: messageId4, message: message4, } = {},
		{ ruleId: ruleId5, messageId: messageId5, message: message5, } = {},
		{ ruleId: ruleId6, messageId: messageId6, message: message6, } = {},
		{ ruleId: ruleId7, messageId: messageId7, message: message7, } = {},
	] = results || [];

	assert.expect( 21 );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/params", "ruleId1" );
	assert.strictEqual( messageId1, "unused", "messageId1" );
	assert.ok( message1.includes("`w`"), "message1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/params", "ruleId2" );
	assert.strictEqual( messageId2, "unused", "messageId2" );
	assert.ok( message2.includes("`c`"), "message2" );
	assert.strictEqual( ruleId3, "@getify/proper-arrows/params", "ruleId3" );
	assert.strictEqual( messageId3, "unused", "messageId3" );
	assert.ok( message3.includes("`d`"), "message3" );
	assert.strictEqual( ruleId4, "@getify/proper-arrows/params", "ruleId4" );
	assert.strictEqual( messageId4, "unused", "messageId4" );
	assert.ok( message4.includes("`s`"), "message4" );
	assert.strictEqual( ruleId5, "@getify/proper-arrows/params", "ruleId5" );
	assert.strictEqual( messageId5, "unused", "messageId5" );
	assert.ok( message5.includes("`t`"), "message5" );
	assert.strictEqual( ruleId6, "@getify/proper-arrows/params", "ruleId6" );
	assert.strictEqual( messageId6, "unused", "messageId6" );
	assert.ok( message6.includes("`u`"), "message6" );
	assert.strictEqual( ruleId7, "@getify/proper-arrows/params", "ruleId7" );
	assert.strictEqual( messageId7, "unused", "messageId7" );
	assert.ok( message7.includes("`v`"), "message7" );
} );

QUnit.test( "PARAMS (unused: none): violating", function test(assert){
	var code = `
		var f = (x,y,z,w) => y + z;
	`;

	var results = eslinter.verify( code, linterOptions.paramsUnusedNone );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "PARAMS (count: 3, default): conforming", function test(assert){
	var code = `
		var f = (x,y,z) => x;
	`;

	var results = eslinter.verify( code, linterOptions.paramsCountDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "PARAMS (count: 3, default): violating", function test(assert){
	var code = `
		var f = (x,y,z,w,g) => x;
	`;

	var results = eslinter.verify( code, linterOptions.paramsCountDefault );
	var [{ ruleId, messageId, message, } = {},] = results || [];

	assert.expect( 4 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/params", "ruleId" );
	assert.strictEqual( messageId, "tooMany", "messageId" );
	assert.ok( message.includes("`w`"), "message" );
} );

QUnit.test( "PARAMS (count: 0): conforming", function test(assert){
	var code = `
		var f = () => 1;
	`;

	var results = eslinter.verify( code, linterOptions.paramsCount0 );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "PARAMS (count: 0): violating", function test(assert){
	var code = `
		var f = (x,y) => x;
	`;

	var results = eslinter.verify( code, linterOptions.paramsCount0 );
	var [{ ruleId, messageId, message, } = {},] = results || [];

	assert.expect( 4 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/params", "ruleId" );
	assert.strictEqual( messageId, "tooMany", "messageId" );
	assert.ok( message.includes("`x`"), "message" );
} );

QUnit.test( "PARAMS (length: 2, default): conforming", function test(assert){
	var code = `
		var f = (xx,yy,zz) => xx;
	`;

	var results = eslinter.verify( code, linterOptions.paramsLengthDefault );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "PARAMS (length: 2, default): violating", function test(assert){
	var code = `
		var f = (xx,y,zz) => xx;
	`;

	var results = eslinter.verify( code, linterOptions.paramsLengthDefault );
	var [{ ruleId, messageId, message, } = {},] = results || [];

	assert.expect( 4 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/params", "ruleId" );
	assert.strictEqual( messageId, "tooShort", "messageId" );
	assert.ok( message.includes("`y`"), "message" );
} );

QUnit.test( "PARAMS (length: 1): conforming", function test(assert){
	var code = `
		var f = (x,y) => x;
	`;

	var results = eslinter.verify( code, linterOptions.paramsLength1 );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "PARAMS (allowed, defaults): conforming", function test(assert){
	var code = `
		var f = (x,y,z,w) => y + z;
	`;

	var config = copyObj(linterOptions.paramsAllowed);
	config.rules["@getify/proper-arrows/params"][1].allowed = ["x","y","z","w",];

	var results = eslinter.verify( code, config );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "PARAMS (allowed, defaults): violating", function test(assert){
	var code = `
		var f = (x,y,z,w) => y + z;
	`;

	var config = copyObj(linterOptions.paramsAllowed);
	config.rules["@getify/proper-arrows/params"][1].allowed = ["x","z",];

	var results = eslinter.verify( code, config );
	var [
		{ ruleId: ruleId1, messageId: messageId1, } = {},
		{ ruleId: ruleId2, messageId: messageId2, } = {},
		{ ruleId: ruleId3, messageId: messageId3, } = {},
		{ ruleId: ruleId4, messageId: messageId4, } = {},
	] = results || [];

	assert.expect( 9 );
	assert.strictEqual( results.length, 4, "only 4 errors" );
	assert.strictEqual( ruleId1, "@getify/proper-arrows/params", "ruleId1" );
	assert.strictEqual( messageId1, "tooShort", "messageId1" );
	assert.strictEqual( ruleId2, "@getify/proper-arrows/params", "ruleId2" );
	assert.strictEqual( messageId2, "tooMany", "messageId2" );
	assert.strictEqual( ruleId3, "@getify/proper-arrows/params", "ruleId3" );
	assert.strictEqual( messageId3, "tooShort", "messageId3" );
	assert.strictEqual( ruleId4, "@getify/proper-arrows/params", "ruleId4" );
	assert.strictEqual( messageId4, "unused", "messageId4" );
} );

QUnit.test( "PARAMS (allowed, unused:all): conforming", function test(assert){
	var code = `
		var f = (x,y,z,w) => y + z;
	`;

	var config = copyObj(linterOptions.paramsAllowed);
	config.rules["@getify/proper-arrows/params"][1].unused = "all";
	config.rules["@getify/proper-arrows/params"][1].count = 1000;
	config.rules["@getify/proper-arrows/params"][1].length = 1;
	config.rules["@getify/proper-arrows/params"][1].allowed = ["x","w",];

	var results = eslinter.verify( code, config );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "PARAMS (allowed, unused:all): violating", function test(assert){
	var code = `
		var f = (x,y,z,w) => y + z;
	`;

	var config = copyObj(linterOptions.paramsAllowed);
	config.rules["@getify/proper-arrows/params"][1].unused = "all";
	config.rules["@getify/proper-arrows/params"][1].count = 1000;
	config.rules["@getify/proper-arrows/params"][1].length = 1;
	config.rules["@getify/proper-arrows/params"][1].allowed = ["x",];

	var results = eslinter.verify( code, config );
	var [{ ruleId, messageId, message, } = {},] = results || [];

	assert.expect( 4 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/params", "ruleId" );
	assert.strictEqual( messageId, "unused", "messageId" );
	assert.ok( message.includes("`w`"), "message" );
} );

QUnit.test( "PARAMS (allowed, unused:trailing): conforming", function test(assert){
	var code = `
		var f = (x,y,z,w) => y + z;
	`;

	var config = copyObj(linterOptions.paramsAllowed);
	config.rules["@getify/proper-arrows/params"][1].unused = "trailing";
	config.rules["@getify/proper-arrows/params"][1].count = 1000;
	config.rules["@getify/proper-arrows/params"][1].length = 1;
	config.rules["@getify/proper-arrows/params"][1].allowed = ["w",];

	var results = eslinter.verify( code, config );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "PARAMS (allowed, unused:trailing): violating", function test(assert){
	var code = `
		var f = (x,y,z,w) => y + z;
	`;

	var config = copyObj(linterOptions.paramsAllowed);
	config.rules["@getify/proper-arrows/params"][1].unused = "trailing";
	config.rules["@getify/proper-arrows/params"][1].count = 1000;
	config.rules["@getify/proper-arrows/params"][1].length = 1;
	config.rules["@getify/proper-arrows/params"][1].allowed = ["x",];

	var results = eslinter.verify( code, config );
	var [{ ruleId, messageId, message, } = {},] = results || [];

	assert.expect( 4 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/params", "ruleId" );
	assert.strictEqual( messageId, "unused", "messageId" );
	assert.ok( message.includes("`w`"), "message" );
} );

QUnit.test( "PARAMS (allowed, count:0): conforming", function test(assert){
	var code = `
		var f = (x,y,z,w) => y + z;
	`;

	var config = copyObj(linterOptions.paramsAllowed);
	config.rules["@getify/proper-arrows/params"][1].unused = "none";
	config.rules["@getify/proper-arrows/params"][1].count = 0;
	config.rules["@getify/proper-arrows/params"][1].length = 1;
	config.rules["@getify/proper-arrows/params"][1].allowed = ["x","y","z","w",];

	var results = eslinter.verify( code, config );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "PARAMS (allowed, count:0): violating", function test(assert){
	var code = `
		var f = (x,y,z,w) => y + z;
	`;

	var config = copyObj(linterOptions.paramsAllowed);
	config.rules["@getify/proper-arrows/params"][1].unused = "none";
	config.rules["@getify/proper-arrows/params"][1].count = 0;
	config.rules["@getify/proper-arrows/params"][1].length = 1;
	config.rules["@getify/proper-arrows/params"][1].allowed = ["x",];

	var results = eslinter.verify( code, config );
	var [{ ruleId, messageId, message, } = {},] = results || [];

	assert.expect( 4 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/params", "ruleId" );
	assert.strictEqual( messageId, "tooMany", "messageId" );
	assert.ok( message.includes("`y`"), "message" );
} );

QUnit.test( "PARAMS (allowed, count:2): conforming", function test(assert){
	var code = `
		var f = (x,y,z,w) => y + z;
	`;

	var config = copyObj(linterOptions.paramsAllowed);
	config.rules["@getify/proper-arrows/params"][1].unused = "none";
	config.rules["@getify/proper-arrows/params"][1].count = 2;
	config.rules["@getify/proper-arrows/params"][1].length = 1;
	config.rules["@getify/proper-arrows/params"][1].allowed = ["z","w",];

	var results = eslinter.verify( code, config );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "PARAMS (allowed, count:2): violating", function test(assert){
	var code = `
		var f = (x,y,z,w) => y + z;
	`;

	var config = copyObj(linterOptions.paramsAllowed);
	config.rules["@getify/proper-arrows/params"][1].unused = "none";
	config.rules["@getify/proper-arrows/params"][1].count = 2;
	config.rules["@getify/proper-arrows/params"][1].length = 1;
	config.rules["@getify/proper-arrows/params"][1].allowed = ["z",];

	var results = eslinter.verify( code, config );
	var [{ ruleId, messageId, message, } = {},] = results || [];

	assert.expect( 4 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/params", "ruleId" );
	assert.strictEqual( messageId, "tooMany", "messageId" );
	assert.ok( message.includes("`w`"), "message" );
} );

QUnit.test( "PARAMS (allowed, length:2): conforming", function test(assert){
	var code = `
		var f = (xx,y,zz,w) => y + zz;
	`;

	var config = copyObj(linterOptions.paramsAllowed);
	config.rules["@getify/proper-arrows/params"][1].unused = "none";
	config.rules["@getify/proper-arrows/params"][1].count = 1000;
	config.rules["@getify/proper-arrows/params"][1].length = 2;
	config.rules["@getify/proper-arrows/params"][1].allowed = ["y","w",];

	var results = eslinter.verify( code, config );

	assert.expect( 1 );
	assert.strictEqual( results.length, 0, "no errors" );
} );

QUnit.test( "PARAMS (allowed, length:2): violating", function test(assert){
	var code = `
		var f = (xx,y,zz,w) => y + zz;
	`;

	var config = copyObj(linterOptions.paramsAllowed);
	config.rules["@getify/proper-arrows/params"][1].unused = "none";
	config.rules["@getify/proper-arrows/params"][1].count = 1000;
	config.rules["@getify/proper-arrows/params"][1].length = 2;
	config.rules["@getify/proper-arrows/params"][1].allowed = ["y",];

	var results = eslinter.verify( code, config );
	var [{ ruleId, messageId, message, } = {},] = results || [];

	assert.expect( 4 );
	assert.strictEqual( results.length, 1, "only 1 error" );
	assert.strictEqual( ruleId, "@getify/proper-arrows/params", "ruleId" );
	assert.strictEqual( messageId, "tooShort", "messageId" );
	assert.ok( message.includes("`w`"), "message" );
} );




// *********************

function copyObj(obj) {
	return JSON.parse(JSON.stringify(obj));
}
