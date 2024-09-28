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
let year = 2023

// Grants by convener
const grantsByConvener = d3
  .rollups(grantedBenefits, v => d3.sum(v, d => d.granted_amount), d => d.convener_name)
  //.rollups(grantedBenefits, (d) => d.granted_amount, (v) => v.convener_name)
  .map(([name, value]) => ({name, value}))
  .sort((a, b) => d3.descending(a.value, b.value));

/*
function grantsByConvenerChart(width, height) {
  return Plot.plot({
    width,
    height: height,
    //marginBottom: 100,
    marginLeft: 0,
    marginRight: 0,
    x: {
      //tickRotate: -90,
      label: "Organismo",
      padding: 0.7,
      insetLeft: 36 // reserve space for inset labels
    },
    y: {
      transform: (d) => d / 1000000,
      label: "Millones €"
    },
    marks: [
      //Plot.ruleY([0]),

      Plot.gridY({
        strokeDasharray: "0.75,2", // dashed
        strokeOpacity: 1, // opaque
        interval: 20
      }),

      Plot.barY(grantsByConvener, {
        x: "name",
        y: "value",
        sort: { x: "y", reverse: true },
        fill: "black",
        dx: 4,
        dy: 4
      }),
      Plot.barY(grantsByConvener, {
        x: "name",
        y: "value",
        sort: { x: "y", reverse: true },
        fill: "#568bea",
        dx: 0,
        dy: 0,
        textAnchor: "start"
      }),

      Plot.axisY({
        labelArrow: "none",
        interval: 20,
        tickSize: 0, // don’t draw ticks
        dx: 38,
        dy: -6,
        lineAnchor: "bottom" // draw labels above grid lines
        //tickFormat
      }),

      Plot.axisX({
        //fontFamily : "",
        fontSize: 10,
        //fontWeight: "bold",
        //textStroke: "white",
        //textStrokeWidth: 1,
        //textStrokeOpacity: 1,
        tickSize: 0, // don’t draw ticks
        rotate: 270,
        textAnchor: "start",
        dy: -20
      }),
    ]
  })
}
*/


function grantsByConvenerChart(width, height) {
  return Plot.plot({
    width,
    //height: height,
    //marginBottom: 100,
    //marginLeft: 0,
    //marginRight: 0,
    x: {
      //tickRotate: -90,
      label: "Millones €",
      transform: (d) => d / 1000000,
    },
    y: {
      padding: 0.4,
      label: "Organismo",
      insetBottom: 10 // reserve space for inset labels
    },
    marks: [
      //Plot.ruleX([0]),
      
      Plot.gridX({
        strokeDasharray: "0.75,2", // dashed
        strokeOpacity: 1, // opaque
        interval: 20
      }),

      /*
      Plot.barX(grantsByConvener, {
        x: "value",
        y: "name",
        sort: { y: "x", reverse: true },
        fill: "black",
        dx: 4,
        dy: 4
      }),*/
      Plot.barX(grantsByConvener, {
        x: "value",
        y: "name",
        sort: { y: "x", reverse: true },
        fill: "#568bea",
        dx: 0,
        dy: 0,
        textAnchor: "start"
      }),

      Plot.axisX({
        labelArrow: "none",
        interval: 20,
        tickSize: 0, // don’t draw ticks
        dx: 10,
        dy: -20,
        //lineAnchor: "bottom" // draw labels above grid lines
        //tickFormat
      }),

      Plot.axisY({
        //fontFamily : "",
        fontSize: 10,
        //fontWeight: "bold",
        //textStroke: "white",
        //textStrokeWidth: 1,
        //textStrokeOpacity: 1,
        tickSize: 0, // don’t draw ticks
        textAnchor: "start",
        dy: 0,
        dx: 20
      }),
      /*
      */
    ]
  })
}




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

```js
display(grantedBenefits)
display(grantsByConvener)

display(d3.group(grantedBenefits, d => d.convener_name))
```

<div class="grid grid-cols-4">
  <div class="card grid-colspan-2 grid-rowspan-2">
    ${resize((width, height) => grantsByConvenerChart(width, height))}
  </div>
  <div class="card grid-rowspan-2">
    <!--${resize((width) => grantsByConvenerChart(width))}-->
  </div>
  <div class="card grid-rowspan-1">
    <h2>Cantidad aportada</h2>
    <p class="big">
      ${d3.sum(grantedBenefits, d => d.granted_amount).toLocaleString("es-ES")} €
    </p>
  </div>
  <div class="card grid-rowspan-1">
    <h2>Número de subvenciones</h2>
    <p class="big">
      ${grantedBenefits.length}
    </p>
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">${grantTable}</div>
</div>