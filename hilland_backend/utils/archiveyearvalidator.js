function validateYear(year) {
  const currentYear = new Date().getFullYear()
  const minYear = 2014
    
  if (isNaN(year) || year < minYear || year > currentYear) {
    return false
  }
    
  return true
}

module.exports = validateYear

