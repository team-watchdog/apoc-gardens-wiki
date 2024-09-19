"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WikiConverter_1 = __importDefault(require("./WikiConverter"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function main() {
    const directory = path_1.default.join(__dirname, "/assets/markdown/Herbs & Spices/red-onion.md");
    const inputFile = path_1.default.join(directory);
    fs_1.default.readFile(inputFile, "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const wikiConverter = new WikiConverter_1.default(data, "red-onion", directory);
        const wiki = wikiConverter.process();
        const outputDir = path_1.default.join(__dirname, "/output");
        const outputFile = path_1.default.join(outputDir, "red-onion.html");
        fs_1.default.writeFile(outputFile, wiki, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("File written successfully");
        });
    });
}
main();
