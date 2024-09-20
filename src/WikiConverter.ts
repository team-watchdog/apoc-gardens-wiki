import showdown from "showdown";
import path from "path";
import MarkdownToHtmlNav from "./markdownToHtmlNav";

// Define the interface for the wiki content
type IWikiContent = {
	title: string;
	directory: string;
	content: {
		generalInformation: string;
		difficultyRating: {
			zone: string;
			difficulty: number;
			description: string;
		}[];

		companionPlants: string;
		nonCompanionPlants: string;
		description: string;
		plantRequirements: string;
		harvesting?: string;
		curing?: string;
		storage?: string;
		protectingYourPlants?: string;
	};
};

/**
 * This class will convert the markdown wiki content to a html template
 * @class WikiConverter
 *
 * ----- Dependencies -----
 *     - showdown
 *     - path
 *     - MarkdownToHtmlNav
 *
 * ----- Usage -----
 * First create an instance of the WikiConverter class with the markdown content, title, and directory.
 * Then call the process() method to convert the markdown content to a html template. This method will return the converted html content.
 * All the converted html content will be stored in the wikiContent property of the class.
 * Additionally, the navHtml property will contain the generated navigation html.

 * @example
 * const wikiConverter = new WikiConverter(markdownContent, title, directory);
 * const htmlContent = wikiConverter.process();

 * ----- Note -----
 * If you want to change the markdown directory or html directory, you can use the setMarkdownDir() and setHtmlDir() methods.
 * These methods will allow you to change the directories before calling the process() method.
 * On default the markdown directory is set to "public/markdown" and the html directory is set to "public/pages".
 * 
 * @example
 * wikiConverter.setMarkdownDir("new/markdown/dir");
 * wikiConverter.setHtmlDir("new/html/dir");
 *
 * This class only works for a specific markdown format. It extracts different sections from the markdown content and converts them to html.
 */
class WikiConverter {
	private wikiContent: IWikiContent = {
		title: "",
		directory: "",
		content: {
			generalInformation: "",
			difficultyRating: [
				{
					zone: "",
					difficulty: 0,
					description: "",
				},
			],
			companionPlants: "",
			nonCompanionPlants: "",
			description: "",
			plantRequirements: "",
			harvesting: "",
			curing: "",
			storage: "",
			protectingYourPlants: "",
		},
	};
	private MARKDOWN_DIR = path.join(__dirname, "../public/markdown");
	private HTML_DIR = path.join(__dirname, "../public/pages");
	private unformattedWikiContent: string = "";
	private navHtml: string = "";

	/** ========= PUBLIC METHODS  ========= */

	/**
	 * Creates an instance of WikiConverter.
	 * @param unformattedWikiContent
	 * @param title
	 * @param directory
	 */
	constructor(
		unformattedWikiContent: string,
		title: string,
		directory: string
	) {
		this.unformattedWikiContent = unformattedWikiContent;
		this.wikiContent.title = this.capitalizeFirstLetter(title);
		this.wikiContent.directory = directory;
	}

	/**
	 * This method will set the markdown directory
	 * @param markdownDir
	 */
	setMarkdownDir(markdownDir: string) {
		this.MARKDOWN_DIR = markdownDir;
	}

	/**
	 * This method will set the html directory
	 * @param htmlDir
	 */
	setHtmlDir(htmlDir: string) {
		this.HTML_DIR = htmlDir;
	}

