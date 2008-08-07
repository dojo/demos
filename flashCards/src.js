dojo.require("dojo.parser");

dojo.require("dijit.Dialog");
dojo.require("dijit.form.Button");
dojo.require("dijit.layout.LayoutContainer");
dojo.require("dijit.layout.ContentPane");

dojo.require("demos.flashCards.src.MathFlashCard");

//global storage point for our fade animations
var messageFadeEvent = null;

//reset the score board
var resetScore = function(){
	var card = dijit.byId("card");
	dojo.byId("remainingTd").innerHTML = card.numberProblems;
	dojo.byId("correctTd").innerHTML = 0;
	dojo.byId("incorrectTd").innerHTML = 0;
	dojo.byId("tooSlowTd").innerHTML = 0;
	dojo.style("scoreTable", "display", "");
};

//start the flashcards, result of pressing "getStarted"
var getStarted = function(){

	//call the card widgets getStarted() method
	var c = dijit.byId("card");
	c.getStarted();

	//display(unhide) the card
	dojo.style(c.domNode,"display","");

	//hide the getStarted Button
	dojo.style("start", "display", "none");

	//reset the score board	
	resetScore();

	//attach to the onCorrect event of the card.  When this event happens
	//we want to display a fading message and update the score board				
	dojo.connect(c, "onCorrect", function(e){
		if (messageFadeEvent){
			messageFadeEvent.stop();
		}

		dojo.byId("correctTd").innerHTML = c.correctAnswers;

		if (c.started){
			dojo.byId("remainingTd").innerHTML = c.numberProblems - c.currentProblem;
			// FIXME: which node?
			dojo.removeClass("incorrect");
			dojo.addClass("correct");
			dojo.style("messages", "opacity", 1);
			dojo.byId("messages").innerHTML="Great Job!";
			messageFadeEvent = dojo.fadeOut({node: "messages", duration: 2000 }).play();
		}
	});

	//attach to the onIncorrect event of the card.  When this event happens
	//we want to display a fading message and update the score board				
	dojo.connect(c, "onIncorrect", function(e){
		if(messageFadeEvent){
			messageFadeEvent.stop();
		}

		dojo.byId("incorrectTd").innerHTML = c.incorrectAnswers;

		if(c.started){
			dojo.byId("remainingTd").innerHTML = c.numberProblems - c.currentProblem;
			dojo.addClass("incorrect");
			dojo.removeClass("correct");
			dojo.style("messages", "opacity", 1);
			dojo.byId("messages").innerHTML = "Sorry, keep trying!";
			messageFadeEvent = dojo.fadeOut({ node: "messages", duration: 2000}).play();
		}
	});

	//attach to the onTooSlow event of the card.  When this event happens
	//we want to display a fading message and update the score board				
	dojo.connect(c, "onTooSlow", function(e){
		if(messageFadeEvent){
			messageFadeEvent.stop();
		}

		dojo.byId("tooSlowTd").innerHTML = c.tooSlow;

		if(c.started){
			dojo.byId("remainingTd").innerHTML = c.numberProblems - c.currentProblem;
			// FIXME: which node?
			dojo.addClass("incorrect");
			dojo.removeClass("correct");
			dojo.style("messages", "opacity", 1);
			dojo.byId("messages").innerHTML = "C'mon, pick up the pace!";
			messageFadeEvent = dojo.fadeOut({ node: "messages", duration: 2000}).play();
		}
		
	});

	//attach to the onEnd event of the card.  When this event happens
	//we want to display a final message,update the score board, and show
	//the restart button
		
	dojo.connect(c, "onEnd", function(correct, total, slow){
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

		var message = dojo.byId("messages");
		message.innerHTML= msg;

		dojo.style(message, { opacity:1, display:"block" });
		dojo.style(c.domNode, "display", "none");
		dojo.style(dijit.byId("restart").domNode, "display", "");
		dojo.byId("remainingTd").innerHTML = "0";

	});

	//attach to the restart method of the card.  We dont' want to reset the 
	//score onEnd since people want a chance to review their score, this won't
	//happen until they actually click restart
	dojo.connect(c, "restart", resetScore);
};

//the restart function
var restart = function(){
	dojo.style(dijit.byId("restart").domNode,"display","none");
	dojo.style(dijit.byId("card").domNode,"display","");
	dojo.style("messages", "opacity", 0);
	dijit.byId("card").restart();
};

dojo.addOnLoad(function(){
	
	dojo.parser.parse();
	
});