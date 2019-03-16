"use strict";

module.exports = {
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
				var extraOptions = !defaultsOnly ? context.options[0] : null;
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
											let idInFuncParam = inFuncParams(ref.identifier,node);
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
		"return": {
			meta: {
				type: "problem",
				docs: {
					description: "Control various aspects of arrow function returns to keep them readable",
					category: "Best Practices",
					url: "https://github.com/getify/eslint-plugin-proper-arrows/#rule-return",
				},
				messages: {
					noConciseObject: "Concise return of object literal not allowed",
					noChainedArrow: "Chained arrow return needs visual delimiters '(' and ')'",
					noSequence: "Return of comma sequence expression not allowed",
				},
			},
			create(context) {
				var defaultsOnly = context.options.length == 0;
				var extraOptions = !defaultsOnly ? context.options[0] : null;
				var conciseObjectMode = defaultsOnly || !("object" in extraOptions) || extraOptions.object === true;
				var chainedArrowMode = defaultsOnly || !("chained" in extraOptions) || extraOptions.chained === true;
				var sequenceMode = defaultsOnly || !("sequence" in extraOptions) || extraOptions.sequence === true;
				var checkTrivial = !(extraOptions && extraOptions.trivial === true);

				var sourceCode = context.getSourceCode();

				return {
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
				var extraGlobalScope = parserOptions.ecmaFeatures && context.parserOptions.ecmaFeatures.globalReturn;

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

						var scope = context.getScope();
						var inGlobalScope = (
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
						var foundThis = thisFoundIn.has(node);

						if (foundThis && noGlobal && inGlobalScope) {
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
							context.report({
								node: node,
								messageId: alwaysThis ? "noThis" : "noThisNested",
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
			parent.type === "Property" &&
			parent.value === node
		) ||
		(
			parent.type === "AssignmentExpression" &&
			parent.left.type === "Identifier" &&
			parent.right === node
		) ||
		(
			parent.type === "ExportDefaultDeclaration" &&
			parent.declaration === node
		) ||
		(
			parent.type === "AssignmentPattern" &&
			parent.right === node
		)
	);
}

function getParentArrowFunction(nodes) {
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
			return node;
		}
	}
}

function getAllIdentifiers(nodes) {
	var ret = [];

	for (let node of nodes) {
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

function inFuncParams(id,func) {
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
			)
		)
	);
}
