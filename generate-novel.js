var yargs = require('yargs').argv || {};
var fs=require('fs');
var tokenizer = require('./tokenizer')();
var Promise = require('bluebird');
var larkovSt = require('./larkov-st');
var gingerbread = require('gingerbread');
var langTool = require('./language-tool')();
var TitleGenerator = require('./title-generator').TitleGenerator;

var targetWordCount = yargs.targetWordCount || 50000;
var outputDir = yargs.outputDir || './output/';
var titleFile = yargs.titleFile || './processed-corpora/titles/speeches-clean';
var dirs = ['processed-corpora/speeches/', 'processed-corpora/schopenhaur/'];

function pTitleGenerator(titleFile){
    return new Promise(function(fulfil, reject){
	fs.readFile(titleFile, function(err, body){
	    if(err instanceof Error){
		console.log(err);
		reject(err);
	    }
	    var titleCorpora = r(toString, p_(split,"\n"), map(p_(split, " ")))(body);
	    var tg = new TitleGenerator(1, titleCorpora);
	    fulfil(tg);
	});
    });
}

function pCorpora(filename){
    console.log('pCorpora', filename)
    return new Promise(function(fulfil, reject){
	fs.readFile(filename, function(err,body){
	    if(err instanceof Error){
		console.log('Error reading', filename);
		reject(err);
	    } else {
		fulfil(body.toString().split(tokenizer.getDelim()));
	    }
	});
    });
}
function pCorpus(){
    var files = mapcat(function(dir){
	console.log('getting files from', dir)
	var files = map(_p(str, dir))(fs.readdirSync(dir));
	console.log('files', files);
	return files;
    }, dirs);
    console.log('all files', files)
    return Promise.map(files, pCorpora);
}

function simpleWC(s){
    return rOn(s, split(' '), mapcat(split('\n')), length);
}

Promise.all([pCorpus(), pTitleGenerator(titleFile)])
    .spread(function(corpus, titleGen){
	var transcript = [];
	var wc = 0;
	var lk = new larkovSt.LarkovSt(corpus, {warmth:.65, lookback:3});
	var correct = langTool.correct.bind(langTool);
	var title, contents;
	while(wc < targetWordCount){
	    title = correct(titleGen.generateOne());
	    contents = correct(lk.generateOne());
	    transcript.push(title);
	    transcript.push(contents);
	    wc = wc + simpleWC(contents);
	    console.log('current wc:', wc);
	}
	fs.writeFile(outputDir+'/dream-speeches.txt', transcript.join('\n'), function(err){
	    if(err instanceof Error){
		console.log('Failure writing:', outputDir+'/dream-speeches.txt');		
		throw err;
	    } else {
		console.log('Wrote ', outputDir+'/dream-speeches.txt');
	    }
	})
	
    });




