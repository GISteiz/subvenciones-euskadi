---
theme: [dashboard, light]
toc: false
---

# Subvenciones en Euskadi

Datos obtenidos de la API de subvenciones concedidas del portal [Open Data Euskadi](https://opendata.euskadi.eus/api-granted-benefits/?api=granted-benefit/).

___

```js
import {YearlyPlot} from "./components/charts/yearlyPlot.js";
import {GrantsByConvenerPlot} from "./components/charts/grantsByConvenerPlot.js";
import {Sparkbar} from "./components/charts/sparkbar.js";
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

//const dpdnConvenerSelectorInput = Inputs.select(grantedBenefits.map(d => d.convener_name), {sort: true, unique: true, label: "Organismo"})
//TODO: add year and convener selectors

const searchInput = Inputs.search(grantedBenefits, {
  placeholder: "Buscar subvenciones…",
  columns: ["granted_date", "convener_name", "beneficiary_name", "granted_amount", "beneficiary_id"],
});
const search = Generators.input(searchInput);
```

```js
const grantTableInput = Inputs.table(search, {
  columns: ["granted_date", "convener_name", "beneficiary_name", "granted_amount"],
  header: {
    granted_date: "Fecha",
    convener_name: "Convocante",
    beneficiary_name: "Beneficiario",
    granted_amount: "Cantidad (€)"
  },
  sort: "granted_amount",
  reverse: true,
  width: {
    granted_date: "10%",
    convener_name: "20%",
    beneficiary_name: "50%",
    granted_amount: "20%"
  },
  format: {
    convener_name: d => htl.html`<span style="white-space:normal">${d}`,
    beneficiary_name: d => htl.html`<span style="white-space:normal">${d}`,
    granted_amount: Sparkbar(d3.max(grantedBenefits, d => d.granted_amount))
  },
  multiple: false
});

const tableSelection = Generators.input(grantTableInput);

function showSelection(selection) {
  if (selection) {
    console.log(selection['oid'])
    return htl.html`
      <p>${selection['beneficiary_name']} | ${selection['beneficiary_id']}</p>
      <p>${selection['name']}</p>
      <p>${selection['convener_name']}</p>`
  }
  else { return '' }
}

```

## Desde ${Math.min(...years)} hasta ${Math.max(...years)} | <small style="color: red">Aplicación en fase de pruebas, algunos datos pueden ser incorrectos</small>

```js
//debugger
display('json:')
display(json_input)

if (Object.keys(unzip).length > 0) {
  display('zip')
  display(unzip)
}
//display(grantsByConvener)
//display(d3.group(grantedBenefits, d => d.convener_name))
```


<div class="row indicators">
  <div class="grid grid-cols-4">
    <div class="card">
      <h2>Cantidad aportada</h2>
      <p class="big" style="margin-bottom: 5px;">
        ${hp.numberToLocaleString(d3.sum(grantedBenefits, d => d.granted_amount), 'millones')}
      </p>
      <p class="small" style="margin-top: 5px;">millones €</p>
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
      <h2>Cantidad por año</h2>
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
      <h2>placeholder for chart</h2>
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
  <div class="card grid-colspan-2">${showSelection(tableSelection)}</div>
  <div class="card grid-colspan-2" >
    <p style="float: right;">Última actualización: ${stats.build_date}</p>
  </div>
</div>

