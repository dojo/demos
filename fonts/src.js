dojo.provide("demos.fonts.src");

dojo.require("dojox.gfx");
dojo.require("dojox.gfx.VectorText");
dojo.require("dojox.analytics.Urchin");

dojo.addOnLoad(function(){
	new dojox.analytics.Urchin({ 
		acct: "UA-3572741-1", 
		GAonLoad: function(){
			this.trackPageView("/demos/fonts");
		}
	});	
});