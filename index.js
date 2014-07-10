#!/usr/bin/env node

var http = require('http');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var mkdirp = require('mkdirp');

var args = process.argv.slice(2);
var year;
var regs = {};

if (args.length > 0) {
  year = args[0];
} else {
  year = new Date().getFullYear();
}

var url = 'http://www.gpo.gov/fdsys/browse/collectionCfr.action?selectedYearFrom=' + year + '&go=Go';

function makeDir(type){
  mkdirp('./' + type, function (err) {
    if (err) console.error(err);
  });
}

function writeFiles(err, fileName, fileContent, type) {
  var filePath = './' + type + '/' + fileName;
  fs.writeFile(filePath, fileContent, function(err) {
    if(err) console.error(err);
    else console.log(fileName + ' was saved!');
  });
}

function saveFiles(regs, type, extension) {
  makeDir(type);
  Object.keys(regs).forEach(function(regName) {
    var fileName = regName + extension
    var fileURL = regs[regName][type];
    if ( fileURL ) {
      request(fileURL, function (error, response, body) {
        writeFiles(error, fileName, body, type);
      });
    }
  });
}

function getURLs ($) {
  var linkList = [];

  $('.cfr-download-links a').each(function(index) {
    var href = $(this).attr('href');
    var fileType = $(this).text().trim().toLowerCase();
    var regName = href.split('/').slice(-1)[0].split('.').slice(0)[0];
    if (fileType === 'text' || fileType === 'pdf' || fileType === 'xml') {
      if (!regs[regName]) {
        regs[regName] = {};
      }
      regs[regName][fileType] = href;
    }
  });

  saveFiles(regs, 'text', '.txt');
  saveFiles(regs, 'xml', '.xml');
}

request(url, function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);

    getURLs($);
  }
});