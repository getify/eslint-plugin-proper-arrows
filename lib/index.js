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
				var checkTrivial = !(extraOptions && extraOptions.trivial === true);

				return {
					"ArrowFunctionExpression:exit": function exit(node) {
						// ignore a trivial arrow function?
						if (checkTrivial && isTrivialArrow(node)) {
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
					},
				],
				messages: {
					noName: "Required name inference not possible for this arrow function",
				},
			},
			create(context) {
				var checkTrivial = !(context.options.length > 0 && context.options[0].trivial === true);

				return {
					"ArrowFunctionExpression": function exit(node) {
						// ignore a trivial arrow function?
						if (checkTrivial && isTrivialArrow(node)) {
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
					},
				],
				messages: {
					noGlobal: "Arrow function not allowed in global/top-level scope",
					noProperty: "Arrow function not allowed in object property",
					noExport: "Arrow function not allowed in 'export' statement",
				},
			},
			create(context) {
				var defaultsOnly = context.options.length == 0;
				var extraOptions = (!defaultsOnly) ? context.options[0] : null;
				var globalMode = defaultsOnly || !("global" in extraOptions) || extraOptions.global === true;
				var propertyMode = defaultsOnly || !("property" in extraOptions) || extraOptions.property === true;
				var exportMode = defaultsOnly || !("export" in extraOptions) || extraOptions.export === true;
				var checkTrivial = !(extraOptions && extraOptions.trivial === true);

				return {
					"ArrowFunctionExpression": function exit(node) {
						// ignore a trivial arrow function?
						if (checkTrivial && isTrivialArrow(node)) {
							return;
						}

						var globalArrow = currentlyInGlobalScope(context.parserOptions,context.getScope());

						// handle "global" mode
						if (globalMode && globalArrow) {
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
							["ExportDefaultDeclaration","ExportNamedDeclaration",].includes(node.parent.type) &&
							node.parent.declaration == node
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
				var checkTrivial = !(extraOptions && extraOptions.trivial === true);

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
						if (checkTrivial && isTrivialArrow(node)) {
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
							if (checkTrivial && isTrivialArrow(node.body)) {
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
						if (checkTrivial && isTrivialArrow(node)) {
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
						enum: [ "always", "nested", "never", ],
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
					},
				],
				messages: {
					noThis: "Required 'this' not found in arrow function",
					noThisNested: "Required 'this' not found in arrow function (or nested arrow functions)",
					neverThis: "Forbidden 'this' found in arrow function",
					noGlobal: "Arrow function not allowed in global scope",
				},
			},
			create(context) {
				var parserOptions = context.parserOptions;

				var nestedThis = (context.options[0] === "nested" || !("0" in context.options));
				var alwaysThis = (context.options[0] === "always");
				var neverThis = (context.options[0] === "never");
				var noGlobal = (
					["always","nested",].includes(context.options[0]) &&
					context.options[1] &&
					context.options[1]["no-global"] === true
				);
				var checkTrivial = !(context.options[1] && context.options[1].trivial === true);

				var thisFoundIn = new Set();

				return {
					"ThisExpression": function enter(node) {
						var parentArrow = getParentArrowFunction(context.getAncestors());
						thisFoundIn.add(parentArrow);
					},
					"ArrowFunctionExpression:exit": function exit(node) {
						// ignore a trivial arrow function?
						if (checkTrivial && isTrivialArrow(node)) {
							return;
						}

						var globalArrow = currentlyInGlobalScope(context.parserOptions,context.getScope());
						var foundThis = thisFoundIn.has(node);

						if (foundThis && noGlobal && globalArrow) {
							context.report({
								node: node,
								messageId: "noGlobal",
							});
						}

						if (foundThis && neverThis) {
							context.report({
								node: node,
								messageId: "neverThis",
							});
						}
						else if (!foundThis && !neverThis) {
							let whichMsg = alwaysThis ? "noThis" : "noThisNested";
							context.report({
								node: node,
								messageId: whichMsg,
							});
						}
						// are we tracking nested `this`?
						else if (foundThis && nestedThis) {
							let parentArrow = getParentArrowFunction(context.getAncestors());
							if (parentArrow) {
								thisFoundIn.add(parentArrow);
							}
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

function isTrivialArrow(node) {
	return (
		node.type == "ArrowFunctionExpression" &&
		node.params.length <= 1 &&
		(
			node.params.length == 0 ||
			node.params[0].type == "Identifier"
		) &&
		(
			// .. => {}
			(
				node.body.type == "BlockStatement" &&
				node.body.body.length == 0
			) ||
			// .. => --literal--
			(
				node.body.type == "Literal" &&
				["number","string","boolean",].includes(typeof node.body.value)
			) ||
			// .. => null
			(
				node.body.type == "Literal" &&
				node.body.value === null
			) ||
			// .. => undefined   OR   .. => x
			(
				node.body.type == "Identifier"
			) ||
			// .. => void ..
			(
				node.body.type == "UnaryExpression" &&
				node.body.operator == "void" &&
				node.body.argument.type == "Literal"
			)
		)
	);
}

function currentlyInGlobalScope(parserOptions,scope) {
	var extraGlobalScope = parserOptions.ecmaFeatures && parserOptions.ecmaFeatures.globalReturn;
	return (
		(
			extraGlobalScope &&
			scope.upper &&
			scope.upper.upper &&
			scope.upper.upper.type == "global"
		) ||
		(
			!extraGlobalScope &&
			scope.upper &&
			scope.upper.type == "global"
		)
	);
}
