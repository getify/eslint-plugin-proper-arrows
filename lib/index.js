"use strict";

module.exports = {
	configs: {
		"getify-says": {
			plugins: [ "@getify/proper-arrows", ],
			rules: {
				"@getify/proper-arrows/params": [ "error", { "unused": "trailing", "count": 2, "length": 3, "allowed": [ "e", "v", "cb", "fn", "pr", ], }, ],
				"@getify/proper-arrows/name": "error",
				"@getify/proper-arrows/return": [ "error", { "ternary": 1, }, ],
				"@getify/proper-arrows/where": "error",
				"@getify/proper-arrows/this": [ "error", "nested", { "no-global": true, }, ],
			},
		},
	},
	rules: {
		"params": {
			meta: {
				type: "problem",
				docs: {
					description: "Control various aspects of arrow function parameters to keep them readable",
					category: "Best Practices",
					url: "https://github.com/getify/eslint-plugin-proper-arrows/#rule-params",
				},
				schema: [
					{
						type: "object",
						properties: {
							unused: {
								enum: [ "all", "trailing", "none", ],
							},
							count: {
								type: "integer",
								min: 0,
							},
							length: {
								type: "integer",
								min: 1,
							},
							allowed: {
								type: "array",
								uniqueItems: true,
								items: {
									type: "string",
								},
							},
							trivial: {
								type: "boolean",
							},
						},
						additionalProperties: false,
					},
				],
				messages: {
					unused: "Parameter `{{param}}` is unused",
					tooMany: "Parameter `{{param}}` is beyond the parameter limit allowed",
					tooShort: "Parameter `{{param}}` is too short",
				},
			},
			create(context) {
				var defaultsOnly = context.options.length == 0;
				var extraOptions = (!defaultsOnly) ? context.options[0] : null;
				var allUnusedMode = defaultsOnly || !("unused" in extraOptions) || extraOptions.unused === "all";
				var trailingUnusedMode = extraOptions && extraOptions.unused === "trailing";
				var noneUnusedMode = extraOptions && extraOptions.unused === "none";
				var countLimit = (defaultsOnly || !("count" in extraOptions)) ? 3 : extraOptions.count;
				var minLength = (defaultsOnly || !("length" in extraOptions)) ? 2 : extraOptions.length;
				var allowedParams = (defaultsOnly || !("allowed" in extraOptions)) ? [] : extraOptions.allowed;
				var ignoreTrivial = !(extraOptions && extraOptions.trivial === true);

				return {
					"ArrowFunctionExpression:exit": function exit(node) {
						// ignore a trivial arrow function?
						if (ignoreTrivial && isTrivialArrow(node, getSettings(context))) {
							return;
						}

						// handle "count" mode
						var allParamIds = getAllIdentifiers(node.params);
						if (allParamIds.length > countLimit) {
							for (let paramId of allParamIds.slice(countLimit)) {
								if (!allowedParams.includes(paramId.name)) {
									context.report({
										node: paramId,
										messageId: "tooMany",
										data: { param: paramId.name, },
									});
									break;
								}
							}
						}

						// handle "length" mode
						var checkParamIds = allParamIds.filter(function skipAllowed(paramId){
							return !allowedParams.includes(paramId.name);
						});
						for (let paramId of checkParamIds) {
							let paramName = paramId.name;
							if (
								!allowedParams.includes(paramName) &&
								paramName.length < minLength
							) {
								context.report({
									node: paramId,
									messageId: "tooShort",
									data: { param: paramName, },
								});
							}
						}

						// handle "unused" mode
						if (!noneUnusedMode) {
							let scope = context.getScope();
							let checkParamNames = checkParamIds.map(function getName(paramId){
								return paramId.name;
							});
							let unusedParamIds = [];
							let lastUsedParamName = null;
							for (let variable of scope.variables) {
								let paramDef = variable.defs.find(function isParameter(def){
									return def.type == "Parameter";
								});

								// is this a parameter-defined variable?
								if (paramDef) {
									// is there also a shadowed variable in the function body?
									let isShadowedDef = !!variable.defs.find(function isVariable(def){
										return def.type == "Variable";
									});
									let varName = variable.name;
									let paramUsed = false;

									// any references to this parameter identifier?
									if (variable.references.length > 0) {
										for (let ref of variable.references) {
											let idInFuncParam = inArrowParams(ref.identifier,node);
											if (
												// non-shadowed usage in function body?
												(
													!isShadowedDef &&
													!idInFuncParam
												) ||
												// usage in function parameters that's not
												// the original parameter definition?
												(
													idInFuncParam &&
													ref.identifier != paramDef.name
												)
											) {
												paramUsed = true;
												break;
											}
										}
									}

									if (paramUsed) {
										lastUsedParamName = varName;
									}
									else {
										unusedParamIds.push(
											allParamIds.find(function getParam(paramId){
												return paramId.name == varName;
											})
										);
									}
								}
							}

							// check/report unused parameters
							let foundLastUsedParam = false;
							for (let paramId of allParamIds) {
								if (trailingUnusedMode && lastUsedParamName != null) {
									if (paramId.name == lastUsedParamName) {
										foundLastUsedParam = true;
									}

									// skip over any parameters until the last used one
									if (!foundLastUsedParam) {
										continue;
									}
								}

								// unused parameter that we need to report?
								if (
									unusedParamIds.includes(paramId) &&
									checkParamNames.includes(paramId.name)
								) {
									context.report({
										node: paramId,
										messageId: "unused",
										data: { param: paramId.name, },
									});
								}
							}
						}
					},
				};
			},
		},
		"name": {
			meta: {
				type: "problem",
				docs: {
					description: "Require arrow functions to receive inferenced names",
					category: "Best Practices",
					url: "https://github.com/getify/eslint-plugin-proper-arrows/#rule-name",
				},
				schema: [
					{
						type: "object",
						properties: {
							trivial: {
								type: "boolean",
							},
						},
						additionalProperties: false,
					},
				],
				messages: {
					noName: "Required name inference not possible for this arrow function",
				},
			},
			create(context) {
				var ignoreTrivial = !(context.options.length > 0 && context.options[0].trivial === true);

				return {
					"ArrowFunctionExpression": function exit(node) {
						// ignore a trivial arrow function?
						if (ignoreTrivial && isTrivialArrow(node, getSettings(context))) {
							return;
						}

						if (!arrowHasInferredName(node)) {
							context.report({
								node: node,
								messageId: "noName",
							});
						}
					},
				};
			},
		},
		"where": {
			meta: {
				type: "problem",
				docs: {
					description: "Forbid arrow functions from various locations",
					category: "Best Practices",
					url: "https://github.com/getify/eslint-plugin-proper-arrows/#rule-where",
				},
				schema: [
					{
						type: "object",
						properties: {
							global: {
								type: "boolean",
							},
							"global-declaration": {
								type: "boolean",
							},
							property: {
								type: "boolean",
							},
							export: {
								type: "boolean",
							},
							trivial: {
								type: "boolean",
							},
						},
						additionalProperties: false,
					},
				],
				messages: {
					noGlobal: "Arrow function not allowed in global/top-level-module scope",
					noGlobalDeclaration: "Arrow function not allowed as declaration in global/top-level-module scope",
					noProperty: "Arrow function not allowed in object property",
					noExport: "Arrow function not allowed in 'export' statement",
				},
			},
			create(context) {
				var defaultsOnly = context.options.length == 0;
				var extraOptions = (!defaultsOnly) ? context.options[0] : null;
				var globalMode = defaultsOnly || !("global" in extraOptions) || extraOptions.global === true;
				var globalDeclarationMode = (
					(
						!defaultsOnly &&
						"global-declaration" in extraOptions
					) ?
						extraOptions["global-declaration"] :
						globalMode
				);
				var propertyMode = defaultsOnly || !("property" in extraOptions) || extraOptions.property === true;
				var exportMode = defaultsOnly || !("export" in extraOptions) || extraOptions.export === true;
				var ignoreTrivial = !(extraOptions && extraOptions.trivial === true);

				return {
					"ArrowFunctionExpression": function exit(node) {
						// ignore a trivial arrow function?
						if (ignoreTrivial && isTrivialArrow(node, getSettings(context))) {
							return;
						}

						var globalArrow = currentlyInGlobalScope(context.parserOptions,context.getScope());
						var globalArrowDeclaration = (
							globalArrow &&
							node.parent.type == "VariableDeclarator"
						);

						// handle "global" and "global-declaration" mode
						// permutations
						if (
							globalDeclarationMode &&
							globalArrowDeclaration
						) {
							context.report({
								node: node.parent,
								messageId: "noGlobalDeclaration",
							});
						}
						else if (
							globalMode &&
							globalArrow
						) {
							context.report({
								node: node,
								messageId: "noGlobal",
							});
						}

						// handle (object) "property" mode
						if (
							propertyMode &&
							node.parent.type == "Property" &&
							node.parent.parent.type == "ObjectExpression" &&
							node.parent.value == node
						) {
							context.report({
								node: node,
								messageId: "noProperty",
							});
						}

						// handle "export" mode
						if (
							exportMode &&
							(
								(
									node.parent.type == "ExportDefaultDeclaration" &&
									node.parent.declaration == node
								) ||
								(
									node.parent.type == "VariableDeclarator" &&
									node.parent.parent.type == "VariableDeclaration" &&
									node.parent.parent.parent.type == "ExportNamedDeclaration" &&
									node.parent.init == node
								)
							)
						) {
							context.report({
								node: node,
								messageId: "noExport",
							});
						}
					},
				};
			},
		},
		"return": {
			meta: {
				type: "problem",
				docs: {
					description: "Control various aspects of arrow function returns to keep them readable",
					category: "Best Practices",
					url: "https://github.com/getify/eslint-plugin-proper-arrows/#rule-return",
				},
				schema: [
					{
						type: "object",
						properties: {
							object: {
								type: "boolean",
							},
							ternary: {
								type: "integer",
								min: 0,
							},
							chained: {
								type: "boolean",
							},
							sequence: {
								type: "boolean",
							},
							trivial: {
								type: "boolean",
							},
						},
						additionalProperties: false,
					},
				],
				messages: {
					noConciseObject: "Concise return of object literal not allowed here",
					noTernary: "Ternary/conditional ('? :') expression not allowed here",
					noChainedArrow: "Chained arrow function return needs visual delimiters '(' and ')'",
					noSequence: "Return of comma sequence expression not allowed here",
				},
			},
			create(context) {
				var defaultsOnly = context.options.length == 0;
				var extraOptions = (!defaultsOnly) ? context.options[0] : null;
				var conciseObjectMode = defaultsOnly || !("object" in extraOptions) || extraOptions.object === true;
				var ternaryLimit = (defaultsOnly || !("ternary" in extraOptions)) ? 0 : extraOptions.ternary;
				var chainedArrowMode = defaultsOnly || !("chained" in extraOptions) || extraOptions.chained === true;
				var sequenceMode = defaultsOnly || !("sequence" in extraOptions) || extraOptions.sequence === true;
				var ignoreTrivial = !(extraOptions && extraOptions.trivial === true);

				var sourceCode = context.getSourceCode();
				var ternaryBodyStack = new Map();

				return {
					"ConditionalExpression:exit": function exit(node) {
						var parentArrow = getParentArrowFunction(context.getAncestors(),/*onlyFromBody=*/true);
						if (parentArrow) {
							if (!ternaryBodyStack.has(parentArrow)) {
								ternaryBodyStack.set(parentArrow,[]);
							}
							let stack = ternaryBodyStack.get(parentArrow);
							stack.unshift(node);
						}
					},
					"ArrowFunctionExpression": function enter(node) {
						// ignore a trivial arrow function?
						if (ignoreTrivial && isTrivialArrow(node, getSettings(context))) {
							return;
						}

						// handle "object" mode
						if (
							conciseObjectMode &&
							node.body.type == "ObjectExpression"
						) {
							context.report({
								node: node,
								loc: node.body.loc.start,
								messageId: "noConciseObject",
							});
						}

						// handle "sequence" mode
						if (
							sequenceMode &&
							node.body.type == "SequenceExpression"
						) {
							context.report({
								node: node,
								loc: node.body.loc.start,
								messageId: "noSequence",
							});
						}

						// handle "chained" mode
						if (
							chainedArrowMode &&
							node.body.type == "ArrowFunctionExpression"
						) {
							// ignore a trivial arrow function?
							if (ignoreTrivial && isTrivialArrow(node.body, getSettings(context))) {
								return;
							}

							let isAsync = node.body.async;
							let before = sourceCode.getTokenBefore(node.body);
							let after = sourceCode.getTokenAfter(node.body);

							if (!(
								before &&
								before.type == "Punctuator" &&
								before.value == "(" &&
								after &&
								after.type == "Punctuator" &&
								after.value == ")"
							)) {
								context.report({
									node: node,
									loc: node.body.loc.start,
									messageId: "noChainedArrow",
								});
							}
						}
					},
					"ArrowFunctionExpression:exit": function exit(node) {
						// ignore a trivial arrow function?
						if (ignoreTrivial && isTrivialArrow(node, getSettings(context))) {
							return;
						}

						if (node.body.type != "BlockStatement") {
							// handle "ternary" limit mode
							let stack = ternaryBodyStack.get(node);
							if (stack) {
								if (stack.length > ternaryLimit) {
									context.report({
										node: stack[ternaryLimit],
										messageId: "noTernary",
									});
								}
								stack.length = 0;
							}
						}
					},
				};
			},
		},
		"this": {
			meta: {
				type: "problem",
				docs: {
					description: "Require arrow functions to reference the 'this' keyword",
					category: "Best Practices",
					url: "https://github.com/getify/eslint-plugin-proper-arrows/#rule-this",
				},
				schema: [
					{
						enum: [ "always", "nested", "never", "never-global", ],
					},
					{
						type: "object",
						properties: {
							"no-global": {
								type: "boolean",
							},
							trivial: {
								type: "boolean",
							},
						},
						additionalProperties: false,
					},
				],
				messages: {
					noThis: "Required 'this' not found in arrow function",
					noThisNested: "Required 'this' not found in arrow function (or nested arrow functions)",
					neverThis: "Forbidden 'this' found in arrow function",
					noGlobal: "Arrow function not allowed in global scope",
					neverGlobal: "Arrow function with 'this' not allowed in global scope",
				},
			},
			create(context) {
				var parserOptions = context.parserOptions;

				var nestedThis = (context.options[0] === "nested" || !("0" in context.options));
				var neverGlobalThis = (context.options[0] === "never-global");
				var alwaysThis = (context.options[0] === "always");
				var neverThis = (context.options[0] === "never");
				var noGlobal = (
					["always","nested",].includes(context.options[0]) &&
					context.options[1] &&
					context.options[1]["no-global"] === true
				);
				var ignoreTrivial = !(context.options[1] && context.options[1].trivial === true);

				var thisFoundIn = new Set();

				return {
					"ThisExpression": function enter(node) {
						var parentArrow = getParentArrowFunction(context.getAncestors());
						thisFoundIn.add(parentArrow);
					},
					"ArrowFunctionExpression:exit": function exit(node) {
						// ignore a trivial arrow function?
						if (ignoreTrivial && isTrivialArrow(node, getSettings(context))) {
							return;
						}

						var globalArrow = currentlyInGlobalScope(context.parserOptions,context.getScope());
						var foundThis = thisFoundIn.has(node);

						// `this` found in arrow function?
						if (foundThis) {
							// never mode?
							if (neverThis) {
								context.report({
									node: node,
									messageId: "neverThis",
								});
							}

							// arrow is in global scope?
							if (globalArrow) {
								// never-global mode?
								if (neverGlobalThis) {
									context.report({
										node: node,
										messageId: "neverGlobal",
									});
								}

								// no-global flag set?
								if (noGlobal) {
									context.report({
										node: node,
										messageId: "noGlobal",
									});
								}
							}

							// need to track nested `this`?
							if (nestedThis || neverGlobalThis) {
								let parentArrow = getParentArrowFunction(context.getAncestors());
								if (parentArrow) {
									thisFoundIn.add(parentArrow);
								}
							}
						}
						// arrow without a `this` found, and not in one
						// of the two never modes?
						else if (!(neverThis || neverGlobalThis)) {
							let whichMsg = alwaysThis ? "noThis" : "noThisNested";
							context.report({
								node: node,
								messageId: whichMsg,
							});
						}
					},
				};
			},
		},
	},
};


