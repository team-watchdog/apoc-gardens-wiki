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
            // Process markdown files
            const destFilePath = path.join(destPath, file.replace(".md", ".html"));
            const markdown = fs.readFileSync(sourceFilePath, "utf-8");
            const wikiConverter = new WikiConverter_1.default(markdown, path.basename(file, ".md"), sourceFilePath);
            const html = wikiConverter.process();
            fs.writeFileSync(destFilePath, html);
        }
    });
}
function main() {
    const MARKDOWN_DIR = path.join(__dirname, "../public/markdown");
    const HTML_DIR = path.join(__dirname, "../public");
    convertMarkdownToHtml(MARKDOWN_DIR, HTML_DIR);
}
main();
