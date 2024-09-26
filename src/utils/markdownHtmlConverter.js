"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const showdown_1 = __importDefault(require("showdown"));
/**
 * This method will convert the markdown content to html. Uses showdown library for the conversion
 * @param markdown
 * @returns html
 */
class MarkdownHtmlConverter {
    static convert(markdown) {
        const converter = new showdown_1.default.Converter();
        converter.setFlavor("github");
        converter.setOption("tables", true);
        converter.setOption("headerLevelStart", 0);
        const html = converter.makeHtml(markdown);
        return html;
    }
}
exports.default = MarkdownHtmlConverter;
