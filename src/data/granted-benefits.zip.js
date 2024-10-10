import JSZip from "jszip";
import getData from "../components/GrantedBenefitsAPI.js";

// init config variables
const elements = '500'; // number of items that the api will return
const init_year = 2020; // first year of data (based on API's documentation)

const data = await getData(elements, init_year);

const zip = new JSZip(); // init output a ZIP archive.
zip.file("granted-benefits.json", JSON.stringify(data, null, 2))

// Output a ZIP archive to stdout.
zip.generateNodeStream().pipe(process.stdout);

/**
 * to run on terminal:
 * node src/data/granted-benefits.zip.js
 */