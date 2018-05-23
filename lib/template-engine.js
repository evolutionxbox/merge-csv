const templateEngine = (string, data) => {
  let output = string

  for (const property in data) {
    const regex = new RegExp(`{{${property}}}`, 'gi')
    output = output.replace(regex, data[property])
  }

  return output
}

module.exports = templateEngine