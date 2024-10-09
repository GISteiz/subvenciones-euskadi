---
title: Subvenciones en Euskadi
theme: [dashboard, light]
toc: false
---

<div class="row indicators">
  <div class="grid grid-cols-1">
    <h1 style="max-width: 840px">Subvenciones en Euskadi | <small> Desde ${Math.min(...years)} hasta ${Math.max(...years)}</small></h1>
  </div>
</div>

<h3 style="color: red">Aplicación en fase de pruebas, algunos datos pueden ser incorrectos</h3> 

Datos obtenidos de la API de subvenciones concedidas del portal [Open Data Euskadi](https://opendata.euskadi.eus/api-granted-benefits/?api=granted-benefit/).

___

```js
import {YearlyPlot} from "./components/charts/yearlyPlot.js";
import {DailyPlot} from "./components/charts/dailyPlot.js";
import {GrantsByConvenerPlot} from "./components/charts/grantsByConvenerPlot.js";
import {GrantSearch} from "./components/inputs/grantSearch.js";
import {GrantTable} from "./components/inputs/grantTable.js";
import {Display} from "./components/display.js";

import * as hp from "./components/helpers.js";
import * as dict from "./components/dictionary.js";
```

```js
console.log(new Date().toString());
const json_input = await FileAttachment("./data/granted-benefits.json").json(); 
let unzip = {}
/*
const zip = await FileAttachment("./data/granted-benefits.zip").zip();
for (const i in zip.filenames) {
  const filename = zip.filenames[i]
  unzip[filename] = await zip.file(filename).json();
}
*/
console.log(new Date().toString());
```

```js
// Global variables
let stats = json_input['stats']
let grantedBenefits = json_input['granted-benefits']
let years = stats.year_range
```

```js
// Data processing
const grantsByConvener = d3
  .rollups(grantedBenefits, v => d3.sum(v, d => d.granted_amount), d => d.convener_name)
  //.rollups(grantedBenefits, (d) => d.granted_amount, (v) => v.convener_name)
  .map(([name, value]) => ({name, value}))
  .sort((a, b) => d3.descending(a.value, b.value));

const grantsByDay = d3
  .rollups(grantedBenefits, v => d3.sum(v, d => d.granted_amount), d => new Date(d.granted_date))
  //.rollups(grantedBenefits, (d) => d.granted_amount, (v) => v.convener_name)
  .map(([date, value]) => ({date, value}))

display(grantsByDay)
```

```js
// Search Input

//TODO: add year and convener selectors

//const dpdnConvenerSelectorInput = Inputs.select(grantedBenefits.map(d => d.convener_name), {sort: true, unique: true, label: "Organismo"})

const searchInput = GrantSearch(grantedBenefits, Inputs);
const search = Generators.input(searchInput);
```

```js
//Table Input
const grantTableInput = GrantTable(search, Inputs)
const tableSelection = Generators.input(grantTableInput);
```

```js
/*
//debugger
display('json:')
display(json_input)

if (Object.keys(unzip).length > 0) {
  display('zip')
  display(unzip)
}
//display(grantsByConvener)
//display(d3.group(grantedBenefits, d => d.convener_name))
*/
```

<div class="row indicators">
  <div class="grid grid-cols-4">
    <div class="card">
      <h2>Cantidad aportada</h2>
      <p class="big" style="margin-bottom: 5px;">
        ${hp.numberToLocaleString(d3.sum(grantedBenefits, d => d.granted_amount), 'millones')}
      </p>
      <p class="muted" style="margin-top: 5px;">millones €</p>
    </div>
    <div class="card">
      <h2>Número de subvenciones</h2>
      <p class="big">
        ${hp.numberToLocaleString(grantedBenefits.length)}
      </p>
    </div>
    <div class="card">
      <h2>placeholder for indicator</h2>
    </div>
    <div class="card">
      <h2>placeholder for indicator</h2>
    </div>
  </div>
</div>

<div class="row charts">
  <div class="grid grid-cols-4">
    <div class="card" style="overflow: auto;">
      <h2>Subvenciones por Organismo</h2>
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
          //y: {label: "Concedido"},
        })
      )}
    </div>
  </div>
</div>

<div class="grid grid-cols-1" style="margin-top: 30px;">
  <div class="card">
    <p>${searchInput}</p>
    <div>${grantTableInput}</div>
  </div>
</div>

<div class="grid grid-cols-4" style="grid-auto-rows: auto;">
  <div class="card grid-colspan-2">${Display.grantSelection(tableSelection)}</div>
  <div class="card grid-colspan-2" >
    <p style="float: right;">Última actualización: ${stats.build_date}</p>
  </div>
</div>

