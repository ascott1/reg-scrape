#!/usr/bin/env node
var http = require('http');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var mkdirp = require('mkdirp');

var args = process.argv.slice(2);
var year;

if (args.length > 0) {
  year = args[0];
} else {
  year = new Date().getFullYear();
}

var url = 'http://www.gpo.gov/fdsys/browse/collectionCfr.action?selectedYearFrom=' + year + '&go=Go';

function makeDir(){
  mkdirp('./text', function (err) {
    if (err) console.error(err);
  });
}

function writeFiles(err, fileName, fileContent) {
  fs.writeFile('text/' + fileName, fileContent, function(err) {
    if(err) console.error(err);
    else console.log(fileName + ' was saved!');
  });
}

function saveFiles(links) {
  links.forEach(function(regURL) {
    var simpleFileName = regURL.split('/').slice(-1)[0].split('.').slice(0)[0] + '.txt';
    request(regURL, function (error, response, html) {
      writeFiles(error, simpleFileName, html);
    });
  });
}

function getURLs ($, type) {
  var linkList = [];

  $('.cfr-download-links a:contains("Text")').each(function(index) {
    linkList.push($(this).attr('href'));
  });

  makeDir();
  saveFiles(linkList);
}

request(url, function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);

    getURLs($, 'Text');
  }
});