/**/
import JSZip from "jszip";

/**
 * Fetches JSON from a given URL with a default timeout of 3 seconds.
 * @param {string} url
 * @param {number} [timeout=3000]
 * @returns {Promise<Object>}
 * @throws {Error}
 */
async function json(url, timeout = 3000) {
  const response = await fetch(url, { signal: AbortSignal.timeout(timeout) });
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
  return await response.json();
}

/**
 * Builds a URL for a given year and page, according to the API's documentation at
 * https://opendata.euskadi.eus/api-granted-benefits/?api=granted-benefit/
 *
 * @param {number} elements - number of items that the api will return
 * @param {number} page - page number to retrieve
 * @param {number} year - year to retrieve data from
 * @returns {string} - URL to query the API
 */
function buildYearlyUrl(elements, page, year) {
  //return `https://api.euskadi.eus/granted-benefit/v1.0/granted-benefits/byGrantedDate?_elements=${elements}&_page=${pages}&grantedDateFrom=${year}-01-01&grantedDateTo=${year}-12-31`;
  return `https://api.euskadi.eus/granted-benefit/v1.0/granted-benefits?_elements=${elements}&_page=${page}&grantedDateFrom=${year}-01-01&grantedDateTo=${year}-12-31`;
}


/**
 * Downloads all pages of data for a given year, according to the API's documentation at
 * https://opendata.euskadi.eus/api-granted-benefits/?api=granted-benefit/
 *
 * @param {number} year - year to retrieve data from
 * @param {number} elements - number of items that the api will return
 * @returns {Promise<Object[]>} - array of pages, each containing an API response
 * @throws {Error}
 */
async function getYearPages(year, elements) {
  const pages = []
  
  // get year's first page to calculate the number of requests needed (based on `totalPages` attribute in the response)
  pages.push(await json(buildYearlyUrl(elements, 1, year), 30000)); //10" timeout
  const pagesInYear = pages[0].totalPages

  // get all other pages
  for (let page = 2; page <= pagesInYear; page++) {
    //pages[page] = []
    pages.push(await json(buildYearlyUrl(elements, page, year), 60000)); //60" timeout
  }
  
  //console.log(year + ' - download done')
  return pages
}

/**
 * Extracts relevant data from a grant object into a new object
 * @param {Object} grant - grant object as returned by the API
 * @returns {Object} - new object with relevant data
 */
function extractGrantData(grant) {
  return {
    "uid": grant["oid"],
    "grant_id": grant["benefitId"],
    "name": grant["nameByLang"]["SPANISH"],
    "convener_name": grant["convener"]["organization"]["nameByLang"]["SPANISH"],
    "convener_id": grant["convener"]["organization"]["id"],
    "beneficiary_name": (grant["beneficiary"]["name"] ? grant["beneficiary"]["name"].trim() : ''), //remove trailing spaces
    "beneficiary_id": grant["beneficiary"]["id"],
    "granted_date": grant["granted"]["date"],
    "granted_amount": grant["granted"]["amount"],
    "year": grant["granted"]["date"].split("-")[0]
  }
}

/**
 * Minifies grant data by selecting only relevant fields
 * @param {Object[]} pages - array of pages, each containing an API response
 * @returns {Object[]} - array of minified grant objects
 */
function minifyGrantData(pages) {
  let minifiedData = []
  for (const p in pages) {
    const pageContent = pages[p]
    for (const c in pageContent['granted-benefits']) {
      const grant = pageContent['granted-benefits'][c]
      // pick data of interest
      minifiedData.push(extractGrantData(grant))
    }
  }
  return minifiedData
}

// init config variables
const elements = '500'; // number of items that the api will return
const init_year = 2015; // first year of data (based on API's documentation)
let years = []; // array that will contain all years with data - from init_year to current year
let allGrants = [];

// populate years array
const now = new Date(Date.now());
const last_year = now.getFullYear()
for (let year = init_year; year <= last_year; year++) {
  years.push(year)
}

// download and process data per year
for (const year of years) {
  //console.log(year)

  // get year's first page to calculate the number of requests needed (based on `totalPages` attribute in the response)
  const pages = await getYearPages(year, elements)

  const minifiedData = minifyGrantData(pages)
 
  allGrants.push(minifiedData)
}

// Output a json archive to stdout.
process.stdout.write(JSON.stringify(allGrants));