// ***************************

// adapted from: https://github.com/eslint/eslint/blob/7ad86dea02feceb7631943a7e1423cc8a113fcfe/lib/rules/func-names.js#L95-L105
function isObjectOrClassMethod(node) {
	const parent = node.parent;

	return (
		parent &&
		(
			parent.type === "MethodDefinition" ||
			(
				parent.type === "Property" && (
					parent.method ||
					parent.kind === "get" ||
					parent.kind === "set"
				)
			)
		)
	);
}

// adapted from: https://github.com/eslint/eslint/blob/7ad86dea02feceb7631943a7e1423cc8a113fcfe/lib/rules/func-names.js#L113-L122
function arrowHasInferredName(node) {
	var parent = node.parent;

	return (
		(
			parent.type === "VariableDeclarator" &&
			parent.id.type === "Identifier" &&
			parent.init === node
		) ||
		(
			["Property","ClassProperty",].includes(parent.type) &&
			parent.value === node
		) ||
		(
			["AssignmentExpression","AssignmentPattern",].includes(parent.type) &&
			parent.left.type === "Identifier" &&
			parent.right === node
		) ||
		(
			parent.type === "ExportDefaultDeclaration" &&
			parent.declaration === node
		)
	);
}

function getParentArrowFunction(nodes,onlyFromBody = false) {
	var prevNode;
	for (let node of [...nodes,].reverse()) {
		// bail if we find a function boundary that's not an arrow
		if (
			isObjectOrClassMethod(node) ||
			node.type == "FunctionExpression" ||
			node.type == "FunctionDeclaration"
		) {
			return;
		}
		else if (node.type == "ArrowFunctionExpression") {
			if (!onlyFromBody || !prevNode || node.body == prevNode) {
				return node;
			}
		}
		prevNode = node;
	}
}

