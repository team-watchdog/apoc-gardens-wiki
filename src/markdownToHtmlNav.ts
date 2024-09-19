import * as fs from "fs";
import * as path from "path";

interface NavItem {
	type: "directory" | "file";
	name: string;
	children?: NavItem[];
	htmlPath?: string;
}

class MarkdownToHtmlNav {
	private markdownRootDir: string;
	private htmlRootDir: string;
	private prefixPath: string;

	constructor(
		markdownRootDir: string,
		htmlRootDir: string,
		prefixPath: string = ""
	) {
		this.markdownRootDir = markdownRootDir;
		this.htmlRootDir = htmlRootDir;
		this.prefixPath = prefixPath;
	}

	public generateNav(): string {
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

	private processDirectory(directory: string): NavItem[] {
		const items: NavItem[] = [];
		const dirents = fs.readdirSync(directory, { withFileTypes: true });

		for (const dirent of dirents.sort((a, b) => a.name.localeCompare(b.name))) {
			const fullPath = path.join(directory, dirent.name);
			if (dirent.isDirectory()) {
				items.push({
					type: "directory",
					name: dirent.name.charAt(0).toUpperCase() + dirent.name.slice(1),
					children: this.processDirectory(fullPath),
				});
			} else if (dirent.isFile() && dirent.name.endsWith(".md")) {
				const name = path.parse(dirent.name).name;
				const relativePath = path.relative(this.markdownRootDir, fullPath);
				const htmlRelativePath = path.join(
					this.prefixPath,
					relativePath.replace(".md", ".html")
				);
				items.push({
					type: "file",
					name: name,
					htmlPath: this.createRelativePath(htmlRelativePath),
				});
			}
		}
		return items;
	}

	private createRelativePath(htmlPath: string): string {
		// Ensure the path starts with '/' for root-relative paths
		return "/" + htmlPath.replace(/\\/g, "/");
	}

	private renderNavItem(item: NavItem): string {
		if (item.type === "directory") {
			return `
        <div class="crop-category">
          <button>
            <p>${item.name}</p>
            <i class="fa-solid fa-plus text-xs"></i>
          </button>
          <ul>
            ${
							item.children
								?.map((child) => this.renderNavItem(child))
								.join("") || ""
						}
          </ul>
        </div>
      `;
		} else {
			return `<li><a href="${item.htmlPath}">${item.name}</a></li>`;
		}
	}
}

export default MarkdownToHtmlNav;
