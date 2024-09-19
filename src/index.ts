import * as path from "path";
import * as fs from "fs";
import WikiConverter from "./WikiConverter"; // Assuming this is the correct import

function convertMarkdownToHtml(sourcePath: string, destPath: string): void {
	// Create destination directory if it doesn't exist
	if (!fs.existsSync(destPath)) {
		fs.mkdirSync(destPath, { recursive: true });
	}

	const files = fs.readdirSync(sourcePath);

	files.forEach((file) => {
		const sourceFilePath = path.join(sourcePath, file);
		const stats = fs.statSync(sourceFilePath);

		if (stats.isDirectory()) {
			// Recursively process subdirectories
			const newDestPath = path.join(destPath, file);
			convertMarkdownToHtml(sourceFilePath, newDestPath);
		} else if (path.extname(file).toLowerCase() === ".md") {
			// Process markdown files
			const destFilePath = path.join(destPath, file.replace(".md", ".html"));

			const markdown = fs.readFileSync(sourceFilePath, "utf-8");
			const wikiConverter = new WikiConverter(
				markdown,
				path.basename(file, ".md"),
				sourceFilePath
			);

			const html = wikiConverter.process();

			fs.writeFileSync(destFilePath, html);
		}
	});
}

function main(): void {
	const MARKDOWN_DIR = path.join(__dirname, "../public/markdown");
	const HTML_DIR = path.join(__dirname, "../public/pages");

	convertMarkdownToHtml(MARKDOWN_DIR, HTML_DIR);
}

main();
