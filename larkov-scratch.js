var yargs = require('yargs').argv;
var cheerio = require('cheerio');
var request = require('request');
var Promise = require('bluebird');
require('./puff').pollute(global);
var fs = require('fs');
var hash = require('sha1');
var utils = require('./utils')({
    cacheDir:yargs.cacheDir || './cache'
});
var striptags = require('striptags');
var Entities = require('html-entities').XmlEntities;
var Larkov = require('./larkov').Larkov;

var titleFile = yargs.titleFile || "./processed-corpora/titles/speeches-clean-abrogated";

fs.readFile(titleFile, function(err, body){
    if(err instanceof Error){
	console.log(err);
	throw err;
    }
    var titleCorpora = r(toString, p_(split,"\n"), map(p_(split, " ")))(body);
    //console.log(titleCorpora);
    var tg = new Larkov(titleCorpora);
    tg.generate(100).map(function(t){
	console.log(t);
    })
});