	/**
	 * This method will convert the json wiki content to a html template
	 * @param markDown
	 * @returns
	 */
	public process(): string {
		const wikiContent = this.wikiContent;

		// Extract the description
		const description = this.extractSection(
			this.unformattedWikiContent,
			"Description",
			"##"
		);

		if (description) {
			wikiContent.content.description =
				this.htmlToMarkdownConverter(description);
		}

		// Extract the plant requirements
		const plantRequirements = this.extractSection(
			this.unformattedWikiContent,
			"Planting requirements",
			"##"
		);

		if (plantRequirements) {
			wikiContent.content.plantRequirements =
				this.htmlToMarkdownConverter(plantRequirements);
		}

		// Extract the harvesting
		const harvesting = this.extractSection(
			this.unformattedWikiContent,
			"Harvesting",
			"##"
		);

		if (harvesting) {
			wikiContent.content.harvesting = this.htmlToMarkdownConverter(harvesting);
		}

		// Extract the curing
		const curing = this.extractSection(
			this.unformattedWikiContent,
			"Curing",
			"##"
		);

		if (curing) {
			wikiContent.content.curing = this.htmlToMarkdownConverter(curing);
		}

		// Extract the storage
		const storage = this.extractSection(
			this.unformattedWikiContent,
			"Storage",
			"##"
		);

		if (storage) {
			wikiContent.content.storage = this.htmlToMarkdownConverter(storage);
		}

		// Extract the protecting your plants
		const protectingYourPlants = this.extractSection(
			this.unformattedWikiContent,
			"Protecting your plants",
			"##"
		);

		if (protectingYourPlants) {
			wikiContent.content.protectingYourPlants =
				this.htmlToMarkdownConverter(protectingYourPlants);
		}

		// Extract the difficulty rating
		this.extractAndSaveDifficultyRating(this.unformattedWikiContent);

		// Extract general information
		this.extractAndSaveGeneralInformation(this.unformattedWikiContent);

		// Create the nav html
		const markdownToHtmlNav = new MarkdownToHtmlNav(
			this.MARKDOWN_DIR,
			this.HTML_DIR,
			"public/pages"
		);
		this.navHtml = markdownToHtmlNav.generateNav();

		return this.fitToHtmlTemplate(wikiContent);
	}

	/** ========= PRIVATE METHODS  ========= */

	/**
	 *  This method will extract a section from the markdown content. This is used to extract the default case of sections
	 * @param markdown
	 * @param sectionName
	 * @param sectionType
	 * @returns
	 */
	private extractSection(
		markdown: string,
		sectionName: string,
		sectionType: string
	): string | null {
		const sectionStart = markdown.indexOf(`${sectionType} ${sectionName}`);
		if (sectionStart === -1) {
			return null;
		}

		// Find the start of the content (after the header)
		const contentStart = markdown.indexOf("\n", sectionStart) + 1;

		// Find the next section of the same type
		const nextSectionRegex = new RegExp(`^${sectionType} `, "m");
		const nextSectionMatch = markdown
			.slice(contentStart)
			.match(nextSectionRegex);
		const sectionEnd = nextSectionMatch
			? contentStart + (nextSectionMatch?.index ?? markdown.length)
			: markdown.length;

		const sectionContent = markdown.substring(contentStart, sectionEnd).trim();

		return sectionContent;
	}

	/**
	 * This method will extract the general information, companion plants and non-companion plants from the markdown content and save it to the wikiContent object
	 * @param markdown
	 * @returns
	 */
	private extractAndSaveGeneralInformation(markdown: string) {
		const sectionStart = markdown.indexOf("## General Information");
		if (sectionStart === -1) {
			return "";
		}

		const contentStart = markdown.indexOf("\n", sectionStart) + 1;
		const nextSectionRegex = new RegExp("^## ", "m");

		const nextSectionMatch = markdown
			.slice(contentStart)
			.match(nextSectionRegex);
		const sectionEnd = nextSectionMatch
			? contentStart + (nextSectionMatch?.index ?? markdown.length)
			: markdown.length;

		const sectionContent = markdown.substring(contentStart, sectionEnd).trim();

		const companionPlantsRegex = /^\s*\*{0,2}Companion\s+plants\s*:?\*{0,2}/im;
		const nonCompanionPlantsRegex =
			/^\s*\*{0,2}Non-companion\s+plants\s*:?\*{0,2}/im;

		const startOfCompanionPlants = sectionContent.search(companionPlantsRegex);
		const startOfNonCompanionPlants = sectionContent.search(
			nonCompanionPlantsRegex
		);

		const generalInformation = sectionContent
			.substring(
				0,
				startOfCompanionPlants !== -1
					? startOfCompanionPlants
					: sectionContent.length
			)
			.trim();

		this.wikiContent.content.generalInformation =
			this.htmlToMarkdownConverter(generalInformation);

		let companionPlants = "";
		if (startOfCompanionPlants !== -1) {
			companionPlants = sectionContent
				.substring(
					startOfCompanionPlants,
					startOfNonCompanionPlants !== -1
						? startOfNonCompanionPlants
						: sectionContent.length
				)
				.replace(companionPlantsRegex, "")
				.trim();
		}

		this.wikiContent.content.companionPlants =
			this.htmlToMarkdownConverter(companionPlants);

		let nonCompanionPlants = "";
		if (startOfNonCompanionPlants !== -1) {
			nonCompanionPlants = sectionContent
				.substring(startOfNonCompanionPlants)
				.replace(nonCompanionPlantsRegex, "")
				.trim();
		}

		this.wikiContent.content.nonCompanionPlants =
			this.htmlToMarkdownConverter(nonCompanionPlants);
	}

