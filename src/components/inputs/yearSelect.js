export function YearSelect(data, Inputs) {
  return Inputs.select(['Seleccionar año'].concat(data), {value: "Seleccionar año", label: "Año"})
}
