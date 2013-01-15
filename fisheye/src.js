define([
	"dojo/ready",
	"dojo/parser",
	"dojox/widget/FisheyeList"
], function (ready, parser, widgetFisheyeList) {

	ready(function(){
		parser.parse();
	})
	
	function load_app(id){
		alert('icon '+id+' was clicked');
	}
	
});