import * as htl from "npm:htl";

export const Display = {
  grantSelection: function (selection) {
    if (selection) {
      console.log(selection['oid'])
      return htl.html`
        <p>${selection['beneficiary_name']} | ${selection['beneficiary_id']}</p>
        <p>${selection['name']}</p>
        <p>${selection['convener_name']}</p>`
    }
    else { return '' }
  }
}