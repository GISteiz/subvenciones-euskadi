/*
async function json(url, timeout = 3000) {
  const response = await fetch(url, { signal: AbortSignal.timeout(timeout) });
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
  return await response.json();
}

function buildYearlyUrl(elements, page, year) {
  //return `https://api.euskadi.eus/granted-benefit/v1.0/granted-benefits/byGrantedDate?_elements=${elements}&_page=${pages}&grantedDateFrom=${year}-01-01&grantedDateTo=${year}-12-31`;
  return `https://api.euskadi.eus/granted-benefit/v1.0/granted-benefits?_elements=${elements}&_page=${page}&grantedDateFrom=${year}-01-01&grantedDateTo=${year}-12-31`;
}
 
const elements = '100';
//const pages = '1';
const init_year = 2015

const now = new Date(Date.now());
const last_year = now.getFullYear()

const from = init_year + '-01-01';
const to = last_year + '-12-31'

let years = []
for (let year = init_year; year <= last_year; year++) {
  years.push(year)
}

years = [2022]
//console.log(years)

let allGrants = []
for (const year of years) {
  console.log(year)

  // get year's first page
  console.log(buildYearlyUrl(elements, 1, year))
  const pages = {}
  pages['page1'] = await json(buildYearlyUrl(elements, 1, year), 30000); //10" timeout
  const pagesInYear = pages['page1'].totalPages
  console.log(year + ' - query 1 ok')

  for (let page = 2; page <= pagesInYear; page++) {
    console.log(buildYearlyUrl(elements, page, year))
    pages['page' + page] = []
    pages['page' + page] = await json(buildYearlyUrl(totalGrants, pages, from, to), 60000); //60" timeout
    console.log(year + ' - query 2 ok')
  }

  //const totalGrants = page1.totalItems
  //console.log(page1)  
  //console.log(totalGrants)
  
  //console.log(buildUrl(totalGrants, pages, from, to))
  allGrants.push([year, pages])
  //allGrants.push([year, yearlyGrants["granted-benefits"].map(grant => {
  //  grant["convener_name"] = grant["convener"]["organization"]["nameByLang"]["SPANISH"];
  //  grant["convener_id"] = grant["convener"]["organization"]["id"];
  //  grant["beneficiary_name"] = grant["beneficiary"]["name"];
  //  grant["beneficiary_id"] = grant["beneficiary"]["id"];
  //  grant["granted_date"] = grant["granted"]["date"];
  //  grant["granted_amount"] = grant["granted"]["amount"];
  //  grant["year"] = grant["granted"]["date"].split("-")[0];
  //})])
}

console.log(allGrants)
process.stdout.write(JSON.stringify(allGrants));
*/


async function json(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
  return await response.json();
}

const elements = '20';
const pages = '1';
const from = '2023-01-01';
const to = '2023-12-31';

function buildUrl(elements, pages, from, to) {
  return `https://api.euskadi.eus/granted-benefit/v1.0/granted-benefits/byGrantedDate?_elements=${elements}&_page=${pages}&grantedDateFrom=${from}&grantedDateTo=${to}`;
}

const page1 = await json(buildUrl(elements, pages, from, to));
const totalGrants = page1.totalItems

const allGrants = await json(buildUrl(totalGrants, pages, from, to));

allGrants["granted-benefits"].map(grant => {
  grant["convener_name"] = grant["convener"]["organization"]["nameByLang"]["SPANISH"];
  grant["convener_id"] = grant["convener"]["organization"]["id"];
  grant["beneficiary_name"] = grant["beneficiary"]["name"];
  grant["beneficiary_id"] = grant["beneficiary"]["id"];
  grant["granted_date"] = grant["granted"]["date"];
  grant["granted_amount"] = grant["granted"]["amount"];
})

process.stdout.write(JSON.stringify(allGrants["granted-benefits"]));
