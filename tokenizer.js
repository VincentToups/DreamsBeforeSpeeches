module.exports = function(options){
    var options = options || {};
    var forceCacheOverwrite = typeof options.forceCacheOverwrite === "undefined" ? false : options.forceCacheOverwrite;
    var tokenDelimeter = typeof options.tokenDelimeter === "undefined" ? "<~>" : options.tokenDelimeter;
    var yargs = require('yargs').argv || {} ; 
    var stanfordParserJar = options.stanfordParserJar || "/home/toups/Downloads/stanford-parser-full-2015-04-20/stanford-parser.jar";
    var utils = require("./utils")({
	cacheDir: options.cacheDir || yargs.cacheDir || './cache'
    });
    var fs = require('fs');

    var java = require("java");
    java.classpath.push(stanfordParserJar);
        
    function tokenize(s){
	var sr = java.newInstanceSync("java.io.StringReader",s);
	var tf = java.newInstanceSync("edu.stanford.nlp.process.CoreLabelTokenFactory");
	var tokenizer = java.newInstanceSync("edu.stanford.nlp.process.PTBTokenizer", sr, tf, "tokenizeNLs=true");
	var output = [];
	while(tokenizer.hasNextSync()){
	    output.push(tokenizer.nextSync().toString());
	}
	return output;
    }

    function tokenizeCached(s){
	var cacheName = utils.urlToCacheName(s);
	if(fs.existsSync(cacheName) && !forceCacheOverwrite){
	    return fs.readFileSync(cacheName).toString().split(tokenDelimeter);
	} else {
	    var tokens = tokenize(s);
	    console.log('tokenDelimeter is ', tokenDelimeter)
	    fs.writeFile(cacheName,tokens.join(tokenDelimeter), function(err){
		if(err instanceof Error){
		    console.log('Error writing tokens to cache', cacheName, tokens.slice(0,5));
		} else {
		    console.log('logged tokens starting with: ', tokens.slice(0,5));
		}
	    });
	    return tokens;
	}
    }
    
    return {
	tokenize:tokenize,
	tokenizeCached:tokenizeCached,
	getDelim:function(){
	    return tokenDelimeter;
	}
    };
}

