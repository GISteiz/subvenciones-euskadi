---
theme: [dashboard, light]
toc: false
---
# Subvenciones en Euskadi

Datos obtenidos de la API de subvenciones concedidas del portal [Open Data Euskadi](https://opendata.euskadi.eus/api-granted-benefits/?api=granted-benefit/).
___

```js
/* Helper functions */

/**
 * Rounds a number to 2 decimal places, avoiding floating point precision issues
 * @param {number} num - number to round
 * @returns {number} - rounded number
 */
function round2(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100
}

function numberToLocaleString(n, amount) {
  n = round2(n)
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

function sparkbarColor(x) {
  if (x >= 0) {
    return '#568bea'
  }
  else {
    return '#c44e52'
  }
}

function sparkbar(max) {
  return (x) => htl.html`<div style="
    background: ${sparkbarColor(x)};
    color: black;
    font: 10px/1.6 var(--sans-serif);
    width: ${100 * Math.abs(x) / max}%;
    float: right;
    padding-right: 3px;
    box-sizing: border-box;
    overflow: visible;
    display: flex;
    justify-content: end;">${numberToLocaleString(x)}`
}
```

```js
/* Load data */

console.log(new Date().toString());
const json_input = await FileAttachment("./data/granted-benefits.json").json(); 

let stats = json_input['stats']
let grantedBenefits = json_input['granted-benefits']
let years = stats.year_range
const zip = await FileAttachment("./data/granted-benefits.zip").zip();
let unzip = {}
for (const i in zip.filenames) {
  const filename = zip.filenames[i]
  unzip[filename] = await zip.file(filename).json();
}
/*
let years = []

let json_input_count = 0
for (const i in json_input) {
  json_input_count += json_input[i].length
}

for (const i in zip.filenames) {
  const filename = zip.filenames[i]
  const year = filename.split('.')[0]
  years.push(year)
  unzip[year] = await zip.file(filename).json();
}
console.log(new Date().toString());
//const year_2015 = await zip.file("2015.json").json();

let grantedBenefits = []
for (const year in unzip) {
  const yearData = unzip[year] // yearData is array
  for (const i in yearData) {
    grantedBenefits.push(yearData[i])
  }
  
}

*/
console.log(new Date().toString());
//console.log(grantedBenefits)
//debugger

//const grantedBenefits = FileAttachment("./data/granted-benefits.json").json();
//const grantedBenefits = FileAttachment("./data/granted-benefits_backup.json").json();
//const grantedBenefitsRaw = FileAttachment("./data/granted-benefits_backup.json").json();
```

```js
function getYearRange() {
  return `Desde ${Math.min(...years)} hasta ${Math.max(...years)}`
}
/*
let year
if (grantedBenefits[0].ISBACKUP) {
//if (grantedBenefitsRaw[0].ISBACKUP) {
  display(html`<h2>BACKUP DATA</h2>`);
  year = grantedBenefits[0].granted_date.split('-')[0];
}
else {
  year = ''
}
*/

// Grants by convener
const grantsByConvener = d3
  .rollups(grantedBenefits, v => d3.sum(v, d => d.granted_amount), d => d.convener_name)
  //.rollups(grantedBenefits, (d) => d.granted_amount, (v) => v.convener_name)
  .map(([name, value]) => ({name, value}))
  .sort((a, b) => d3.descending(a.value, b.value));

function chartGrantsByConvener(width) { //, height) {
  return Plot.plot({
    width,
    //height: height,
    marginBottom: 35,
    marginLeft: 0,
    marginRight: 5,
    x: {
      //tickRotate: -90,
      label: "Millones €",
      transform: (d) => d / 1000000,
      //insetLeft: -25
    },
    y: {
      padding: 0.2,
      label: "Organismo",
      //insetBottom: 10 // reserve space for inset labels
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
          }//,
          //x: 2000
        } // (d) => numberToLocaleString(d.value) //"x"
      }),

      Plot.axisX({
        labelArrow: "none",
        //interval: 20,
        tickSize: 0, // don’t draw ticks
        //dx: 10,
        //dy: -20,
        //tickformat: (d) => `${numberToLocaleString(d)}`
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


function chartGrantAmountPerYear(width, height) {
  return Plot.plot({
    height,
    //marginBottom: 0,
    //marginLeft: 70,
    //marginRight: -230,    //x: {type: "utc", ticks: "year", label: null},
    //y: {grid: true, inset: 10, label: "Degrees (F)"},
    y: {
      label: "Millones €",
      transform: (d) => d / 1000000,
    },
    x: {
      label: "Año",
    },
    marks: [
      //Plot.ruleY([0]),
      Plot.gridY({
        strokeDasharray: "0.75,2", // dashed
        strokeOpacity: 1, // opaque
        //interval: 20
      }),
      Plot.line(stats.grant_amount_per_year, {
        //x: 0,
        //y: 1,
        //z: null, // varying color, not series
        stroke: "#568bea",
        curve: "step",
        tip: {
          fontSize: 14,
          format: {
            y: (d) => `${numberToLocaleString(d)}`,
            x: ''
          }
        }
      }),
      Plot.axisX({
        labelArrow: "none",
        tickSize: 0,
      }),
      Plot.axisY({
        labelArrow: "none",
        tickSize: 0,
      })
    ]
  })
}



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
    granted_amount: sparkbar(d3.max(grantedBenefits, d => d.granted_amount))
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

## ${getYearRange()} | <small style="color: red">Aplicación en fase de pruebas, algunos datos pueden ser incorrectos</small>

```js
//debugger
display('json:')
display(json_input)
display('zip')
display(unzip)
//display(grantsByConvener)
//display(d3.group(grantedBenefits, d => d.convener_name))
```

<div class="grid grid-cols-4" style="max-height: 200px;">
  <div class="card grid-rowspan-2" style="overflow: auto;">
    <h2>Subvenciones por Organismo</h2>
    <!-- ${resize((width, height) => chartGrantsByConvener(width, height*0.9))} -->
    ${resize((width) => chartGrantsByConvener(width))}
  </div>
  <div class="card grid-colspan-2 grid-rowspan-2">
    <h2>Cantidad por año</h2>
    ${resize((width, height) => chartGrantAmountPerYear(width, height))}
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

