import * as Plot from "npm:@observablehq/plot";
import * as hp from "../helpers.js";
import * as htl from "npm:htl";


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
      Plot.areaY(data, {x: "date", y: "value", curve: "step", fillOpacity: 0.2}),
      Plot.ruleY([0]),
      Plot.tip(data, Plot.pointerX({
        x: "date",
        y: "value",
        title: (d) => [d.date.toLocaleDateString(), hp.numberToLocaleString(d.value)].join("\n\n")
      }),
      )
    ]
  })
}
