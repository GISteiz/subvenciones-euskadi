import * as hp from "../helpers.7480c0b4.js";

/**
 * Creates a search input for the granted benefits data.
 * @param {Object[]} data the array of granted benefits
 * @param {Object} Inputs the Inputs module to use
 * @returns {Object} the search input
 */
export function GrantSearch(data, Inputs) {
  return Inputs.search(data, {
    placeholder: "Buscar subvenciones…",
    format: (d) => hp.numberToLocaleString(d) + ' resultados',
    columns: ["granted_date", "convener_name", "beneficiary_name", "granted_amount", "beneficiary_id"]
  })
}