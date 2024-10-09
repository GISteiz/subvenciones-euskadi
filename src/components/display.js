import * as htl from "npm:htl";
import * as hp from "./helpers.js";

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
          <p>Cantidad: ${hp.numberToLocaleString(selection['granted_amount'])} €</p>
          <p>Fecha: ${new Date(selection['granted_date']).toLocaleDateString("es-ES")}</p>
        </div>`
    }
    else { return htl.html`<i>Selecciona una subvención para obtener más información clickando sobre su botón correspondiente a la izquerda de la línea.</i>` }
  }
}