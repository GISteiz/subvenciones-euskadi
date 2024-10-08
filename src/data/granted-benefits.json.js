import getData from "../components/GrantedBenefitsAPI.js";

// init config variables
const elements = '500'; // number of items that the api will return
const init_year = 2023; // first year of data (based on API's documentation)

const data = await getData(elements, init_year);

// Output a json archive to stdout.
process.stdout.write(JSON.stringify(data));

/**
 * to run on terminal:
 * node src/data/granted-benefits.json.js
 */
