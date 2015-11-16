require('./puff').pollute(global);
var fs = require('fs');
var hash = require('sha1');

function selectOne(a){
    return a[Math.floor(Math.random()*a.length)];
}

function makeSimpleKeyBuilder(lookback){
    function get(a,i){
	return a[i] || "<start>";	
    }
    return function(tokens, i){	
	var key = [];
	for(var k = 0; k < lookback; k = k + 1){
	    key.push(get(tokens,i-(k+1)));
	}
	return key.reverse().join(',');
    }
}

function Larkov(corpora, keyBuilder, options){
    var options = options || {};    
    this.corpora = corpora;
    this.modelData = [];
    this.globalModel = {};
    this.keyBuilder = (keyBuilder || makeSimpleKeyBuilder(2)).bind(this);
    this.warmth = options.warmth || 0.25;
    this.train();
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

Larkov.prototype.postToken = function(){

};

Larkov.prototype.addOne = function(tokens){
    var tokens = tokens.concat(["<stop>"])
    tokens.forEach(a.bind(this));
    function a(el, i){
	var modelI = this.modelData[i] || {};
	this.modelData[i] = modelI;
	var key = this.keyBuilder(tokens, i);
	var globalModelList = this.globalModel[key] || [];
	this.globalModel[key] = globalModelList;
	globalModelList.push(el);
	var modelIA = modelI[key] || [];
	modelI[key] = modelIA;
	modelIA.push(el);
	this.postToken(el);
    }
}

Larkov.prototype.train = function(){
    this.corpora.forEach(once.bind(this));
    function once(token){
	this.addOne(token);
    }
}

Larkov.prototype.drawAtKey = function(i,key){
    if(Math.random()<this.warmth){
	return selectOne(this.globalModel[key]);
    } else {
	return selectOne((this.modelData[i] && this.modelData[i][key])||this.globalModel[key]);    
    }    
}

Larkov.prototype.postProcess = function(generatedString){
    return generatedString.split("<stop>").join("");
}

Larkov.prototype.generateOne = function(){
    var startKey = this.keyBuilder([],0);
    var title = [this.drawAtKey(0,startKey)];
    var i = 1;
    while(last(title)!="<stop>"){
	var key = this.keyBuilder(title, i);
	title.push(this.drawAtKey(i, key));
	this.postToken(last(title));
	i = i + 1;
    }
    return this.postProcess(title.join(" "));
}

Larkov.prototype.generate = function(n){
    var n = n || 1;
    var out = [];
    for(var i = 0; i < n; i = i + 1){
	out.push(this.generateOne());
    }
    return out;
}

module.exports = {
    Larkov:Larkov,
    makeSimpleKeyBuilder:makeSimpleKeyBuilder
}