function getAllIdentifiers(nodes) {
	var ret = [];

	for (let node of nodes) {
		// skip elided elements
		if (!node) {
			continue;
		}

		if (node.type == "Identifier") {
			ret = [ ...ret, node, ];
		}
		else if (node.type == "AssignmentPattern") {
			ret = [ ...ret, ...getAllIdentifiers([node.left,]), ];
		}
		else if (node.type == "ArrayPattern") {
			ret = [ ...ret, ...getAllIdentifiers(node.elements), ];
		}
		else if (node.type == "ObjectPattern") {
			ret = [ ...ret, ...getAllIdentifiers(node.properties), ];
		}
		else {
			// NOTE: these contortions/comments here are because of an
			// annoying bug with Istanbul's code coverage:
			// https://github.com/gotwarlost/istanbul/issues/781
			//
			/* eslint-disable no-lonely-if */
			/* istanbul ignore else */
			if (node.type == "Property") {
				ret = [ ...ret, ...getAllIdentifiers([node.value,]), ];
			}
			/* eslint-enable no-lonely-if */
		}
	}

	return ret;
}

function inArrowParams(id,func) {
	var node = id;
	var prevNode;
	while (node && (node != func)) {
		prevNode = node;
		node = node.parent;
	}
	return (
		node == func &&
		prevNode &&
		func.params.includes(prevNode)
	);
}

