export function GrantSearch(data, Inputs) {
  return Inputs.search(data, {
    placeholder: "Buscar subvenciones…",
    columns: ["granted_date", "convener_name", "beneficiary_name", "granted_amount", "beneficiary_id"]
  })
}