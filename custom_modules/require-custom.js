const requireCustom = location => name => require(`${location}/${name}`)

module.exports = requireCustom