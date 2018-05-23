const onlyAlphanumeric = string => {
  const regex = /[^a-z0-9]+/gi
  string = string.replace(regex, '')
  return string
}

module.exports = onlyAlphanumeric