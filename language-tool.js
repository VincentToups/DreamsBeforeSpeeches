module.exports = function(options){
    var options = options || {};
    var languageToolJars = options.languageToolJars || [
	"/home/toups/Downloads/LanguageTool-3.1/languagetool.jar",
	"/home/toups/Downloads/LanguageTool-3.1/languagetool-commandline.jar",
	"/home/toups/Downloads/LanguageTool-3.1/languagetool-server.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/ictclas4j.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/morfologik-fsa.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/slf4j-api.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/hunspell-native-libs.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/jsonic.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/languagetool-core-tests.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/languagetool-core.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/lucene-gosen-ipadic.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/commons-cli.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/opennlp-tools.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/jna.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/junit.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/languagetool-gui-commons.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/morfologik-speller.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/opennlp-postag-models.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/segment.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/cjftransform.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/lucene-core.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/hamcrest-core.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/morfologik-tools.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/opennlp-tokenize-models.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/annotations.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/jwordsplitter.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/morfologik-stemming.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/commons-lang.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/opennlp-chunk-models.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/guava.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/lucene-backward-codecs.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/openregex.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/morfologik-polish.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/language-detector.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/hppc.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/slf4j-nop.jar",
	"/home/toups/Downloads/LanguageTool-3.1/libs/commons-logging.jar"];    
    var java = require('java');
    languageToolJars.map(function(jar){
	java.classpath.push(jar);
    });

    var langTool = undefined;
    function getLangTool(){
	if(langTool){
	    return langTool;
	} else {
	    langTool =  java.newInstanceSync("org.languagetool.JLanguageTool",
					     java.newInstanceSync("org.languagetool.language.AmericanEnglish"));
	    return langTool;
	}
    }

    function correct(s){
	var langTool = getLangTool();
	return java.callStaticMethodSync("org.languagetool.tools.Tools","correctText",s,langTool);
    }

    return {
	correct:correct
    }

 //    JLanguageTool langTool = new JLanguageTool(new BritishEnglish());
// //langTool.activateDefaultPatternRules();  -- only needed for LT 2.8 or earlier
// List<RuleMatch> matches = langTool.check("A sentence with a error in the Hitchhiker's Guide tot he Galaxy");
 
// for (RuleMatch match : matches) {
//   System.out.println("Potential error at line " +
//       match.getLine() + ", column " +
//       match.getColumn() + ": " + match.getMessage());
//   System.out.println("Suggested correction: " +
//       match.getSuggestedReplacements());
// }
    
}
