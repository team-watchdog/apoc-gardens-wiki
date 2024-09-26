import * as path from "path";
import * as fs from "fs";
import WikiConverter from "./WikiConverter"; // Assuming this is the correct import
import MarkdownToHtmlNav from "./markdownToHtmlNav";
require("dotenv").config();

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
			const newDestPath = path.join(destPath, file).toLocaleLowerCase();
			convertMarkdownToHtml(sourceFilePath, newDestPath);
		} else if (path.extname(file).toLowerCase() === ".md") {
			if (path.basename(file) === "index.md") {
				return;
			}
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

function convertIndexHtml(markdownPath: string, htmlPath: string): void {
	const serverPrefix = process.env.SERVER_PREFIX || "";

	console.log("server prefix: " + serverPrefix);
	const indexFilePath = path.join(htmlPath, "index.html");
	const tempFilePath = path.join(htmlPath, "index.temp.html");
	const navGenerator = new MarkdownToHtmlNav(
		markdownPath,
		htmlPath,
		serverPrefix
	);
	const navHtml = navGenerator.generateNav();

	const navRegex = /<nav id="header-section">.*<\/nav>/s;
	const readStream = fs.createReadStream(indexFilePath, { encoding: "utf8" });
	const writeStream = fs.createWriteStream(tempFilePath, { encoding: "utf8" });

	let buffer = "";
	let foundNav = false;

	readStream.on("data", (chunk) => {
		buffer += chunk;

		// Check if the navigation bar is found
		if (!foundNav && navRegex.test(buffer)) {
			// Replace the navigation bar with new content
			buffer = buffer.replace(navRegex, navHtml);
			foundNav = true;
		}

		// Once found or processed enough, write the modified buffer to the temporary file
		if (foundNav || buffer.length > 1024) {
			writeStream.write(buffer);
			buffer = ""; // Reset the buffer after writing
		}
	});

	readStream.on("end", () => {
		// Write any remaining data in the buffer to the file
		if (buffer) writeStream.write(buffer);
		writeStream.end();

		// After successful write, replace the original file
		fs.renameSync(tempFilePath, indexFilePath);
		console.log("Navigation bar replaced successfully.");
	});

	readStream.on("error", (err) => {
		console.error("Error reading the file:", err);
	});

	writeStream.on("error", (err) => {
		console.error("Error writing the file:", err);
	});
}

function main(): void {
	const MARKDOWN_DIR = path.join(__dirname, "../public/markdown");
	const HTML_DIR = path.join(__dirname, "../public");

	convertIndexHtml(MARKDOWN_DIR, HTML_DIR);
	convertMarkdownToHtml(MARKDOWN_DIR, HTML_DIR);
}

main();
