import * as Plot from "npm:@observablehq/plot";
import * as hp from "../helpers.js";
import * as dict from "../dictionary.js";



export function GrantsByConvenerPlot(data, {...options } = {}) {
  return Plot.plot({
    ...options,
    //round,
    marks: [
      //Plot.ruleX([0]),
      Plot.gridX({
        strokeDasharray: "0.75,2", // dashed
        strokeOpacity: 1, // opaque
        //interval: 20
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
          fontSize: 14,
          format: {
            x: (d) => `${hp.numberToLocaleString(d)}` 
          }//,
            //x: 2000
        } // (d) => hp.numberToLocaleString(d.value) //"x"
      }),
              
      Plot.axisX({
        labelArrow: "none",
        //interval: 20,
        tickSize: 0, // don’t draw ticks
        //dx: 10,
        //dy: -20,
        tickformat: (d) => `${hp.numberToLocaleString(d)}`
      }),
      Plot.axisY({
        label: null,
        //fontFamily : "",
        fontSize: 12,
        tickSize: 0, // don’t draw ticks
        tickFormat: (d) => dict.shortNames[d] || d,
        textAnchor: "start",
        dy: 0,
        dx: 20
        }),
   
      //Plot.tip(grantsByConvener, Plot.pointerX({x: "value", y: "name"}))
    ]
  })
}
