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
var striptags = require('striptags');
var Entities = require('html-entities').XmlEntities;
var tokenize = require('./tokenizer')({forceCacheOverwrite:true}).tokenizeCached;

entities = new Entities();


puff.pollute(global);

var pBody = utils.pBody;
var urlToCacheName = utils.urlToCacheName;

var presidentId = yargs.presidentId || 'reagan';
var url = yargs.url || "http://millercenter.org/president/speeches";
var urlPrefix = url.split('/').slice(0,3).join('/');
var sanitizeFilename = function(s){
    return s.replace(/\W/g, '');
}

pBody(url)
    .then(scrapeUrlsFrom(presidentId))
    .then(log, handleError)
    .then(p_(Promise.map, r(trim, _p(str, urlPrefix), pBody)))
    .then(p_(Promise.map, extractTranscript))
    .then(function(bodies){
	console.log('bodies.length', bodies.length);
	console.log("Title: ", bodies[1].title);
	var titles = map(p_(ix, 'title'), bodies);
	fs.writeFile('./processed-corpora/titles/speeches', titles.join("\n"), function(err){
	    if(err instanceof Error){
		console.log(err);
		throw err;
	    } else {
		console.log('wrote titles:', './processed-corpora/titles/speeches');
	    }
	});
	bodies.forEach(function(body){
	    fs.writeFile('./processed-corpora/speeches/'+sanitizeFilename(body.title), body.transcript.join('<~>'), 
			 function(err){
			     if(err instanceof Error){
				 console.log(err);
				 throw err;
			     }
			     console.log('wrote', './processed-corpora/speeches/'+sanitizeFilename(body.title));
			 });
	});
    })

var stripAndDecode = r(entities.decode.bind(entities), striptags);

function extractTranscript(body){
    var $ = cheerio(body);
    var title = stripAndDecode($.find("#amprestitle").toString());
    var transcript =  $.find('#transcript');
    transcript.find('h2').remove();
    transcript = transcript.toString();
    transcript = transcript.split('<br>').join('\n');
    transcript = transcript.split('</p>').join('\n\n');
    return {title:title, transcript:tokenize(stripAndDecode(transcript))};
}

function scrapeUrlsFrom(id){
    return function(body){
	var out = [];
	var $ = cheerio(body);
	var next = $.find("#"+id).next();
	while(next.hasClass("entry")){
	    out.push(next.find("a").attr("href"));
	    next = next.next();
	}
	return out;
    }
}

function handleError(err){
    console.log(err);
    throw err;
}
