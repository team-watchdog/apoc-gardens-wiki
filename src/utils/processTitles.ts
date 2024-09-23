class ProcessTitles {
	/**
	 * Processes titles for better readability
	 * @param title
	 * @returns processed title
	 */
	static process(title: string): string {
		title = title.toLowerCase();
		title = title.replace("-", " ");
		title = title.replace("_", " / ");
		for (let i = 0; i < title.length; i++) {
			if (title[i] === " ") {
				title =
					title.slice(0, i + 1) +
					ProcessTitles.capitalizeFirstLetter(title.slice(i + 1));
			}
		}

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
