import java.io.FileReader;
import java.io.IOException;
import java.util.List;

import edu.stanford.nlp.ling.CoreLabel;
import edu.stanford.nlp.ling.HasWord;
import edu.stanford.nlp.process.CoreLabelTokenFactory;
import edu.stanford.nlp.process.DocumentPreprocessor;
import edu.stanford.nlp.process.PTBTokenizer;
import java.io.BufferedReader;
import java.io.InputStreamReader;


class PrintTokens {
  public static void main(String[] args) throws IOException {
      if(args.length == 0){
	  PTBTokenizer<CoreLabel> ptbt = new PTBTokenizer<>(new BufferedReader(new InputStreamReader(System.in)),
							    new CoreLabelTokenFactory(), "");
	  while (ptbt.hasNext()) {
	      CoreLabel label = ptbt.next();
	      System.out.print(label);
	      System.out.print("<TKNBRK>");
	  }
      } else {
	  for (String arg : args) {
	      PTBTokenizer<CoreLabel> ptbt = new PTBTokenizer<>(new FileReader(arg),
								new CoreLabelTokenFactory(), "");
	      while (ptbt.hasNext()) {
		  CoreLabel label = ptbt.next();
		  System.out.print(label);
		  System.out.print("<TKNBRK>");
	      }
	  }
      }  
  }
}
