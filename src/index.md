---
theme: [dashboard]
toc: false
---

# Subvenciones en Euskadi

Datos obtenidos de la API de subvenciones concedidas del portal [Open Data Euskadi](https://opendata.euskadi.eus/api-granted-benefits/?api=granted-benefit/).

```js
function sparkbar(max) {
  return (x) => htl.html`<div style="
    background: var(--theme-blue);
    color: white;
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
  format: {
    granted_amount: sparkbar(d3.max(grantedBenefits, d => d.granted_amount))
  }
});
```

<div class="grid grid-cols-1">
  <div class="card">${grantTable}</div>
</div>