class ProcessTitles {
	/**
	 * Processes titles for better readability
	 * @param title
	 * @returns processed title
	 */
	static process(title: string): string {
		title = title.toLowerCase();
		title = title.replaceAll("-", " ");
		title = title.replaceAll("_", " / ");

		const titleArray = title.split(" ");
		for (let i = 0; i < titleArray.length; i++) {
			titleArray[i] = this.capitalizeFirstLetter(titleArray[i]);
		}
		title = titleArray.join(" ");

		return title;
	}

	/**
	 * Capitalizes first letter of a string
	 * @param string
	 * @returns string with first letter capitalized¸
	 */
	private static capitalizeFirstLetter(string: string): string {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
}

export default ProcessTitles;
