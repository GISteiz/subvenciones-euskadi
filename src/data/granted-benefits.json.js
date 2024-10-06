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
 * Identifies the format of a given id string
 * @param {string} id - identifier to check
 * @returns {"DNI"|"NIE"|"other"} - id format
 */
function identifyIdFormat(id) {
  // DNI format is 12345678X
  // NIE format is L1234567X
  id = id.toUpperCase()
  if (id.match(/^\d{8}[A-Z]$/)) {
    return "DNI"
  }
  else if (id.match(/^\[A-Z]d{7}[A-Z]$/)) {
    return "NIE"
  }
  else {
    return "other"
  }
}

/**
 * Anonymizes a name by keeping only one character per word, alternating between
 * the first and second character of each word. This is a very simple anonymization
 * strategy and should not be used for sensitive data.
 * @param {string} name - name to anonymize
 * @returns {string} - anonymized name
 */
function anonymizeName(name) {
  const arr = name.split(' ')
  let out = ''
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].length == 0) { continue }

    const extract = i % 2 == 0 ? 1 : 0
    if (arr[i][extract]) {
      out += arr[i].charAt(extract)
    }
    else {
      out += arr[i].charAt(0)
    }
  }
  return out
}

/**
 * Anonymizes personal data from a grant object
 * @param {Object} grant - reformatted grant object
 * @returns {Object} - grant object with personal data anonymized
 * @description
 * This function checks if the beneficiary_id is a DNI or NIE and anonymizes it
 * accordingly. DNI is anonymized by keeping only the 4th to 7th digits. The beneficiary_name is
 * also anonymized for those with DNIby keeping only one character per word, alternating between
 * the first and second character of each word.
 */
function anonymizePersonalData(grant) {
  // check if beneficiary_id is DNI or NIE
  // DNI format is 12345678X - should be ***4567**
  // NIE format is L1234567X - should be ****4567*
  
  if (identifyIdFormat(grant.beneficiary_id) == 'DNI') {
    grant.beneficiary_id = '***' + grant.beneficiary_id.substring(4, 7) + '*'
    //grant.beneficiary_uid = grant.beneficiary_id + '_' + anonymizeName(grant.beneficiary_name)
    grant.beneficiary_name = '*********'
  }
  //else {
  //  grant.beneficiary_uid = grant.beneficiary_id
  //}

  return grant
 }

/**
 * Extracts relevant data from a grant object into a new object
 * @param {Object} grant - grant object as returned by the API
 * @returns {Object} - new object with relevant data
 */
function extractGrantData(grant) {

  let out = {
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
  
  return anonymizePersonalData(out)
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
let stats = {};

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
 
  //allGrants.push(minifiedData)
  allGrants = allGrants.concat(minifiedData) // put all grants at the same level of the array, no division between years
}

// extract stat description
/**
 * update date (build date)
 * year range
 * total grant count
 * grant count per year
 * total grant amount
 *
 * grant amount per year
 * unique conveners - convener index (id: name)
 * amount by convener
 * unique beneficiaries - beneficiary index (id: name)
 * top 100 amount by beneficiary
 */
stats['build_date'] = now.toLocaleString('es-ES').split(',')[0]
stats['year_range'] = years
stats['total_grant_count'] = allGrants.length
stats['grant_count_per_year'] = years.map(year => [year, allGrants.filter(grant => grant.year == year).length])
stats['total_grant_amount'] = allGrants.reduce((accumulator, grant) => accumulator + grant.granted_amount, 0)
stats['grant_amount_per_year'] = years.map(year => [year, allGrants.filter(grant => grant.year == year).reduce((accumulator, grant) => accumulator + grant.granted_amount, 0)])

stats['convener_index'] = {}
allGrants.map(grant => { 
  if (!stats['convener_index'][grant.convener_id]) {
    stats['convener_index'][grant.convener_id] = grant.convener_name
  }
})

stats['grant_amount_by_convener'] = Object.keys(stats['convener_index']).map(convener_id => [
  convener_id, allGrants
    .filter(grant => grant.convener_id == convener_id)
    .reduce((accumulator, grant) => accumulator + grant.granted_amount, 0)
]).sort((a, b) => b[1] - a[1])

stats['beneficiary_index'] = {}
allGrants.map(grant => { 
  if (!stats['beneficiary_index'][grant.beneficiary_id]) {
    stats['beneficiary_index'][grant.beneficiary_id] = grant.beneficiary_name
  }
})

// CAUTION - ID MIGHT NOT BE UNIQUE !!!
stats['beneficiary_top100'] = Object.keys(stats['beneficiary_index']).map(beneficiary_id => [
  beneficiary_id, allGrants
    .filter(grant => grant.beneficiary_id == beneficiary_id)
    .reduce((accumulator, grant) => accumulator + grant.granted_amount, 0)
]).sort((a, b) => b[1] - a[1])
  .slice(0, 100)
  //.slice(Object.keys(stats['beneficiary_index']).length - 100, Object.keys(stats['beneficiary_index']).length)

// Output a json archive to stdout.
//process.stdout.write(JSON.stringify(allGrants));
//process.stdout.write(JSON.stringify(stats));
process.stdout.write(JSON.stringify({
  "stats": stats,
  "granted-benefits": allGrants
}));

/**
 * to run on terminal:
 * node src/data/granted-benefits.json.js
 */
