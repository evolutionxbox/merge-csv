#!/usr/bin/env node
'use strict';

// Node requires
const csv = require('fast-csv')
const fs = require('fs')
const camelcase = require('camelcase')
const chalk = require('chalk')

// Custom requires
const templateEngine = require('./lib/template-engine')
const onlyAlphanumeric = require('./lib/only-alphanumeric')
const compose = require('./lib/compose')

// Node CLI Arguements
const argv = require('yargs')
  .usage(chalk.yellow('Usage: merge-csv -data path/to/data.csv -template path/to/template.csv -output path/to/ouput/'))
  .option(chalk.green('data'), {
    alias: chalk.green('d'),
    demandOption: true,
    describe: 'Relative or absolute path to the data CSV file',
    type: ''
  })
  .option(chalk.green('template'), {
    alias: chalk.green('t'),
    demandOption: true,
    describe: 'Relative or absolute path to the template CSV file',
    type: ''
  })
  .option(chalk.green('output'), {
    alias: chalk.green('o'),
    demandOption: false,
    default: './merged/',
    describe: 'Relative or absolute path to the output folder',
    type: ''
  })
  .help(chalk.blue('h'), 'Show this help')
  .alias(chalk.blue('h'), chalk.blue('help'))
  .epilog(chalk.yellow('Please email info@joncousins.co.uk with any bugs'))
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
