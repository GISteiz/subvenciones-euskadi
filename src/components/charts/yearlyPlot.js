import * as Plot from "npm:@observablehq/plot";
import * as hp from "../helpers.js";

export function YearlyPlot(data, { round = true, ...options } = {}) {
  return Plot.plot({
    ...options,
    round,
    marks: [
      Plot.gridY({
        strokeDasharray: "0.75,2", // dashed
        strokeOpacity: 1, // opaque
      }),
      Plot.axisY({anchor: "right", labelArrow: "none", tickSize: 0, label: null}),
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
