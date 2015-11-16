var yargs = require('yargs').argv;
var cheerio = require('cheerio');
var request = require('request');
var Promise = require('bluebird');
var puff = require('./puff');
var fs = require('fs');
var hash = require('sha1');
var utils = require('./utils')({
    cacheDir:yargs.cacheDir || './cache'
});


puff.pollute(global);

var url = yargs.url;
var urlPrefix = url.split('/').slice(0,3).join('/');
var cacheDir = yargs.cacheDir || './cache';
var pBody = utils.pBody;
var urlToCacheName = utils.urlToCacheName;

pBody(url)
    .then(log)
    .then(extractStoryUrls)
    .then(p_(Promise.map, r(trim, pBody)))
    .then(first);

function extractStoryUrls(body){
    var $ = cheerio(body);
    console.log(body);
    var out = [];
    $.find('a.title').map(function(i, el){	
	console.log(el.children[0].data);
	out.push(el.attribs.href);
    });
    return out;
    
}
