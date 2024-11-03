import * as htl from "../../_npm/htl@0.3.1/063eb405.js";
import * as hp from "./helpers.7480c0b4.js";

export const Display = {

  grantSelection: function (selection) {
    if (selection) {
      //console.log(selection['oid'])
      return htl.html`
        <div class="selection">
          <h2 style="font-weight: bold">${selection['beneficiary_name']}</h2>
          ${selection['beneficiary_id']}
          <p>Subvencion: ${selection['name']}</p>
          <p>Convocante: ${selection['convener_name']}</p>
          <p>Cantidad: <span class="indicator-number">${hp.numberToLocaleString(selection['granted_amount'])} €</span></p>
          <p>Fecha: ${new Date(selection['granted_date']).toLocaleDateString("es-ES")}</p>
        </div>`
    }
    else { return htl.html`<i>Selecciona una subvención para obtener más información clickando sobre su botón correspondiente a la izquerda de la línea.</i>` }
  }
}