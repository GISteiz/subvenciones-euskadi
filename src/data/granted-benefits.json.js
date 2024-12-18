import getData from "../components/GrantedBenefitsAPI.js";
import { CONFIG } from "../components/config.js";

// init config variables
const elements = CONFIG.elements; // number of items that the api will return
const init_year = CONFIG.init_year; // first year of data (based on API's documentation)

const data = await getData(elements, init_year);

// Output a json archive to stdout.
process.stdout.write(JSON.stringify(data));

/**
 * to run on terminal:
 * node src/data/granted-benefits.json.js
 */
