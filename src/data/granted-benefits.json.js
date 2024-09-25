async function json(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
  return await response.json();
}

const elements = '20';
const pages = '1';
const from = '2024-01-01';
const to = '2024-11-25';

function buildUrl(elements, pages, from, to) {
  return `https://api.euskadi.eus/granted-benefit/v1.0/granted-benefits/byGrantedDate?_elements=${elements}&_page=${pages}&grantedDateFrom=${from}&grantedDateTo=${to}`;
}

const page1 = await json(buildUrl(elements, pages, from, to));
const totalGrants = page1.totalItems
//console.log(`Total grants: ${totalGrants}`);

const allGrants = await json(buildUrl(totalGrants, pages, from, to));

process.stdout.write(JSON.stringify(allGrants["granted-benefits"]));
