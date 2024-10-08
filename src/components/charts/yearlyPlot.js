import * as Plot from "npm:@observablehq/plot";
import * as hp from "../helpers.js";

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
      Plot.axisX({labelArrow: "none", tickSize: 0, label: null}),
      Plot.barY(data, {
        x: "year",
        y: "value",
        fillOpacity: 0.2,
        tip: {
          fontSize: 14,
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