	/**
	 * This method will extract the difficulty rating from the markdown content and save it to the wikiContent object
	 * @param markdown
	 * @returns
	 */
	private extractAndSaveDifficultyRating(markdown: string) {
		const sectionStart = markdown.indexOf("## Difficulty Rating");
		if (sectionStart === -1) {
			return "";
		}
		const contentStart = markdown.indexOf("\n", sectionStart) + 1;
		const nextSectionRegex = new RegExp("^## ", "m");
		const nextSectionMatch = markdown
			.slice(contentStart)
			.match(nextSectionRegex);
		const sectionEnd = nextSectionMatch
			? contentStart + (nextSectionMatch?.index ?? markdown.length)
			: markdown.length;
		const sectionContent = markdown.substring(contentStart, sectionEnd).trim();

		const difficultyRating =
			this.convertMarkdownToDifficultyRating(sectionContent);

		this.wikiContent.content.difficultyRating = difficultyRating;

		return sectionContent;
	}

	/**
	 * This method will convert the markdown difficulty rating to a json object
	 * @param markdown
	 * @returns
	 */
	private convertMarkdownToDifficultyRating(markdown: string): {
		zone: string;
		difficulty: number;
		description: string;
	}[] {
		const sections = markdown.split(/(?=###)/);

		return sections.map((section) => {
			const [header, ...content] = section
				.split("\n")
				.filter((line) => line.trim() !== "");

			const zone = header.replace("### ", "").split(" (")[0].trim();
			const difficulty = parseInt(
				header.match(/Difficulty: (\d+)\/10/)?.[1] || "0"
			);

			const description = this.htmlToMarkdownConverter(
				content.join("\n").trim()
			);

			return {
				zone,
				difficulty,
				description,
			};
		});
	}

	/**
	 * This method will convert the markdown content to html. Uses showdown library for the conversion
	 * @param markdown
	 * @returns html
	 */
	private htmlToMarkdownConverter(markdown: string): string {
		const converter = new showdown.Converter();
		converter.setFlavor("github");
		converter.setOption("tables", true);
		converter.setOption("headerLevelStart", 0);

		const html = converter.makeHtml(markdown);
		return html;
	}

	/**
	 * This method will create a star rating based on the difficulty value
	 * @param difficulty
	 * @returns
	 */
	private createStarRating(difficulty: number): string {
		let difficultyRating = "☆☆☆☆☆";
		let difficultyValue = Math.round(difficulty / 2);

		for (let i = 0; i < difficultyValue; i++) {
			difficultyRating = difficultyRating.replace("☆", "★");
		}

		return difficultyRating;
	}

	/**
	 * This method will convert the json wiki content to a html template
	 * @param markDown
	 * @returns
	 */
	private fitToHtmlTemplate(wikiContent: IWikiContent): string {
		return `
        <!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Document</title>
		<link href="../../styles/output.css" rel="stylesheet" />

		<!-- Font Awesome -->
		<link
			href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
			rel="stylesheet" />

		<!-- Google Fonts -->
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
		<link
			href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap"
			rel="stylesheet" />
	</head>
	<body>
		<!-- HEADER SECTION -->
		${this.navHtml}

		<!-- MAIN SECTION -->
		<article id="main-section">
			<section id="description-section">
				<!-- Description-->
				<h1>Description</h1>
				<hr />
                ${wikiContent.content.description}
				<br />
			</section>
			<!-- Planting requirements -->
			<section id="plant-requirements-section">
				<h1>Planting requirements</h1>
				<hr />
				${wikiContent.content.plantRequirements}
				
			</section>
			<br />
			<!-- Harvesting -->
			<section id="harvesting-section">
				<h1>Harvesting</h1>
				<hr />
                ${wikiContent.content.harvesting}
				
			</section>
			<br />
			<!-- Curing -->
			<section id="curing-section">
				<h1>Curing</h1>
				<hr />
                ${wikiContent.content.curing}
				
			</section>
			<br />

			<!-- Storage -->
			<section id="storage-section">
				<h1>Storage</h1>
				<hr />
                ${wikiContent.content.storage}
				
			</section>
			<br />

			<!-- Protecting your plants -->
			<section id="protecting-plant-section">
				<h1>Protecting your plants</h1>
				<hr />
                ${wikiContent.content.protectingYourPlants}
			</section>
			<br />
		</article>

		<!-- This is the general information section -->
		<article id="general-information-section">
			<img src="assets/images/beetroot.png" alt="placeholder" />
			<div class="info-container">
				<h1>${wikiContent.title}</h1>
				<div id="general-info">
                    ${wikiContent.content.generalInformation}
				</div>
				<hr />
				<!-- Difficulty Rating -->
				<div id="difficulty-rating">
					<h2>Difficulty rating</h2>
					<div class="difficulty-container">
                        ${wikiContent.content.difficultyRating
													.map(
														(rating) => `
                            <div class="difficulty-item-container">
                                <div class="overview collapsible">
                                    <p class="font-bold">${rating.zone}</p>
                                    <p class="difficulty-tag">Difficulty:</p>
                                    <p class="stars">${this.createStarRating(
																			rating.difficulty
																		)}</p>
                                </div>
                                <div class="content">
                                    ${rating.description}
                                </div>
                            </div>
                        `
													)
													.join("")}
					</div>
				</div>
				<hr />
				<div id="companion-plants" class="relative">
					<div class="flex gap-x-2">
						<h2>Companion plants</h2>
						<button class="companion-info mt-2">
							<i
								class="fa-regular fa-circle-question text-primary-700 text-sm mt-2"></i>
						</button>
						<p class="companion-definition">
							Companion plants aid growth by attracting beneficial insects,
							repelling pests, and providing support. They are part of a natural
							pest control system, maximising space and increasing crop
							productivity.
						</p>
					</div>
					${wikiContent.content.companionPlants}
				</div>

				<div id="non-companion-plants" class="relative">
					<div class="flex gap-x-2">
						<h2>Non-companion plants</h2>
						<button class="companion-info mt-2">
							<i
								class="fa-regular fa-circle-question text-secondary-900 text-sm"></i>
						</button>
						<p
							class="companion-definition">
							Non-companion plants are those that negatively affect each other’s
							growth when planted together, often due to competition for
							resources or chemical interference. Avoiding these pairings helps
							improve plant health and yields.
						</p>
					</div>
					${wikiContent.content.nonCompanionPlants}
				</div>
			</div>
		</article>
		<script src="../../scripts/index.js"></script>
	</body>
</html>
        `;
	}

	/** ========= UTILITY METHODS  ========= */

	/**
	 * Capitalizes first letter of a string
	 * @param string
	 * @returns
	 */
	private capitalizeFirstLetter(string: string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
}

export default WikiConverter;