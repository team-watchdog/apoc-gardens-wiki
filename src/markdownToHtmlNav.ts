import * as fs from "fs";
import * as path from "path";

interface NavItem {
	type: "directory" | "file";
	name: string;
	children?: NavItem[];
	htmlPath?: string;
}

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
	private markdownRootDir: string;
	private htmlRootDir: string;
	private prefixPath: string;

	// =============== Public Methods ===============

	/**
	 * Creates an instance of MarkdownToHtmlNav.
	 * @param markdownRootDir
	 * @param htmlRootDir
	 * @param prefixPath
	 */
	constructor(
		markdownRootDir: string,
		htmlRootDir: string,
		prefixPath: string = ""
	) {
		this.markdownRootDir = markdownRootDir;
		this.htmlRootDir = htmlRootDir;
		this.prefixPath = prefixPath;
	}

	/**
	 *  Generates a navigation menu for a set of markdown files.
	 * @returns The generated navigation menu as an HTML string.
	 */
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

	// =============== Private Helper Methods ===============

	/**
	 * Processes a directory and returns its contents as a list of NavItems.
	 * @param directory The directory to process.
	 * @returns A list of NavItems representing the contents of the
	 * directory (files and subdirectories).
	 */
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

	/**
	 * Creates a relative path from an absolute path.
	 * @param htmlPath
	 * @returns
	 */
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