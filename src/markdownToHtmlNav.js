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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Generates a navigation menu for a set of markdown files.
 * The navigation menu is generated based on the directory structure of the markdown files.
 * Each directory is represented as a collapsible category, and each markdown file is represented as a link.
 * The generated navigation menu is in HTML format.
 *
 * ----- USAGE -----
 * - First you need to create an instance of the MarkdownToHtmlNav class.
 * - The constructor accepts three parameters:
 *  - markdownRootDir: The root directory containing the markdown files.
 * 	- htmlRootDir: The root directory where the generated HTML files will be placed.
 * 	- prefixPath (optional): A prefix path to be added to the generated HTML links.
 * - Then you can call the generateNav method to generate the navigation menu.
 * - The generateNav method returns the generated navigation menu as an HTML string.
 *
 * ----- EXAMPLE -----
 * const markdownRootDir = "path/to/markdown";
 * const htmlRootDir = "path/to/html";
 * const prefixPath = "/wiki";
 * const markdownToHtmlNav = new MarkdownToHtmlNav(markdownRootDir, htmlRootDir, prefixPath);
 * const navHtml = markdownToHtmlNav.generateNav();
 *
 * ----- NOTES -----
 * - The generated HTML links are relative to the root of the server.
 * - No styles are added here, so you may need to style the generated navigation menu according to your needs.
 */
class MarkdownToHtmlNav {
    // =============== Public Methods ===============
    /**
     * Creates an instance of MarkdownToHtmlNav.
     * @param markdownRootDir
     * @param htmlRootDir
     * @param prefixPath
     */
    constructor(markdownRootDir, htmlRootDir, prefixPath = "/") {
        this.markdownRootDir = markdownRootDir;
        this.htmlRootDir = htmlRootDir;
        this.prefixPath = prefixPath.endsWith("/") ? prefixPath : prefixPath + "/";
    }
    /**
     *  Generates a navigation menu for a set of markdown files.
     * @returns The generated navigation menu as an HTML string.
     */
    generateNav() {
        const navItems = this.processDirectory(this.markdownRootDir);
        const navHtml = `
      <nav id="header-section">
        <h2>Content</h2>
        <div>
          ${navItems.map((item) => this.renderNavItem(item)).join("")}
        </div>
      </nav>
    `;
        return navHtml;
    }
    // =============== Private Helper Methods ===============
    /**
     * Processes a directory and returns its contents as a list of NavItems.
     * @param directory The directory to process.
     * @returns A list of NavItems representing the contents of the
     * directory (files and subdirectories).
     */
    processDirectory(directory) {
        const items = [];
        const dirents = fs.readdirSync(directory, { withFileTypes: true });
        for (const dirent of dirents.sort((a, b) => a.name.localeCompare(b.name))) {
            const fullPath = path.join(directory, dirent.name);
            if (dirent.isDirectory()) {
                items.push({
                    type: "directory",
                    name: dirent.name,
                    children: this.processDirectory(fullPath),
                });
            }
            else if (dirent.isFile() && dirent.name.endsWith(".md")) {
                const name = path.parse(dirent.name).name;
                const relativePath = path
                    .relative(this.markdownRootDir, fullPath)
                    .toLocaleLowerCase();
                const htmlRelativePath = relativePath.replace(".md", ".html");
                items.push({
                    type: "file",
                    name: name,
                    htmlPath: this.createAbsolutePath(htmlRelativePath),
                });
            }
        }
        return items;
    }
    /**
     * Creates a relative path from an absolute path.
     * @param htmlPath
     * @returns
     */
    createAbsolutePath(htmlPath) {
        // Ensure the path starts with the prefix and uses forward slashes
        return path.join(this.prefixPath, htmlPath).replace(/\\/g, "/");
    }
    renderNavItem(item) {
        var _a;
        if (item.type === "directory") {
            return `
        <div class="crop-category">
          <button>
            <p>${item.name}</p>
            <i class="fa-solid fa-plus text-xs"></i>
          </button>
          <ul>
            ${((_a = item.children) === null || _a === void 0 ? void 0 : _a.map((child) => this.renderNavItem(child)).join("")) || ""}
          </ul>
        </div>
      `;
        }
        else {
            console.log(item.name + " " + item.htmlPath);
            return `<li><a href="${item.htmlPath}">${item.name}</a></li>`;
        }
    }
}
exports.default = MarkdownToHtmlNav;
