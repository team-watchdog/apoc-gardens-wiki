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
class MarkdownToHtmlNav {
    constructor(markdownRootDir, htmlRootDir, prefixPath = "") {
        this.markdownRootDir = markdownRootDir;
        this.htmlRootDir = htmlRootDir;
        this.prefixPath = prefixPath;
    }
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
    processDirectory(directory) {
        const items = [];
        const dirents = fs.readdirSync(directory, { withFileTypes: true });
        for (const dirent of dirents.sort((a, b) => a.name.localeCompare(b.name))) {
            const fullPath = path.join(directory, dirent.name);
            if (dirent.isDirectory()) {
                items.push({
                    type: "directory",
                    name: dirent.name.charAt(0).toUpperCase() + dirent.name.slice(1),
                    children: this.processDirectory(fullPath),
                });
            }
            else if (dirent.isFile() && dirent.name.endsWith(".md")) {
                const name = path.parse(dirent.name).name;
                const relativePath = path.relative(this.markdownRootDir, fullPath);
                const htmlRelativePath = path.join(this.prefixPath, relativePath.replace(".md", ".html"));
                items.push({
                    type: "file",
                    name: name,
                    htmlPath: this.createRelativePath(htmlRelativePath),
                });
            }
        }
        return items;
    }
    createRelativePath(htmlPath) {
        // Ensure the path starts with '/' for root-relative paths
        return "/" + htmlPath.replace(/\\/g, "/");
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
            return `<li><a href="${item.htmlPath}">${item.name}</a></li>`;
        }
    }
}
exports.default = MarkdownToHtmlNav;
