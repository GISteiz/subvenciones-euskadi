import * as d3 from "../../../_npm/d3@7.9.0/7055d4c5.js";
import * as htl from "../../../_npm/htl@0.3.1/063eb405.js";
import { Sparkbar } from "../charts/sparkbar.e2c4d429.js";
import * as dict from "../dictionary.1fe078c9.js";

/**
 * Returns a short name for the given name, if it exists in the dictionary of short names.
 * Otherwise, it returns the original name.
 * @param {string} name - full name to shorten
 * @returns {string} - short name if one exists, otherwise the original name
 */
function getShortName(name) {
  return dict.shortNames[name] || name;
}

/**
 * Generates a table with columns for granted date, convener name, beneficiary name, and granted amount.
 * The table is sorted in descending order by granted amount, and the columns have different widths.
 * The granted date is formatted as a locale-specific date string, and the convener name is shortened
 * if it exists in the dictionary of short names.
 * @param {Object[]} data - array of objects containing the data for the table
 * @param {Object} Inputs - object containing the Inputs.table function
 * @returns {Object} - an object representing the table
 */
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
      convener_name: d => htl.html`<span style="white-space:normal">${getShortName(d)}`,
      beneficiary_name: d => htl.html`<span style="white-space:normal">${d}`,
      granted_amount: Sparkbar(d3.max(data, d => d.granted_amount))
    },
    multiple: false
  });
}