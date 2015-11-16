module.exports = function(opts){
    var yargs = require('yargs').argv;
    var cheerio = require('cheerio');
    var request = require('request');
    var Promise = require('bluebird');
    var puff = require('./puff');
    var fs = require('fs');
    var hash = require('sha1');
    
    var cacheDir = opts.cacheDir || './cache';

    function run(cmd, callback, toInput) {
	var spawn = require('child_process').spawn;
	var command;
	if(cmd instanceof Array){
	    command = spawn(cmd);
	} else {
	    command = spawn.apply(null, cmd);
	}
	var result = '';
	if(!(typeof toInput === 'undefined')){
	    command.stdin.setEncoding('utf-8');
	    command.stdin.write(toInput);
	    command.stdin.on('error', function(err){
		console.log(err);
		throw err;
	    })
	}
	command.stdout.on('data', function(data) {
            result += data.toString();
	});
	command.on('error', function(err){
	    console.log('error on command creation')
	    callback(err);
	})
	command.on('close', function(code) {
            return callback(null, result);
	});
	command.stderr.on('data',
			  function (data) {
			      console.log('err data: ' + data);
			  });
	return command;
    }

    function pRun(cmd, toInput){
	if(typeof toInput === 'undefined'){
	    return new Promise(function(fulfil,reject){
		run(cmd, function(err, result){
		    if(err instanceof Error){
			reject(err);
		    } else {
			fulfil(result);
		    }
		});
	    });
	} else {
	    return new Promise(function(fulfil,reject){
		var child = run(cmd, function(err, result){
		    if(err instanceof Error){
			reject(err);
		    } else {
			fulfil(result);
		    }
		}, toInput);
	    });
	}
    }

    function selectOne(a){
	return a[Math.floor(Math.random()*a.length)];
    }

    // function promiseTokenization(str){
    // 	var cacheFileName = urlToCacheName(infile+'tokenized');
    // 	return new Promise(function(fulfil, reject){
	    
    // 	});
    // }

    function pBody(url){
	return new Promise(function(fulfil, reject){
	    if(fs.existsSync(urlToCacheName(url))){
		fs.readFile(urlToCacheName(url),function(err, body){
		    if(err instanceof Error){
			reject(err);
		    } else {
			fulfil(body.toString());
		    }
		});
	    } else {
		request(url, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
			fs.writeFileSync(urlToCacheName(url), body);
			fulfil(body);
		    } else {
			reject(error instanceof Error ? error : response);
		    }
		})
	    }	
	});
    }

    function urlToCacheName(url){
	return cacheDir + '/'+ hash(url);
    }

    function extend(subClass, superClass){
	var inheritance = (function(){});
	inheritance.prototype = superClass.prototype;
	subClass.prototype = new inheritance();
	subClass.prototype.constructor = subClass;
	subClass.prototype.superConstructor = superClass;
	subClass.superClass = superClass.prototype;
    }


    return {
	urlToCacheName:urlToCacheName,
	pBody:pBody,
	selectOne:selectOne,
	run:run,
	pRun:pRun,
	extend:extend,
    }
}
