import * as hp from "../helpers.7480c0b4.js";
import * as htl from "../../../_npm/htl@0.3.1/063eb405.js";

/**
 * Returns a color for a spark bar based on the value of `x`.
 * Returns `#568bea` for positive values and `#c44e52` for negative values.
 * @param {number} x - the value to determine the color for
 * @returns {string} the color to use for the spark bar
 */
function sparkbarColor(x) {
  if (x >= 0) {
    return '#568bea'
  }
  else {
    return '#c44e52'
  }
}

/**
 * Creates a spark bar component.
 * @param {number} max - the maximum value to map the width of the spark bar to.
 * @returns {function(number): HTMLDivElement} a function that takes a number and returns a <div> element which is a spark bar.
 */
export function Sparkbar(max) {
  return (x) => htl.html`<div style="
    background: ${sparkbarColor(x)};
    color: black;
    font: 10px/1.6 var(--sans-serif);
    width: ${100 * Math.abs(x) / max}%;
    float: right;
    padding-right: 3px;
    box-sizing: border-box;
    overflow: visible;
    display: flex;
    justify-content: end;">${hp.numberToLocaleString(x)}`
}