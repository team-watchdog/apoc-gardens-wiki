"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const WikiConverter_1 = __importDefault(require("./WikiConverter")); // Assuming this is the correct import
const markdownToHtmlNav_1 = __importDefault(require("./markdownToHtmlNav"));
require("dotenv").config();
function convertMarkdownToHtml(sourcePath, destPath) {
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
        }
        else if (path.extname(file).toLowerCase() === ".md") {
            if (path.basename(file) === "index.md") {
                return;
            }
            // Process markdown files
            const destFilePath = path.join(destPath, file.replace(".md", ".html"));
            const markdown = fs.readFileSync(sourceFilePath, "utf-8");
            console.log("Converting " + sourceFilePath + " to " + destFilePath);
            const wikiConverter = new WikiConverter_1.default(markdown, path.basename(file, ".md"), sourceFilePath);
            const html = wikiConverter.process();
            fs.writeFileSync(destFilePath, html);
        }
    });
}
function convertIndexHtml(markdownPath, htmlPath) {
    const serverPrefix = process.env.SERVER_PREFIX || "";
    console.log("server prefix: " + serverPrefix);
    const indexFilePath = path.join(htmlPath, "index.html");
    const tempFilePath = path.join(htmlPath, "index.temp.html");
    const navGenerator = new markdownToHtmlNav_1.default(markdownPath, htmlPath, serverPrefix);
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
        if (buffer)
            writeStream.write(buffer);
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
function main() {
    const MARKDOWN_DIR = path.join(__dirname, "../public/markdown");
    const HTML_DIR = path.join(__dirname, "../public");
    convertIndexHtml(MARKDOWN_DIR, HTML_DIR);
    convertMarkdownToHtml(MARKDOWN_DIR, HTML_DIR);
}
main();
