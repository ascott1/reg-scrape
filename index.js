#!/usr/bin/env node
var request = require('request');
var cheerio = require('cheerio');

// remove nod and path from the arguments
var args = process.argv.slice(2);
var url = 'http://www.gpo.gov/fdsys/browse/collectionCfr.action?selectedYearFrom=2014&go=Go'

request(url, function (error, response, html) {
  if (!error && response.statusCode == 200) {
    console.log(html);
  }
});