import showdown from "showdown";

/**
 * This method will convert the markdown content to html. Uses showdown library for the conversion
 * @param markdown
 * @returns html
 */
class MarkdownHtmlConverter {
	public static convert(markdown: string): string {
		const converter = new showdown.Converter();
		converter.setFlavor("github");
		converter.setOption("tables", true);
		converter.setOption("headerLevelStart", 0);

		const html = converter.makeHtml(markdown);
		return html;
	}
}

export default MarkdownHtmlConverter;