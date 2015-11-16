var larkov = require('./larkov');
var util = require('./utils')({});
require('./puff').pollute(global);

function LarkovSt(corpora, options){
    this.parens = {};
    this.parens.left = 0;
    this.parens.right = 0;
    this.quotes = {};
    this.quotes.left = 0;
    this.quotes.right = 0;
    this.basicKeyBuilder = larkov.makeSimpleKeyBuilder(options.lookback || 2);
    larkov.Larkov.call(this, corpora, this.keyBuilder, options);
}

util.extend(LarkovSt, larkov.Larkov);

LarkovSt.prototype.inParens = function(){
    return this.parens.left > this.parens.right;
}

LarkovSt.prototype.inQuotes = function(){
    return this.quotes.left > this.quotes.right;
}

LarkovSt.prototype.keyBuilder = function(tokens, i){
    var basicKey = this.basicKeyBuilder(tokens, i);
    if(this.inParens()){
	basicKey = "Parens::"+basicKey;
    } else if (this.inQuotes()){
	basicKey = "Quotes::"+basicKey;
    }
    return basicKey;
}

LarkovSt.prototype.postProcess = function(generated){
    var out = larkov.Larkov.prototype.postProcess.call(this, generated);
    return r(splitJoin('-LRB-','('), 
	     splitJoin('-RRB-',')'), 
	     splitJoin('-LSB-','('), 
	     splitJoin('-RSB-',')'),
	     splitJoin(' .', '.'),
	     splitJoin(' ?', '?'),
	     splitJoin(' !', '!'),
	     splitJoin(' ,', ','), 
	     splitJoin(' ;', ';'), 
	     splitJoin('``','"'),
	     splitJoin('\'\'','"'),
	     splitJoin("did n't", "didn't"),
	     splitJoin('*NL*','\n\n'),
	     splitJoin(' \'','\''))(out);
}

LarkovSt.prototype.postToken = function(token){
    if(token==='-LRB-' || token === '-LSB-'){
	this.parens.left = this.parens.left + 1;
    }
    if(token==='-RRB-' || token === '-RSB-'){
	this.parens.left = this.parens.right + 1;
    }

    if(token==='``'){
	this.quotes.left = this.quotes.left + 1;
    }
    if(token==="''"){
	this.quotes.left = this.quotes.right + 1;
    }
}

module.exports =  {
    LarkovSt:LarkovSt,
}
