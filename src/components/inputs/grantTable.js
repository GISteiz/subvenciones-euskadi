import * as d3 from "npm:d3";
import * as htl from "npm:htl";
import { Sparkbar } from "../charts/sparkbar.js";

export function GrantTable(data, Inputs) {
  return Inputs.table(data, {
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
      granted_date: d => htl.html`<span style="white-space:normal">${new Date(d).toLocaleDateString("es-ES")}`,
      convener_name: d => htl.html`<span style="white-space:normal">${d}`,
      beneficiary_name: d => htl.html`<span style="white-space:normal">${d}`,
      granted_amount: Sparkbar(d3.max(data, d => d.granted_amount))
    },
    multiple: false
  });
}