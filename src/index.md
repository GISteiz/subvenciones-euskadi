---
theme: [dashboard, light]
toc: false
---
# Subvenciones en Euskadi

Datos obtenidos de la API de subvenciones concedidas del portal [Open Data Euskadi](https://opendata.euskadi.eus/api-granted-benefits/?api=granted-benefit/).
___

```js
//import {DonutChart} from "./components/donutChart.js";
```

```js
function sparkbar(max) {
  return (x) => htl.html`<div style="
    background: #568bea;
    color: black;
    font: 10px/1.6 var(--sans-serif);
    width: ${100 * x / max}%;
    float: right;
    padding-right: 3px;
    box-sizing: border-box;
    overflow: visible;
    display: flex;
    justify-content: end;">${x.toLocaleString("en-US")}`
}
```

```js
const grantedBenefits = FileAttachment("./data/granted-benefits.json").json();
```

```js
//display(grantedBenefits);

let year = 2024


// Bookings by nationality
const grantsByConvener = d3
  .rollups(
    grantedBenefits,
    (d) => d.granted_amount,
    (v) => v.convener_name
  )
  .map(([name, value]) => ({name, value}))
  .sort((a, b) => d3.descending(a.value, b.value));


const grantTable = Inputs.table(grantedBenefits, {
  //placeholder: "Buscar subvenciones…",
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
    granted_amount: sparkbar(d3.max(grantedBenefits, d => d.granted_amount))
  }
});
```

## Año ${year}

<div class="grid grid-cols-4">
  <div class="card grid-rowspan-2">
    ${//resize(width => DonutChart(grantsByConvener, {centerText: "Organismo", width}))}
  </div>
  <div class="card grid-rowspan-2">
    soy
  </div>
  <div class="card grid-rowspan-2">
    GISteiz
  </div>
  <div class="card grid-rowspan-1">
    <h2>Cantidad aportada</h2>
    <p class="big">
      ${d3.sum(grantedBenefits, d => d.granted_amount).toLocaleString("es-ES")} €
    </p>
  </div>
  <div class="card grid-rowspan-1">
    <h2>Numero de subvenciones</h2>
    <p class="big">
      ${grantedBenefits.length}
    </p>
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">${grantTable}</div>
</div>