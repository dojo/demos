dojo.provide("demos.beer.src");

dojo.require("dojox.rpc.Service");

dojo.require("demos.beer.src.Bottle");
dojo.require("demos.beer.src.Lady")
dojo.require("demos.beer.src.dnd");

dojo.addOnLoad(function(){
//	beer.api = new dojox.rpc.Service(dojo.moduleUrl("demos.beer.resources","api.smd"));	
	
	var shelf = dojo.byId("shelf-offer").firstChild;
	for(var i = 0; i < 10; i++){
		var bottle = new beer.Bottle({
			beerIndex: i,
			size:"large"
		});
		shelf.appendChild(bottle.domNode);
	}
	dojo.query("div", shelf)
		.forEach(function(n){
			new beer.MadeDnd(n);
		});

});
