import * as Plot from "../../../_npm/@observablehq/plot@0.6.16/e828d8c8.js";
import * as hp from "../helpers.7480c0b4.js";

/**
 * Returns a bar chart showing a yearly summary of the given data.
 *
 * Data should be an array of objects with the following properties:
 * - year: the year of the data point
 * - value: the value of the data point
 *
 * Options:
 * - round: if true (default), rounds bar values to the nearest integer (disabled)
 *
 * @param {Object[]} data - array of data points
 * @param {Object} options - options object
 * @returns {Plot} - a Plot instance
 */
export function YearlyPlot(data, { round = true, ...options } = {}) {
  return Plot.plot({
    ...options,
    //round,
    x: {insetLeft: 26},
    marks: [
      Plot.gridY({
        ticks: 4,
        strokeDasharray: "0.75,2", // dashed
        strokeOpacity: 1, // opaque
      }),
      Plot.axisY({
        ticks: 4,
        labelArrow: "none",
        anchor: "left",
        tickSize: 0,
        label: null,
        tickFormat: (d) => `${hp.numberToLocaleString(d)}`,
        dx: 30, // offset right
        dy: -6, // offset up
      }),
      Plot.axisX({
        labelArrow: "none",
        tickSize: 0,
        label: null,
        tickFormat: (d) => `${hp.numberToLocaleString(d)}`
      }),
      Plot.barY(data, {
        x: "year",
        y: "value",
        fillOpacity: 0.2,
        tip: {
          fontSize: 12,
          format: {
            y: (d) => `${hp.numberToLocaleString(d)}`,
            x: null // remove year from tooltip
          }
        }
      }),
      Plot.ruleY([0])
    ]
  })
}
