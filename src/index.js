const fs = require("fs");
const path = require("path");
const showdown = require("showdown");
const fitToHtmlTemplate = require("./fitToHtmlTemplate");
const WikiConverter = require("./WikiConverter");

const content = {};

function extractAndConvertSection(markdown, sectionName) {
	const section = extractSection(markdown, sectionName);
	if (!section) {
		return null;
	}

	return convertMarkdownToHtml(section);
}

function extractSection(markdown, sectionName) {
	const sectionStart = markdown.indexOf(`## ${sectionName}`);
	if (sectionStart === -1) {
		return null;
	}

	// Find the start of the content (after the header)
	const contentStart = markdown.indexOf("\n", sectionStart) + 1;

	// Find the next h2 header
	const nextH2Match = markdown.slice(contentStart).match(/^## /m);
	const sectionEnd = nextH2Match
		? contentStart + nextH2Match.index
		: markdown.length;

	const sectionContent = markdown.substring(contentStart, sectionEnd).trim();

	return sectionContent;
}

function convertMarkdownToHtml(markdown) {
	const converter = new showdown.Converter();
	converter.setFlavor("github");
	converter.setOption("tables", true);
	converter.setOption("headerLevelStart", 0);

	const html = converter.makeHtml(markdown);
	return html;
}

function main() {
	const inputFile = path.join(
		__dirname,
		"./assets/markdown/Flowers/cosmos-flower.md"
	);

	fs.readFile(inputFile, "utf8", (err, markdown) => {
		if (err) {
			console.error("Error reading the file:", err);
			return;
		}

		// Convert markdown to HTML
		const sectionHtml = extractAndConvertSection(
			markdown,
			"Planting requirements"
		);
		const outputHtml = fitToHtmlTemplate(sectionHtml);
		console.log(outputHtml);

		// Write the HTML to a file
		const outputFile = path.join(__dirname, "output.html");

		fs.writeFile(outputFile, outputHtml, (err) => {
			if (err) {
				console.error("Error writing the file:", err);
				return;
			}
			console.log("HTML file written successfully");
		});
	});
}

main();
