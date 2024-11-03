import getData from "../components/GrantedBenefitsAPI.js";
import { CONFIG } from "../components/config.js";

// init config variables
//const elements = CONFIG.elements; // number of items that the api will return
const init_year = CONFIG.init_year; // first year of data (based on API's documentation)

let years = []; // array that will contain all years with data - from init_year to current year

// populate years array
const now = new Date(Date.now());
const last_year = now.getFullYear()
for (let year = init_year; year <= last_year; year++) {
  years.push(year)
}

// Output a json archive to stdout.
process.stdout.write(JSON.stringify({
  years: years,
  build_date: now.toLocaleString('es-ES').split(',')[0]
}));

/**
 * to run on terminal:
 * node src/data/granted-benefits.json.js
 */
