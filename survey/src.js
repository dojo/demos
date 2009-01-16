dojo.provide("demos.survey.src");

dojo.require("demos.survey.src.chart");
dojo.require("demos.survey.src.form");

dojo.require("dojox.analytics.Urchin");
dojo.addOnLoad(function(){
	new dojox.analytics.Urchin({ 
		acct: "UA-3572741-1", 
		GAonLoad: function(){
			this.trackPageView("/demos/survey");
		}
	});	
});
