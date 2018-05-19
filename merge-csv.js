#!/usr/bin/env node
'use strict';

// Node requires
const csv = require('fast-csv')
const fs = require('fs')
const camelcase = require('camelcase')

// Custom requires
const requirer = require('./custom_modules/require-custom')(`${__dirname}/custom_modules`)
const templateEngine = requirer('template-engine')
const onlyAlphanumeric = requirer('only-alphanumeric')
const compose = requirer('compose')

// Node CLI Arguements
const args = [...process.argv]
const data = args[2]
const template = args[3]
const writeFolder = `${args[4]}/` || `${__dirname}/_merged/`

if (!fs.existsSync(data)) {
  throw new Error('data file must exist!')
}

if (!fs.existsSync(template)) {
  throw new Error('template file must exist!')
}

if (!fs.existsSync(writeFolder)) {
  try {
    fs.mkdirSync(writeFolder)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

// Encoding of files
const streamOptions = {
  encoding: 'utf8'
}

// Streams
const dataStream = fs.createReadStream(data, streamOptions)
const templateStream = fs.createReadStream(template, streamOptions)

// Compose useful things
const camelcaseAlphanumeric = compose(camelcase, onlyAlphanumeric)

templateStream
  .on('data', template => {

    csv
      .fromStream(dataStream, { headers: true })
      .on('data', church => {

        const writeFile = `${output}${camelcaseAlphanumeric(church.churchname)}-merged.csv`
        const writeStream = fs.createWriteStream(writeFile)

        writeStream.write(templateEngine(template, church))
        writeStream.end()
      })

  })
