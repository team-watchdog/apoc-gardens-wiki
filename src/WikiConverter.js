"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const markdownToHtmlNav_1 = __importDefault(require("./markdownToHtmlNav"));
const processTitles_1 = __importDefault(require("./utils/processTitles"));
const markdownHtmlConverter_1 = __importDefault(require("./utils/markdownHtmlConverter"));
require("dotenv").config();
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
    /** ========= PUBLIC METHODS  ========= */
    /**
     * Creates an instance of WikiConverter.
     * @param unformattedWikiContent
     * @param title
     * @param directory
     */
    constructor(unformattedWikiContent, title, directory) {
        this.wikiContent = {
            title: "",
            directory: "",
            content: {
                image: "",
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
        this.MARKDOWN_DIR = path_1.default.join(__dirname, "../public/markdown");
        this.HTML_DIR = path_1.default.join(__dirname, "");
        this.unformattedWikiContent = "";
        this.navHtml = "";
        this.serverPrefix = process.env.SERVER_PREFIX || "";
        this.unformattedWikiContent = unformattedWikiContent;
        this.wikiContent.title = processTitles_1.default.process(title);
        this.wikiContent.directory = directory;
    }
    /**
     * This method will set the markdown directory
     * @param markdownDir
     */
    setMarkdownDir(markdownDir) {
        this.MARKDOWN_DIR = markdownDir;
    }
    /**
     * This method will set the html directory
     * @param htmlDir
     */
    setHtmlDir(htmlDir) {
        this.HTML_DIR = htmlDir;
    }
    /**
     * This method will convert the json wiki content to a html template
     * @param markDown
     * @returns
     */
    process() {
        const wikiContent = this.wikiContent;
        // Extract the description
        const description = this.extractSection(this.unformattedWikiContent, "Description", "##");
        // Extract the image
        this.extractAndSaveImage(this.unformattedWikiContent);
        if (description) {
            wikiContent.content.description =
                markdownHtmlConverter_1.default.convert(description);
        }
        // Extract the plant requirements
        const plantRequirements = this.extractSection(this.unformattedWikiContent, "Planting requirements", "##");
        if (plantRequirements) {
            wikiContent.content.plantRequirements =
                markdownHtmlConverter_1.default.convert(plantRequirements);
        }
        // Extract the harvesting
        const harvesting = this.extractSection(this.unformattedWikiContent, "Harvesting", "##");
        if (harvesting) {
            wikiContent.content.harvesting =
                markdownHtmlConverter_1.default.convert(harvesting);
        }
        // Extract the curing
        const curing = this.extractSection(this.unformattedWikiContent, "Curing", "##");
        if (curing) {
            wikiContent.content.curing = markdownHtmlConverter_1.default.convert(curing);
        }
        // Extract the storage
        const storage = this.extractSection(this.unformattedWikiContent, "Storage", "##");
        if (storage) {
            wikiContent.content.storage = markdownHtmlConverter_1.default.convert(storage);
        }
        // Extract the protecting your plants
        const protectingYourPlants = this.extractSection(this.unformattedWikiContent, "Protecting your plants", "##");
        if (protectingYourPlants) {
            wikiContent.content.protectingYourPlants =
                markdownHtmlConverter_1.default.convert(protectingYourPlants);
        }
        // Extract the difficulty rating
        this.extractAndSaveDifficultyRating(this.unformattedWikiContent);
        // Extract general information
        this.extractAndSaveGeneralInformation(this.unformattedWikiContent);
        // Create the nav html
        const markdownToHtmlNav = new markdownToHtmlNav_1.default(this.MARKDOWN_DIR, this.HTML_DIR, this.serverPrefix);
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
    extractSection(markdown, sectionName, sectionType) {
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
    /** this method will extract the starting image in the wiki entry and convert it to an image with attributes
     * @param markdown
     * @returns
     */
    extractAndSaveImage(markdown) {
        const nextSectionRegex = new RegExp("^## ", "m");
        const sectionEnd = markdown.search(nextSectionRegex);
        const sectionContent = markdown.substring(0, sectionEnd).trim();
        const imageRegex = /!\[.*\]\((.*)\)/;
        const imageMatch = sectionContent.match(imageRegex);
        if (!imageMatch)
            return;
        const imageMarkdown = imageMatch[0];
        const regex = /!\[(.*?)\]\((.*?)\s"(.*?)"\)/;
        const match = imageMarkdown.match(regex);
        if (!match)
            return;
        const alt = match[1];
        const src = match[2];
        const title = match[3];
        // Remove ../.. from the src using regex
        const srcRegex = /\.\.\//g;
        const srcPath = this.serverPrefix + "/" + src.replace(srcRegex, "");
        const image = `<figure>
					<img src="${srcPath}" alt="${alt}" title="${title}" />
					<figcaption>${title}</figcaption>
					</figure>`;
        this.wikiContent.content.image = image;
    }
    /**
     * This method will extract the general information, companion plants and non-companion plants from the markdown content and save it to the wikiContent object
     * @param markdown
     * @returns
     */
    extractAndSaveGeneralInformation(markdown) {
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
        const nonCompanionPlantsRegex = /^\s*\*{0,2}Non-companion\s+plants\s*:?\*{0,2}/im;
        const startOfCompanionPlants = sectionContent.search(companionPlantsRegex);
        const startOfNonCompanionPlants = sectionContent.search(nonCompanionPlantsRegex);
        const generalInformation = sectionContent
            .substring(0, startOfCompanionPlants !== -1
            ? startOfCompanionPlants
            : sectionContent.length)
            .trim();
        this.wikiContent.content.generalInformation =
            markdownHtmlConverter_1.default.convert(generalInformation);
        let companionPlants = "";
        if (startOfCompanionPlants !== -1) {
            companionPlants = sectionContent
                .substring(startOfCompanionPlants, startOfNonCompanionPlants !== -1
                ? startOfNonCompanionPlants
                : sectionContent.length)
                .replace(companionPlantsRegex, "")
                .trim();
        }
        this.wikiContent.content.companionPlants =
            markdownHtmlConverter_1.default.convert(companionPlants);
        let nonCompanionPlants = "";
        if (startOfNonCompanionPlants !== -1) {
            nonCompanionPlants = sectionContent
                .substring(startOfNonCompanionPlants)
                .replace(nonCompanionPlantsRegex, "")
                .trim();
        }
        this.wikiContent.content.nonCompanionPlants =
            markdownHtmlConverter_1.default.convert(nonCompanionPlants);
    }
    /**
     * This method will extract the difficulty rating from the markdown content and save it to the wikiContent object
     * @param markdown
     * @returns
     */
    extractAndSaveDifficultyRating(markdown) {
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
        const difficultyRating = this.convertMarkdownToDifficultyRating(sectionContent);
        this.wikiContent.content.difficultyRating = difficultyRating;
        return sectionContent;
    }
    /**
     * This method will convert the markdown difficulty rating to a json object
     * @param markdown
     * @returns
     */
    convertMarkdownToDifficultyRating(markdown) {
        const sections = markdown.split(/(?=###)/);
        return sections.map((section) => {
            const [header, ...content] = section
                .split("\n")
                .filter((line) => line.trim() !== "");
            // TODO: There's a compilation error here
            const zone = header.replace("### ", "").split(" (")[0].trim();
            const difficulty = parseInt(header.match(/Difficulty: (\d+)\/10/)?.[1] || "0");
            const description = markdownHtmlConverter_1.default.convert(content.join("\n").trim());
            return {
                zone,
                difficulty,
                description,
            };
        });
    }
    /**
     * This method will create a star rating based on the difficulty value
     * @param difficulty
     * @returns
     */
    createStarRating(difficulty) {
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
    fitToHtmlTemplate(wikiContent) {
        return `
        <!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>${wikiContent.title}</title>
		<link href="${this.serverPrefix}/styles/output.css" rel="stylesheet" />

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
			${this.wikiContent.content.image}
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
            .map((rating) => `
                            <div class="difficulty-item-container">
                                <div class="overview collapsible">
                                    <p class="font-bold">${rating.zone}</p>
                                    <p class="difficulty-tag">Difficulty:</p>
                                    <p class="stars">${this.createStarRating(rating.difficulty)}</p>
                                </div>
                                <div class="content">
                                    ${rating.description}
                                </div>
                            </div>
                        `)
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
		<script src="${this.serverPrefix}/scripts/index.js"></script>
	</body>
</html>
        `;
    }
}
exports.default = WikiConverter;
