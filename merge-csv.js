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
const argv = require('yargs')
  .usage('Usage: merge-csv -data path/to/data.csv -template path/to/template.csv -output path/to/ouput/')
  .option('data', {
    alias: 'd',
    demandOption: true,
    describe: 'Relative or absolute path to the data CSV file',
    type: ''
  })
  .option('template', {
    alias: 't',
    demandOption: true,
    describe: 'Relative or absolute path to the template CSV file',
    type: ''
  })
  .option('output', {
    alias: 'o',
    demandOption: false,
    default: './merged/',
    describe: 'Relative or absolute path to the output folder',
    type: ''
  })
  .help('h', 'Show this help')
  .alias('h', 'help')
  .epilog('Please email info@joncousins.co.uk with any bugs')
  .argv

const { data, template, output } = argv

if (!fs.existsSync(data)) {
  throw new Error('data file must exist!')
}

if (!fs.existsSync(template)) {
  throw new Error('template file must exist!')
}

if (!fs.existsSync(output)) {
  try {
    fs.mkdirSync(output)
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