function isTrivialArrow(node, { trivial }) {
	return (
		node.type == "ArrowFunctionExpression" &&
		node.params.length <= trivial.maxParamCount &&
		(
			node.params.length == 0 ||
			node.params.every(function paramTypeCheck ({ type, properties, elements }) {
				return (
					(type == "Identifier") ||
					(
						trivial.maxObjectParamKeys &&
						type == 'ObjectPattern' &&
						properties.length <= trivial.maxObjectParamKeys
					) ||
					(
						trivial.maxArrayParamKeys &&
						type == 'ArrayPattern' &&
						elements.length <= trivial.maxArrayParamKeys
					)
				)
			})
		) &&
		Object.values(TrivialBodyConditions).some((condition) => condition(node.body, trivial))
	);
}

var TrivialBodyConditions = {
	BlockStatement ({ type, body }, { maxBlockStatements }) {
		return (
			maxBlockStatements > -1 &&
			type == "BlockStatement" &&
			body.length == maxBlockStatements
		);
	},
	Literal ({ type, value }) {
		return (
			// .. => --literal--
			(
				type == "Literal" &&
				["number","string","boolean",].includes(typeof value)
			) ||
			// .. => null
			(
				type == "Literal" &&
				value === null
			)
		);
	},
	Identifier (node, { maxMemberDepth }) {
		return (
			(
				node.type == "Identifier"
			) ||
			(
				maxMemberDepth >= 1 &&
				node.type == "MemberExpression" &&
				TrivialBodyConditions.Identifier(node.object, {
					maxMemberDepth: maxMemberDepth - 1
				}) &&
				TrivialBodyConditions.Identifier(node.property, {
					maxMemberDepth: maxMemberDepth - 1
				})
			)
		)
	},
	Void (node, { allowVoid }) {
		return allowVoid && (
			node.type == "UnaryExpression" &&
			node.operator == "void" &&
			node.argument.type == "Literal"
		);
	},
	Not (node, { allowNot, maxMemberDepth }) {
		return allowNot && (
			node.type == "UnaryExpression" &&
			node.operator == "!" &&
			TrivialBodyConditions.Identifier(node.argument, { maxMemberDepth })
		);
	},
	DoubleNot (node, { allowDoubleNot, maxMemberDepth }) {
		return allowDoubleNot && (
			node.type == "UnaryExpression" &&
			node.operator == "!" &&
			node.argument.type == "UnaryExpression" &&
			node.argument.operator == "!" &&
			( node.argument.argument.type == "Literal" || TrivialBodyConditions.Identifier(node.argument.argument, { maxMemberDepth }) )
		);
	},
	BinaryExpression (node, { allowBinaryExpression, allowedOperators, maxMemberDepth }) {
		return allowBinaryExpression && (
			node.type == "BinaryExpression" &&
			allowedOperators.includes(node.operator) &&
			( node.left.type == "Literal" || TrivialBodyConditions.Identifier(node.left, { maxMemberDepth }) ) &&
			( node.right.type == "Literal" || TrivialBodyConditions.Identifier(node.right, { maxMemberDepth }) )
		)
	},
	CallExpression (node, {
		allowCallExpression,
		allowedCallArguments,
		maxMemberDepth
	}) {
		return allowCallExpression && (
			node.type == "CallExpression" &&
			TrivialBodyConditions.Identifier(node.callee, { maxMemberDepth }) &&
			node.arguments.length <= allowedCallArguments &&
			node.arguments.every(function argsAreValid (arg) {
				return TrivialBodyConditions.Identifier(arg, { maxMemberDepth }) ||
					TrivialBodyConditions.Literal(arg, { maxMemberDepth });
			})
		)
	}
};

