import WikiConverter from "./WikiConverter";
import fs from "fs";
import path from "path";

function main(): void {
	const directory = path.join(
		__dirname,
		"/assets/markdown/Herbs & Spices/red-onion.md"
	);
	const inputFile = path.join(directory);

	fs.readFile(inputFile, "utf8", (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		const wikiConverter = new WikiConverter(data, "red-onion", directory);

		const wiki = wikiConverter.process();

		const outputDir = path.join(__dirname, "/output");
		const outputFile = path.join(outputDir, "red-onion.html");
		fs.writeFile(outputFile, wiki, (err) => {
			if (err) {
				console.error(err);
				return;
			}
			console.log("File written successfully");
		});
	});
}

main();
