var yargs = require('yargs').argv;
require('./puff').pollute(global);

var jobs = {
    testPRun:testPRun,
    testGenerator:testGenerator,
    proccessExperimentation:proccessExperimentation,
    testJava:testJava,
    testSpeechGeneration:testSpeechGeneration,
    testGingerbread:testGingerbread,
    testLangTool:testLangTool,
}

var job = yargs.job || "testSpeechGeneration";

jobs[job]();

function testLangTool(){
    var langTool = require('./language-tool')();
    console.log("uncorrected:", "A sentence with a error in the Hitchhiker's Guide tot he Galaxy")
    console.log("  corrected:", langTool.correct("A sentence with a error in the Hitchhiker's Guide tot he Galaxy"));
}

function testSpeechGeneration(){
    var fs=require('fs');
    var dirs = ['processed-corpora/speeches/', 'processed-corpora/schopenhaur/'];
    var tokenizer = require('./tokenizer')();
    var Promise = require('bluebird');
    var larkovSt = require('./larkov-st');
    var gingerbread = require('gingerbread');
    var langTool = require('./language-tool')();
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
    pCorpus().then(function(a){
	console.log(larkovSt);
	var lk = new larkovSt.LarkovSt(a, {warmth:.85});
	var generated = lk.generateOne().split('*NL*').join("\n");
	console.log(langTool.correct(generated))
    });
}

function testGingerbread(){
    var gingerbread = require('gingerbread');
    gingerbread('Hell world.', function(e,t,r,c){
	console.log(e,t,r,c);
    });
}

function testJava(){
    var java = require("java");
    java.classpath.push("/home/toups/Downloads/stanford-parser-full-2015-04-20/stanford-parser.jar");
    java.classpath.push(".");

    var sr = java.newInstanceSync("java.io.StringReader","Hello this is an example string.");
    var tf = java.newInstanceSync("edu.stanford.nlp.process.CoreLabelTokenFactory");
    var tokenizer = java.newInstanceSync("edu.stanford.nlp.process.PTBTokenizer", sr, tf, "");
    
    while(tokenizer.hasNextSync()){
	var label = tokenizer.nextSync();
	console.log(label.toString());
    }
}

function proccessExperimentation(){
    var spawn = require('child_process').spawn;
    var child = spawn('java',['PrintTokens'],{env:{"CLASSPATH":".:CLASSPATH=/home/toups/Downloads/stanford-parser-full-2015-04-20/stanford-parser.jar"}});
    child.stdout.on('data',function(data){
	console.log('cstdout:', data.toString());
    });
    child.stderr.on('data', function(data){
	console.log('cer:', data.toString());
    })
    child.stdin.write('hello this might be a tokenizer test.\n');
    child.stdin.end();
}

function testPRun(){

    var cheerio = require('cheerio');
    var request = require('request');
    var Promise = require('bluebird');
    require('./puff').pollute(global);
    var fs = require('fs');
    var hash = require('sha1');
    var utils = require('./utils')({
	cacheDir:yargs.cacheDir || './cache'
    });
    utils.pRun(['java', 'PrintTokens'], 'This is a test of th')
	.then(function(res){
	    console.log("Got a result")
	    console.log(typeof res)
	    console.log(res);
	}, function(err){
	    console.log(err);
	    throw err;
	});
}

function testGenerator(){
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
    var TitleGenerator = require('./title-generator').TitleGenerator;

    var titleFile = yargs.titleFile || "./processed-corpora/titles/speeches-clean";

    fs.readFile(titleFile, function(err, body){
	if(err instanceof Error){
	    console.log(err);
	    throw err;
	}
	var titleCorpora = r(toString, p_(split,"\n"), map(p_(split, " ")))(body);
	//console.log(titleCorpora);
	var tg = new TitleGenerator(1, titleCorpora);
	tg.generate(100).map(function(t){
	    console.log(t);
	})
    });

}




