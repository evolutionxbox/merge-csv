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
