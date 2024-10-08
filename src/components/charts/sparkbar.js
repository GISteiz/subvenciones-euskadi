import * as hp from "../helpers.js";
import * as htl from "npm:htl";

function sparkbarColor(x) {
  if (x >= 0) {
    return '#568bea'
  }
  else {
    return '#c44e52'
  }
}

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