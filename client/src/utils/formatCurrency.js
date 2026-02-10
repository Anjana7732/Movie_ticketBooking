import { COUNTRIES } from '../config/countries.js'

export function getCurrencyForCountry(countryCode) {
  const country = COUNTRIES[countryCode]
  if (!country) {
    return { symbol: '₹', code: 'INR' }
  }
  return { symbol: country.currencySymbol, code: country.currencyCode }
}

export function formatCurrency(amount, countryCode) {
  const { symbol } = getCurrencyForCountry(countryCode)
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    return `${symbol}0`
  }
  return `${symbol}${amount.toFixed(0)}`
}

