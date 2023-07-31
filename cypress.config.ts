import { defineConfig } from "cypress";

export default defineConfig({
	e2e: {
		baseUrl: "http://localhost:7070",
		video: false,
		screenshotOnRunFailure: false,
		supportFile: false,
	},
});
