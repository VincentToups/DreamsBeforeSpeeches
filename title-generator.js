require('./puff').pollute(global);
var yargs = require('yargs').argv || {};
var fs = require('fs');
var hash = require('sha1');
var utils = require('./utils')({
    cacheDir:yargs.cacheDir || './cache'
});

function selectOne(a){
    return a[Math.floor(Math.random()*a.length)];
}

function TitleGenerator(lookback, corpora){
    this.lookback = lookback || 2;
    this.corpora = corpora;
    this.modelData = [];
    this.globalModel = {};
    this.train();
    this.warmth = 0.65;
}

function getElement(a, i){
    if(i<0){
	return "<start>";
    }
    if(i>a.length){
	return "<stop>";
    }
    return a[i];
}

TitleGenerator.prototype.addOne = function(tokens){
    var tokens = tokens.concat(["<stop>"])
    tokens.forEach(a.bind(this));
    function a(el, i){
	var modelI = this.modelData[i] || {};
	this.modelData[i] = modelI;
	var key = [];
	for(var k = i - this.lookback; k < i ; k = k + 1){
	    key.push(getElement(tokens, k));
	}	
	key = key.join(",");
	var globalModelList = this.globalModel[key] || [];
	this.globalModel[key] = globalModelList;
	globalModelList.push(el);
	var modelIA = modelI[key] || [];
	modelI[key] = modelIA;
	modelIA.push(el);
    }
}

TitleGenerator.prototype.train = function(){
    this.corpora.forEach(once.bind(this));
    function once(token){
	this.addOne(token);
    }
}

TitleGenerator.prototype.drawAtKey = function(i,key){
    if(Math.random()<this.warmth){
	return selectOne(this.globalModel[key]);
    } else {
	return selectOne((this.modelData[i] && this.modelData[i][key])||this.globalModel[key]);    
    }    
}



TitleGenerator.prototype.generateOne = function(){
    //console.log(this.modelData);
    var startKey = [];
    for(var i = 0; i < this.lookback; i = i+1){
	startKey.push("<start>");
    }
    startKey = startKey.join(",");
    //console.log("drawing at key", 0, startKey)
    var title = [this.drawAtKey(0,startKey)];
    var i = 1;
    while(last(title)!="<stop>"){
	var key = [];
	for(var k = i - this.lookback; k < i ; k = k + 1){
	    key.push(getElement(title, k));
	};
	key = key.join(",");
	//console.log(title)
	//console.log("drawing at key", i, key)
	title.push(this.drawAtKey(i, key));
	i = i + 1;
    }
    return title.slice(this.lookback, title.length-1).join(" ");
}

TitleGenerator.prototype.generate = function(n){
    var n = n || 1;
    var out = [];
    for(var i = 0; i < n; i = i + 1){
	out.push(this.generateOne());
    }
    return out;
}

module.exports = {
    TitleGenerator:TitleGenerator
}

