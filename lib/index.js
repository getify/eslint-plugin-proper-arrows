"use strict";

module.exports = {
	rules: {
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
				return {
					"ArrowFunctionExpression": function enter(node) {
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
		"object-return": {
			meta: {
				type: "problem",
				docs: {
					description: "Forbid arrow functions from using concise-expression return for object literals",
					category: "Best Practices",
					url: "https://github.com/getify/eslint-plugin-proper-arrows/#rule-object-return",
				},
				messages: {
					noConciseObject: "Concise-expression return of object literal not allowed",
				},
			},
			create(context) {
				return {
					"ArrowFunctionExpression": function enter(node) {
						if (node.body.type == "ObjectExpression") {
							context.report({
								node: node,
								loc: node.body.loc.start,
								messageId: "noConciseObject",
							});
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
				schema: {
					anyOf: [
						{
							enum: [ "always", "nested", "never", ],
						},
						{
							type: "array",
							items: [
								{
									enum: [ "always", "nested", ],
								},
								{
									enum: [ "no-global", ],
								},
							],
							minItems: 0,
							maxItems: 2,
						},
					],
				},
				messages: {
					noThis: "Required 'this' not found in arrow function",
					noThisNested: "Required 'this' not found in arrow function (or nested arrow functions)",
					neverThis: "Forbidden 'this' found in arrow function",
					noGlobal: "Arrow function not allowed in global scope",
				},
			},
			create(context) {
				var sourceTypeScript = context.parserOptions.sourceType !== "module";

				var nestedThis = (context.options[0] === "nested" || !("0" in context.options));
				var alwaysThis = (context.options[0] === "always");
				var neverThis = (context.options[0] === "never");
				var noGlobal = (
					sourceTypeScript &&
					["always","nested",].includes(context.options[0]) &&
					context.options[1] === "no-global"
				);
				var thisFoundIn = new Set();

				return {
					"ThisExpression": function enter(node) {
						var parentArrow = getParentArrowFunction(context.getAncestors());
						thisFoundIn.add(parentArrow);
					},
					"ArrowFunctionExpression:exit": function exit(node) {
						var scope = context.getScope();
						var inGlobalScope = sourceTypeScript && scope.upper.upper == null;
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