function currentlyInGlobalScope(parserOptions,scope) {
	var extraGlobalScope = parserOptions.ecmaFeatures && parserOptions.ecmaFeatures.globalReturn;
	return (
		(
			extraGlobalScope &&
			scope.upper &&
			scope.upper.upper &&
			["global","module"].includes(scope.upper.upper.type)
		) ||
		(
			!extraGlobalScope &&
			scope.upper &&
			["global","module"].includes(scope.upper.type)
		)
	);
}

function getSettings(context) {
	const {
		maxParamCount = 1,
		maxBlockStatements = 0,
		maxMemberDepth = 0,
		maxObjectParamKeys = 0,
		maxArrayParamKeys = 0,
		allowVoid = true,
		allowNot = false,
		allowDoubleNot = false,
		allowBinaryExpression = false,
		allowedOperators = ["+", "-", "/", "*", "^", "%"],
		allowCallExpression = false,
		allowedCallArguments = 1
	} = context.settings['proper-arrows/trivial'] || {};
	return {
		trivial: {
			maxParamCount,
			maxBlockStatements,
			maxMemberDepth,
			maxObjectParamKeys,
			maxArrayParamKeys,
			allowVoid,
			allowNot,
			allowDoubleNot,
			allowBinaryExpression,
			allowedOperators,
			allowCallExpression,
			allowedCallArguments
		}
	};
}
