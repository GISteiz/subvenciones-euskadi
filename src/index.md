---
title: Subvenciones en Euskadi
theme: [dashboard, light]
toc: false
---

<div class="row">
  <div class="grid grid-cols-1">
    <h1 style="max-width: 840px">Subvenciones en Euskadi | <small> Desde ${Math.min(...config.years)} hasta ${Math.max(...config.years)}</small></h1>
  </div>
</div>

___

```js
import {YearlyPlot} from "./components/charts/yearlyPlot.js";
import {DailyPlot} from "./components/charts/dailyPlot.js";
import {GrantsByConvenerPlot} from "./components/charts/grantsByConvenerPlot.js";
import {GrantSearch} from "./components/inputs/grantSearch.js";
import {GrantTable} from "./components/inputs/grantTable.js";
import {YearSelect} from "./components/inputs/yearSelect.js";
import {Display} from "./components/display.js";

import * as hp from "./components/helpers.js";
import * as dict from "./components/dictionary.js";
```

```js
const config = await FileAttachment("./data/config.json").json();
const responses = {}
responses['2015'] = await FileAttachment("./data/granted-benefits_2015.json").json();
responses['2016'] = await FileAttachment("./data/granted-benefits_2016.json").json();
responses['2017'] = await FileAttachment("./data/granted-benefits_2017.json").json();
responses['2018'] = await FileAttachment("./data/granted-benefits_2018.json").json();
responses['2019'] = await FileAttachment("./data/granted-benefits_2019.json").json();
responses['2020'] = await FileAttachment("./data/granted-benefits_2020.json").json();
responses['2021'] = await FileAttachment("./data/granted-benefits_2021.json").json();
responses['2022'] = await FileAttachment("./data/granted-benefits_2022.json").json();
responses['2023'] = await FileAttachment("./data/granted-benefits_2023.json").json();
responses['2024'] = await FileAttachment("./data/granted-benefits_2024.json").json();
```

```js
// process `responses` by year
let years = config.years//.map( y => y.toString() ) 
let grantedBenefits = [] 

// gather all grants
console.log(years)
for (const i in years) {
  const year = years[i]
  grantedBenefits = grantedBenefits.concat(responses[year]['granted-benefits'])
}
```

```js
// calculate stats
let stats = {}
stats['total_grant_count'] = grantedBenefits.length
stats['grant_count_per_year'] = years.map(function(year) {
  return {
    year: year,
    value: grantedBenefits.filter(grant => grant.year == year).length
  }
})
stats['total_grant_amount'] = grantedBenefits.reduce((accumulator, grant) => accumulator + grant.granted_amount, 0)
stats['grant_amount_per_year'] = years.map(function (year) {
  return {
    year,
    value: grantedBenefits.filter(grant => grant.year == year).reduce((accumulator, grant) => accumulator + grant.granted_amount, 0)
  }
})

```

```js
//years = config.years.map( y => y.toString() ) 
```

```js
// Data processing
const grantsByConvener = d3
  .rollups(grantedBenefits, v => d3.sum(v, d => d.granted_amount), d => d.convener_name)
  .map(([name, value]) => ({name, value}))
  .sort((a, b) => d3.descending(a.value, b.value));

const grantsByDay = d3
  .rollups(grantedBenefits, v => d3.sum(v, d => d.granted_amount), d => new Date(d.granted_date))
  .map(([date, value]) => ({date, value}))
```

```js
const yearSelectInput = YearSelect(years, Inputs);
const yearSelection = Generators.input(yearSelectInput);
```

```js
// Search Input
const searchInput = GrantSearch(grantedBenefits, Inputs);
let filteredData = Generators.input(searchInput);
```

```js
//Table Input
const grantTableInput = GrantTable(filteredData, Inputs)
const tableSelection = Generators.input(grantTableInput);
```

<style type="text/css">

#observablehq-footer {
  font-family: "Open Sans", Arial, sans-serif;
}

.card {
  font-family: "Open Sans", Arial, sans-serif;
}

.indicator-number {
  color: #1c4da9;
  font-weight: bold;
  font-size: 2.4em;
}

</style>

<div class="row indicators">
  <div class="grid grid-cols-4">
    <div class="grid-colspan-2" style="grid-auto-rows: auto;">
      <h3 style="color: red">Aplicación en fase de pruebas, algunos datos pueden ser incorrectos</h3> 
      Datos obtenidos de la API de subvenciones concedidas del portal <a href="https://opendata.euskadi.eus/api-granted-benefits/?api=granted-benefit/">Open Data Euskadi</a>.
    </div>
    <div class="card" style="text-align: right;">
      <h2>Cantidad concedida</h2>
      <p class="indicator-number" style="margin-bottom: 10px; margin-bottom: 0px;">
        ${hp.numberToLocaleString(d3.sum(grantedBenefits, d => d.granted_amount), 'millones')}
      </p>
      <p class="muted" style="margin-top: 5px;">millones €</p>
    </div>
    <div class="card" style="text-align: right;">
      <h2>Número de subvenciones</h2>
      <p class="indicator-number" style="margin-bottom: 10px; margin-bottom: 0px;">
        ${hp.numberToLocaleString(grantedBenefits.length)}
      </p>
    </div>
  </div>
</div>

<div class="row charts">
  <div class="grid grid-cols-4">
    <div class="card" style="overflow: auto;">
      <h2>Concesión por Organismo</h2>
      ${resize((width) =>
        GrantsByConvenerPlot(grantsByConvener, {
          width,
          marginBottom: 35,
          marginLeft: 0,
          marginRight: 5,
          x: {
            label: "Millones €",
            transform: (d) => d / 1000000,
          },
          y: {
            padding: 0.2,
            label: "Organismo",
          },
        })
      )}
    </div>
    <div class="card">
      <h2>Concedido por año</h2>
      ${resize((width) =>
        YearlyPlot(stats.grant_amount_per_year, {
          width,
          marginRight: 0,
          marginLeft: 0,
          y: {
            label: "Millones €",
            transform: (d) => d / 1000000
          }
        })
      )}
    </div>
    <div class="card grid-colspan-2">
      <h2>Concedido por día</h2>
      ${resize((width) =>
        DailyPlot(grantsByDay, {
          width,
          marginRight: 40,
          x: {label: "Fecha"},
          y: {label: "Euros"},
        })
      )}
    </div>
  </div>
</div>

<div class="grid grid-cols-4" style="margin-top: 30px;">
  <div class="card grid-colspan-3">
    <p>${searchInput}</p>
    <div>${grantTableInput}</div>
  </div>

  <div class="card grid-cols-1" style="grid-auto-rows: auto;">${Display.grantSelection(tableSelection)}</div>

</div>

<div class="grid grid-cols-1" style="grid-auto-rows: auto;">
    <row>
      <div style="float: right; text-align: right">
        <p><small>Última actualización: ${hp.getMonthYearDate(config.build_date)}</small></p>
        <span><img src='assets/images/logo_gisteiz.svg' height='60px'/></span>
      </div>
    </row>
</div>

