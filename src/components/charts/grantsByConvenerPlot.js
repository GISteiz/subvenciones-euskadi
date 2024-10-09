import * as Plot from "npm:@observablehq/plot";
import * as hp from "../helpers.js";
import * as dict from "../dictionary.js";



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
        textAnchor: "start",
        tip: {
          fontSize: 12,
          format: {
            x: (d) => `${hp.numberToLocaleString(d)}` 
          }
        }
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
        tickFormat: (d) => dict.shortNames[d] || d,
        textAnchor: "start",
        dy: 0,
        dx: 20
        })
      //Plot.tip(grantsByConvener, Plot.pointerX({x: "value", y: "name"}))
    ]
  })
}
