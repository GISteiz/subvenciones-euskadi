---
title: Visor
theme: [dashboard, light]
toc: false
---

<div class="row">
  <div class="grid grid-cols-1">
    <h1 style="max-width: 840px">Subvenciones en Euskadi | <small> Desde ${Math.min(...stats.year_range)} hasta ${Math.max(...stats.year_range)}</small></h1>
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
//const json_input = await FileAttachment("./data/granted-benefits.json").json();
let unzip = {}
const zip = await FileAttachment("./data/granted-benefits.zip").zip();
for (const i in zip.filenames) {
  const filename = zip.filenames[i]
  unzip[filename] = await zip.file(filename).json();
}
const json_input = unzip['granted-benefits.json']
```

```js
// Global variables
let stats = json_input['stats']
let grantedBenefits = json_input['granted-benefits']
let years = stats.year_range.map( y => y.toString() ) 
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
        <p><small>Última actualización: ${hp.getMonthYearDate(stats.build_date)}</small></p>
        <span><img src='assets/images/logo_gisteiz.svg' height='60px'/></span>
      </div>
    </row>
</div>

