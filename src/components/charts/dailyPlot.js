import * as Plot from "npm:@observablehq/plot";
import * as hp from "../helpers.js";
import * as htl from "npm:htl";

/**
 * Returns an area chart showing the value of granted benefits per day.
 *
 * Data should be an array of objects with the following properties:
 * - date: the date of the data point
 * - value: the value of the data point
 *
 * Options:
 * - round: if true (default), rounds bar values to the nearest integer
 *
 * @param {Object[]} data - array of data points
 * @param {Object} options - options object
 * @returns {Plot} - a Plot instance
 */
export function DailyPlot(data, { round = true, ...options } = {}) {

  return Plot.plot({
    ...options,
    round,
    marks: [
      Plot.axisX({
        labelArrow: "none"
      }),
      Plot.axisY({
        anchor: "right",
        label: "Miles €",
        labelArrow: "none",
        ticks: 6,
        tickFormat: (d) => `${hp.numberToLocaleString(d, "miles")}`,
      }),
      Plot.areaY(data, {
        x: "date",
        y: "value",
        curve: "step",
        fillOpacity: 0.2,
        tip: {
          fontSize: 12,
          format: {
            y: (d) => `${hp.numberToLocaleString(d)} €`,
            x: (d) => d.toLocaleDateString()
          }
        }
      }),
      Plot.ruleY([0])
    ]
  })
}
