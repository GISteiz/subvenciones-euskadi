/* Helper functions */

/**
 * Rounds a number to 2 decimal places, avoiding floating point precision issues
 * @param {number} num - number to round
 * @returns {number} - rounded number
 */
export function round2(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100
}


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