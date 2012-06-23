dojo.provide("demos.beer.src.Bottle");

dojo.require("dijit._Widget");

dojo.declare("beer.Bottle", dijit._Widget, {
	// summary:
	//		A Beer visual.
	
	beerIndex: 0,
	
	size: "small",
	sizes: {
		small: 18, large: 36
	},
	
	postCreate: function(){
		
		dojo.addClass(this.domNode, "dijitInline beerBox-" + this.size);
		var offset = this.sizes[this.size];
		dojo.style(this.domNode,{
			backgroundPosition:"-" + (this.beerIndex * offset) + "px 1px"
		});
	}

});

dojo.declare("beer.UserProfile", dijit._Widget, {
	// summary:
	//		A shelf of beers for a particular Person
	
	user:"",

	setUser: function(username){
		this.user = username || null;
		if(this.user){
			dojo.xhrGet({
				url: "getBeers.php",
				content: { user: this.user },
				load: dojo.hitch(this,function(data){
					
				})
			});
		}
	}
});