import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import svelte from "rollup-plugin-svelte";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import { rimraf } from "rimraf";
import pkg from "./package.json" assert { type: "json" };
import path from "path";

const __dirname = path.join(new URL(import.meta.url).pathname, "../");

// eslint-disable-next-line no-console
console.log("\nCleaning previous build...");
rimraf.sync(path.join(__dirname, "../dist"));

const babelConfig = {
	babelrc: false,
	babelHelpers: "bundled",
	extensions: [".js", ".mjs", ".html", ".svelte"],
	include: ["src/**", "node_modules/svelte/**"],
	plugins: [
		"@babel/plugin-proposal-object-rest-spread",
		["@babel/plugin-transform-template-literals", { loose: true }],
	],
	presets: [
		[
			"@babel/preset-env",
			{
				targets: [
					"last 2 Chrome versions",
					"last 2 Safari versions",
					"last 2 iOS versions",
					"last 2 Firefox versions",
					"last 2 Edge versions",
				],
			},
		],
	],
};

function createConfig({ file, format, minify = false }) {
	const isUmd = format === "umd";
	return {
		input: "src/index.js",
		output: {
			file,
			format,
			...(isUmd ? { name: "SvelteNavigator", exports: "named" } : {}),
		},
		external: ["svelte", "svelte/store", "svelte/internal"],
		plugins: [
			svelte(),
			nodeResolve({
				dedupe: importee =>
					importee === "svelte" || importee.startsWith("svelte/"),
			}),
			commonjs(),
			isUmd && babel(babelConfig),
			minify && terser(),
		],
	};
}

export default [
	createConfig({ file: pkg.module, format: "es" }),
	createConfig({ file: pkg.main, format: "umd" }),
	createConfig({ file: pkg.unpkg, format: "umd", minify: true }),
];
