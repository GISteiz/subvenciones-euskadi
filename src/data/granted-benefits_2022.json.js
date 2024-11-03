import getDataByYear from "../components/GrantedBenefitsAPI.js";
import { CONFIG } from "../components/config.js";

// init config variables
const YEAR = 2022; // year to retrieve data from
const elements = CONFIG.elements; // number of items that the api will return

const data = await getDataByYear(elements, YEAR);

// Output a json archive to stdout.
process.stdout.write(JSON.stringify(data));

/**
 * to run on terminal:
 * node src/data/granted-benefits.json.js
 */
