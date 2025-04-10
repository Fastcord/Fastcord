import path from "node:path";
import swc, { type ExpressionStatement, type Identifier } from "@swc/core";

export const metroDependencies = await (async () => {
	const ast = await swc.parseFile(
		path.resolve(__dirname, "./shims/dependencies-modules.ts"),
	);

	const module = ast.body.at(-1) as ExpressionStatement;
	if (module?.type !== "ExpressionStatement") {
		throw new Error("Failed to parse dependencies modules");
	}

	const expression = module.expression;
	if (expression?.type !== "AssignmentExpression") {
		throw new Error("Failed to parse dependencies modules");
	}

	const object = expression.right;
	if (object?.type !== "ObjectExpression") {
		throw new Error("Failed to parse dependencies modules");
	}

	const properties = object.properties;
	if (!properties) {
		throw new Error("Failed to parse dependencies modules");
	}

	return properties.map((prop) => {
		if (prop?.type !== "KeyValueProperty") {
			throw new Error("Failed to parse dependencies modules");
		}

		return (prop.key as Identifier).value;
	});
})();
