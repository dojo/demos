define([
	"dojo/dom-class",
	"dojo/on",
	"dojo/aspect",
	"dojo/dom",
	"dojo/dom-style",
	"dojo/parser",
	"dijit/Dialog",
	"dijit/form/Button",
	"dijit/layout/ContentPane",
	"dijit/layout/LayoutContainer",
	"dojox/analytics/Urchin",
	"demos/flashCards/src/MathFlashCard",
	"demos/flashCards/src/Teacher",
	"dijit/registry",
	"dojo/ready"
], function (domClass, on, aspect, dom, domStyle, parser, Dialog, formButton, layoutContentPane, layoutLayoutContainer, analyticsUrchin, flashCardsSrcMathFlashCard, flashCardsSrcTeacher, registry, ready) {

	//global storage point for our fade animations
	var messageFadeEvent = null;
	
	//reset the score board
	var resetScore = function(){
		var card = registry.byId("card");
		dom.byId("remainingTd").innerHTML = card.numberProblems;
		dom.byId("correctTd").innerHTML = 0;
		dom.byId("incorrectTd").innerHTML = 0;
		dom.byId("tooSlowTd").innerHTML = 0;
		domStyle.set("scoreTable", "display", "");
	};
	
	var goodAnswers = ["Great job. Did you know that doing math regularly keeps you sharp?", "Hey, this is correct, did you ever concider joining a math competition?", "I am impressed! Not so many students are good in math, congratulations!"];
	var indexGood = 0;
	var countGood = 0;
	
	var badAnswers = ["Hmm, you are letting me down! Did you practice enough?", "This is wrong, why don't you know such a simple answer?", "I might have to send you back to school, this is not good"];
	var indexBad = 0;
	
	var slowAnswers = ["Hmm, I thought you could have beena little faster to be honest", "You could have counted the result on your fingers my friend.", "Slow slow slow, what are we going to do about this?"];
	var indexSlow = 0;
	
	var countBad = 0;
	
	//start the flashcards, result of pressing "getStarted"
	getStarted = function(){
		registry.byId("teacher").speak("Hi student! Let's go. Just enter the correct results and press enter.");
		
		//call the card widgets getStarted() method
		var c = registry.byId("card");
		c.getStarted();
	
		//display(unhide) the card
		domStyle.set(c.domNode, "display", "");
	
		//hide the getStarted Button
		domStyle.set("start", "display", "none");
	
		//reset the score board
		resetScore();
	
		//attach to the onCorrect event of the card.  When this event happens
		//we want to display a fading message and update the score board
		on(c, "Correct", function(e){
			if (messageFadeEvent){
				messageFadeEvent.stop();
			}
			
			countGood++;
			countBad = 0;
			if (countGood == 2){
				registry.byId("teacher").frown(false);
			}
	
			dom.byId("correctTd").innerHTML = c.correctAnswers;
	
			if (c.started){
				dom.byId("remainingTd").innerHTML = c.numberProblems - c.currentProblem;
				// FIXME: which node?
				domClass.remove("incorrect");
				domClass.add("correct");
				
				registry.byId("teacher").speak(goodAnswers[indexGood], 5000);
				indexGood++;
				if (indexGood == goodAnswers.length) { indexGood=0; }
			}
		});
	
		//attach to the onIncorrect event of the card.  When this event happens
		//we want to display a fading message and update the score board
		on(c, "Incorrect", function(e){
			if(messageFadeEvent){
				messageFadeEvent.stop();
			}
			
			countBad++;
			countGood = 0;
			if (countBad == 2){
				registry.byId("teacher").frown(true);
			}
	
			dom.byId("incorrectTd").innerHTML = c.incorrectAnswers;
	
			if(c.started){
				dom.byId("remainingTd").innerHTML = c.numberProblems - c.currentProblem;
				domClass.add("incorrect");
				domClass.remove("correct");
				
				registry.byId("teacher").speak(badAnswers[indexBad], 5000);
				indexBad++;
				if (indexBad == badAnswers.length) { indexBad=0; }
			}
		});
	
		//attach to the onTooSlow event of the card.  When this event happens
		//we want to display a fading message and update the score board
		on(c, "TooSlow", function(e){
			if(messageFadeEvent){
				messageFadeEvent.stop();
			}
			
			countBad++;
			countGood = 0;
			if (countBad == 2){
				registry.byId("teacher").frown(true);
			}
	
			dom.byId("tooSlowTd").innerHTML = c.tooSlow;
	
			if(c.started){
				dom.byId("remainingTd").innerHTML = c.numberProblems - c.currentProblem;
				// FIXME: which node?
				domClass.add("incorrect");
				domClass.remove("correct");
				
				registry.byId("teacher").speak(slowAnswers[indexSlow], 5000);
				indexSlow++;
				if (indexSlow == slowAnswers.length) { indexSlow=0; }
			}
			
		});
	
		//attach to the onEnd event of the card.  When this event happens
		//we want to display a final message,update the score board, and show
		//the restart button
			
		on(c, "End", function(correct, total, slow){
			if (messageFadeEvent){
				messageFadeEvent.stop();
			}
	
			//create ending message/summary
			var msg = "You got " + correct + " out of " + total + " correct.";
			if(slow > 0){
				msg += " You were too slow on ";
				if(slow == 1){
					msg += "1 problem.";
				} else {
					msg += slow + " problems.";
				}
			}
			
			if (c.correctAnswers > 8){
				registry.byId("teacher").frown(false);
			}
	
			registry.byId("teacher").speak(msg);
			
			domStyle.set(c.domNode, "display", "none");
			domStyle.set(dom.byId("restart"), "display", "");
			dom.byId("remainingTd").innerHTML = "0";
	
		});
	
		//attach to the restart method of the card.  We dont' want to reset the
		//score onEnd since people want a chance to review their score, this won't
		//happen until they actually click restart
		aspect.after(c, "restart", resetScore, true);
	};
	
	//the restart function
	var restart = function(){
		domStyle.set(dom.byId("restart"), "display", "none");
		domStyle.set(registry.byId("card").domNode, "display", "");
		registry.byId("teacher").speak("What a delightful student you are, keep practicing! Your way to success.");
		registry.byId("card").restart();
	};
	
	ready(function(){
		
		parser.parse();
		
		setInterval(function(){
			registry.byId("teacher").blink();
		}, 2500);
		
		// stall this just a little
		setTimeout(function(){
			new analyticsUrchin({
				acct: "UA-3572741-1",
				GAonLoad: function(){
					this.trackPageView("/demos/flashCards");
				}
			});
		}, 1500);
		
	});
});