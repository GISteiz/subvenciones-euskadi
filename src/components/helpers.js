/* Helper functions */

/**
 * Rounds a number to 2 decimal places, avoiding floating point precision issues
 * @param {number} num - number to round
 * @returns {number} - rounded number
 */
export function round2(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100
}


/**
 * Formats a number according to the locale, with the possibility to divide by a given amount and add a suffix
 * @param {number} n - number to format
 * @param {string} amount - amount to divide the number, either 'millones' or 'miles'
 * @param {boolean} [suffix=false] - whether to add the amount as a suffix
 * @returns {string} - formatted number
 */
export function numberToLocaleString(n, amount, suffix=false) {
  if (amount == 'millones') {
    return round2(n / 1000000).toLocaleString("es-ES") + ' ' + (suffix ? amount : '')
  }
  else if (amount == 'miles') {
    return round2(n / 1000).toLocaleString("es-ES") + ' ' + (suffix ? amount : '')
  }
  else { 
    return round2(n).toLocaleString("es-ES")
  }
}

export function getMonthYearDate(dateStr) {
  const date = dateStr.split('/')
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return `${months[date[1]-1]} de ${date[2]}`
}