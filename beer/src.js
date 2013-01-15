define([
	"dojo/dom",
	"dojo/query",
	"dojox/rpc/Service",
	"demos/beer/src/Bottle",
	"demos/beer/src/Lady",
	"demos/beer/src/dnd",
	"dojo/domReady!"
], function (dom, query, rpcService, beerSrcBottle, beerSrcLady, beerSrcDnd) {
	//	beer.api = new dojox.rpc.Service(dojo.moduleUrl("demos.beer.resources","api.smd"));
		
	var shelf = dom.byId("shelf-offer").firstChild;
	for(var i = 0; i < 10; i++){
		var bottle = new beer.Bottle({
			beerIndex: i,
			size:"large"
		});
		shelf.appendChild(bottle.domNode);
	}
	query("div", shelf)
		.forEach(function(n){
			new beer.MadeDnd(n);
		});
});