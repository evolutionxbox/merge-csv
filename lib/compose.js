const compose = (...functions) =>
  functions.reverse().reduce((prevFunction, nextFunction) =>
    value => nextFunction(prevFunction(value)),
    value => value
  )

module.exports = compose