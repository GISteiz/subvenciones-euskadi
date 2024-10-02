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
function numberToLocaleString(n, amount) {
  n = Math.round((n + Number.EPSILON) * 100) / 100
  if (amount == 'millones') {
    return (n / 1000000).toLocaleString("es-ES") + ' ' + amount
  }
  else if (amount == 'miles') {
    return (n / 1000).toLocaleString("es-ES") + ' ' + amount
  }
  else { 
    return n.toLocaleString("es-ES")
  }
}

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
    justify-content: end;">${numberToLocaleString(x)}`
}



```

```js
//const grantedBenefits = FileAttachment("./data/granted-benefits.json").json();
//const grantedBenefits = FileAttachment("./data/granted-benefits_backup.json").json();
const grantedBenefitsRaw = FileAttachment("./data/granted-benefits_backup.json").json();
```

```js
let grantedBenefits = []
grantedBenefitsRaw.forEach(grant => {
  grantedBenefits.push({
    "convener_name": grant["convener_name"],
    "convener_id": grant["convener"]["organization"]["id"],
    "beneficiary_name": grant["beneficiary_name"].trim(), //remove trailing spaces
    "beneficiary_id": grant["beneficiary"]["id"],
    "granted_date": grant["granted_date"],
    "granted_amount": grant["granted_amount"],
  })
});
```

```js
let year
if (grantedBenefitsRaw[0].ISBACKUP) {
  display(html`<h2>BACKUP DATA</h2>`);
  year = grantedBenefits[0].granted_date.split('-')[0];
}
else {
  year = '????'
}

// Grants by convener
const grantsByConvener = d3
  .rollups(grantedBenefits, v => d3.sum(v, d => d.granted_amount), d => d.convener_name)
  //.rollups(grantedBenefits, (d) => d.granted_amount, (v) => v.convener_name)
  .map(([name, value]) => ({name, value}))
  .sort((a, b) => d3.descending(a.value, b.value));

function grantsByConvenerChart(width, height) {
  return Plot.plot({
    width,
    height: height,
    marginBottom: 20,
    marginLeft: 0,
    marginRight: 0,
    x: {
      //tickRotate: -90,
      label: "Millones €",
      transform: (d) => d / 1000000,
      //insetLeft: -25
    },
    y: {
      padding: 0.2,
      label: "Organismo",
      insetBottom: 10 // reserve space for inset labels
    },
    marks: [
      //Plot.ruleX([0]),
      
      Plot.gridX({
        strokeDasharray: "0.75,2", // dashed
        strokeOpacity: 1, // opaque
        //interval: 20
      }),

      Plot.barX(grantsByConvener, {
        x: "value",
        y: "name",
        sort: { y: "x", reverse: true },
        fill: "#568bea",
        dx: 0,
        dy: 0,
        textAnchor: "start",
        tip: {
          fontSize: 14,
          format: {
            x: (d) => `${numberToLocaleString(d)}` 
          }
        } // (d) => numberToLocaleString(d.value) //"x"
      }),

      Plot.axisX({
        labelArrow: "none",
        //interval: 20,
        tickSize: 0, // don’t draw ticks
        dx: 10,
        dy: -20,
      }),
      Plot.axisY({
        label: null,
        //fontFamily : "",
        fontSize: 12,
        tickSize: 0, // don’t draw ticks
        textAnchor: "start",
        dy: 0,
        dx: 20
      }),

      //Plot.tip(grantsByConvener, Plot.pointerX({x: "value", y: "name"}))
    ]
  })
}



//const dpdnConvenerSelectorInput = Inputs.select(grantedBenefits.map(d => d.convener_name), {sort: true, unique: true, label: "Organismo"})
//TODO: add year and convener selectors

const searchInput = Inputs.search(grantedBenefits, {
  placeholder: "Buscar subvenciones…",
  columns: ["granted_date", "convener_name", "beneficiary_name", "granted_amount"]
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
    granted_amount: sparkbar(d3.max(grantedBenefits, d => d.granted_amount))
  },
  multiple: false
});

const tableSelection = Generators.input(grantTableInput);

function showSelection(selection, field) {
  if (selection) {
    console.log(selection[field])
    return selection[field]
  }
  else { return '' }
}

```

## Año ${year}

```js
display(grantedBenefits)
display(grantsByConvener)
display(d3.group(grantedBenefits, d => d.convener_name))
```

<div class="grid grid-cols-4">
  <div class="card grid-rowspan-2">
    <h2>Subvenciones por Organismo</h2>
    ${resize((width, height) => grantsByConvenerChart(width, height*0.9))}
  </div>
  <div class="card grid-colspan-2 grid-rowspan-2">
    <h2>Cantidad por año</h2>
    <!--${resize((width) => grantsByConvenerChart(width))}-->
  </div>
  <!--div class="card grid-rowspan-2">
  </div-->
  <div class="card grid-rowspan-1">
    <h2>Cantidad aportada</h2>
    <p class="big">
      ${numberToLocaleString(d3.sum(grantedBenefits, d => d.granted_amount), 'millones')} €
    </p>
  </div>
  <div class="card grid-rowspan-1">
    <h2>Número de subvenciones</h2>
    <p class="big">
      ${numberToLocaleString(grantedBenefits.length)}
    </p>
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    <p>${searchInput}</p>
    <div>${grantTableInput}</div>
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    <p>${showSelection(tableSelection, 'beneficiary_name')}</p>
  </div>
</div>

