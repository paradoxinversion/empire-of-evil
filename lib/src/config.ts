/**
 * This file is responsible for importing and exporting the configuration data for the game.
 * It imports the data from the JSON files in the config directory and exports them as JavaScript
 * objects that can be used throughout the application.
 */

import effects from "../../config/effects.json";
import personAttributes from "../../config/personAttributes.json";
import researchProjects from "../../config/researchProjects.json";
import skills from "../../config/skills.json";
import tileTypes from "../../config/tileTypes.json";

export { effects, personAttributes, researchProjects, skills, tileTypes };
