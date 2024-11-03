import * as Plot from "../../../_npm/@observablehq/plot@0.6.16/e828d8c8.js";
import * as hp from "../helpers.7480c0b4.js";
import * as dict from "../dictionary.1fe078c9.js";

/**
 * Returns a bar chart showing a list of organisms with the amount of
 * subventions granted to each one.
 *
 * Data should be an array of objects with the following properties:
 * - name: the name of the organism
 * - value: the amount granted to the organism
 *
 * Options:
 * - none
 *
 * @param {Object[]} data - array of data points
 * @param {Object} options - options object
 * @returns {Plot} - a Plot instance
 */
export function GrantsByConvenerPlot(data, {...options } = {}) {
  return Plot.plot({
    ...options,
    marks: [
      Plot.gridX({
        ticks: 4,
        strokeDasharray: "0.75,2", // dashed
        strokeOpacity: 1 // opaque
      }),
      
      Plot.barX(data, {
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
        tickSize: 0, // don’t draw ticks
        tickformat: (d) => `${hp.numberToLocaleString(d)}`
      }),
      Plot.axisY({
        label: null,
        fontSize: 12,
        tickSize: 0, // don’t draw ticks
        tickFormat: (d) => '', // (dict.shortNames[d] || d),
        textAnchor: "start",
        dy: 0,
        dx: 20
      }),
      Plot.ruleX([0]),
      Plot.text(data, {
        x: 0,
        y: "name",
        fontSize: 12,
        text: (d) => (dict.shortNames[d.name] || d.name) + ': ' + hp.numberToLocaleString(d.value, 'millones'),
        textAnchor: "start",
        dx: 10
      }),

    ]
  })
}
