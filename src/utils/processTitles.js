"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProcessTitles {
    /**
     * Processes titles for better readability
     * @param title
     * @returns processed title
     */
    static process(title) {
        title = title.toLowerCase();
        title = title.replace("-", " ");
        title = title.replace("_", " / ");
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
    static capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}
exports.default = ProcessTitles;
