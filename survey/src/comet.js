define([
	"dojo/ready",
	"dojox/cometd"
], function (ready, cometd) {

	var startService = function(){
		cometd.init("http://cometd.sitepen.com/cometd");
	
		cometd.subscribe("/demo/survey/redraw",function(d){
		    getResults();
		});
		
	};
	ready(startService);
	
	return {
		startService: startService
	};
});