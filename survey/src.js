define([
	"dojox/analytics/Urchin",
	"demos/survey/src/chart",
	"demos/survey/src/form",
	"dojo/domReady!"
], function (analyticsUrchin) {
	new analyticsUrchin({
		acct: "UA-3572741-1",
		GAonLoad: function(){
			this.trackPageView("/demos/survey");
		}
	});
});