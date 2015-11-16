Dreams Before Speeches
----------------------

_Dreams Before Speeches_ is my National Novel Generating Month entry.
It presents a series of presidential speeches made or rehearsed in
dreams during the presidency of Ronald Reagan.

The novel is available [here](https://github.com/VincentToups/DreamsBeforeSpeeches/blob/master/output/fmt-dream-speeches.txt)

Excerpts:
---------

  MR. NEWMAN : I'm afraid my message that night was grim
   and disturbing. I remember telling you we were in the
   worst economic mess since the Depression. We're here
   because humanity refuses to accept that our relationship
   be guided by reason in everything; that is to say, in
   good conscience, the satisfaction which we no longer
   have any Real knowledge of it.

 The world exists as the mirror of the Indian philosophers
   declares, “ It is a narrow-minded and ridiculous
   thing not to architecture, which admits it merely as
   extraneous ornament, and could Dispense with it.

* * *

  We're also gathered here for a special event --
   the national funeral for an unknown soldier who
   will today join the heroes of Lebanon and for the
   preservation of the sacred fire of liberty “ is “
   finally staked on the experiment entrusted to the
   hands of the people. The Bible tells us there will
   be no immigration reform without employer sanctions,
   because it does such violence to the spirit, thwarting
   the human impulse to create, to enjoy life to the
   fullest, and to inquire into the cause of mankind and
   world peace. We can decide the tough issues not by who
   is right, infinitely surpassing Everything else that
   exists merely relatively, still remained unknown.

  Make no mistake about it, this attack was not just
   against ourselves or the Republic of Korea -- South
   Korea -- has offered to permit certain events of the
   1988 Olympics to take place to begin with, and this
   will also show how old our view is, though the mass
   of philosophical knowledge of the subject, which
   makes mathematics so difficult. This becomes less
   in the idyll, still less to reproach him because he
   is Yet always thrown aside as vanished illusions. We
   are compelled by the principle of sufficient reason
   is truth, only as modifications of the actual world;
   thus according to this doctrine is old : it appears
   in the one case we find in the Vedas, Purana, poems,
   myths, legends of their saints, maxims and precepts,
   (85) we see that several ideas which are different
   in unessential particulars may be Allowed expressing
   myself by a metaphor.


About the Novel
---------------

The novel is generated using a series of modified Markov models
trained on both the collected speeches of the Reagan presidency and
several of the works of Arthur Schopenhauer, the pessimist
philosopher.

The novel is available [here](https://github.com/VincentToups/DreamsBeforeSpeeches/blob/master/output/fmt-dream-speeches.txt)

Building Your Own
-----------------

You can generate a different set of _Dreams Before Speeches_ by
installing nodejs:


    npm init
	nodejs generate-novel.js

You'll need to install a JDK, JLanguage Tool and (potentially) the
Stanford Tokenizer.

I clean up the generated text by passing it through the command line tool `fmt`, eg

    cat output/dream-speeches.txt | fmt -tuw 60

Technical Notes
---------------

### Limitations of Markov Models

_Dreams Before Speeches_ attempts to mitigate the weaknesses of
generating texts via Markov models in a variety of ways. A basic
Markov model calculates for each word in the text a probability of
appearance given some N previous words. This technique has
shortcomings. For small N, for instance, the generate texts tend to be
very random, full of grammatical errors. For larger N, the
requirements for training data become obstructive. In all the speeches
of Ronald Reagan, for instance, no 4 word phrase ever appears
twice. In this case, the generated text will always recapitulate
exactly one element of the training data.

Furthermore, most pieces of text are not stationary: that is to say
that within a given speech or chapter of a book certain words and
phrases are more likely to occur near the start of the piece, others
near the end, and others in the middle. This is just a restatement, in
a sense, of the above problem: word to word correlations are simply
not very informative about human text documents, which usually have
very large scale correlations (indeed, correlations to things outside
the text are needed for commprehension, to say nothing of generation).

We can mitigate this problem by training a Markov model for each
_position_ in our corpora, but this shrinks considerably our data set
for a given model.

### Mitigations

_Dreams Before Speeches_ uses such positional markov models with a
lookback of three.

To resolve the issue of small amounts of training data, we add a
_warmness_ to our generator which, according to some probability,
draws the next word from a global, rather than positional model. This
allows what would otherwise be a fixed text generator to move into new
directions.

We also post-process the output with the free grammar correction tool
JLanguageTool.  Sentences are still, of course, plagued by randomness,
but many grammatical problems are automatically fixed which improves
the readability of the text.

Finally, we situate the output work itself as a stream of
consciousness dream: communicating to the reader that the text is not
a literal retelling of a specific series of events but, in a sense, a
soup of ideas drawn up from the subconcious.

Notes on the Corpora
--------------------

I've chosen to train this novel generator on the combined works of
Ronald Reagan and Arthur Schopenhauer because I see these two
thinkings occupying opposite ends of a rhetorical axis: one at asinine
political speech full of platitudes and back patting and the other a
serious philosophical text engaging issues which would never appear in
any political speech.







