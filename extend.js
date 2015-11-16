function extend(subClass, superClass){
 var inheritance = (function(){});
 inheritance.prototype = superClass.prototype;
 subClass.prototype = new inheritance();
 subClass.prototype.constructor = subClass;
 subClass.prototype.superConstructor = superClass;
 subClass.superClass = superClass.prototype;
}

module.exports = extend;
