import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: "src/index.js",
			formats: ["es"],
			fileName: "index",
		},
		outDir: "dist",
		sourcemap: true,
		emptyOutDir: true,
	},
});
