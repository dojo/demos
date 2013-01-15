define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/request",
	"dijit/_WidgetBase"
], function (declare, lang, domClass, domStyle, request, _WidgetBase) {

	declare("beer.Bottle", _WidgetBase, {
		// summary:
		//		A Beer visual.
		
		beerIndex: 0,
		
		size: "small",
		sizes: {
			small: 18, large: 36
		},
		
		postCreate: function(){
			
			domClass.add(this.domNode, "dijitInline beerBox-" + this.size);
			var offset = this.sizes[this.size];
			domStyle.set(this.domNode, {
				backgroundPosition:"-" + (this.beerIndex * offset) + "px 1px"
			});
		}
	
	});
	
	declare("beer.UserProfile", _WidgetBase, {
		// summary:
		//		A shelf of beers for a particular Person
		
		user:"",
	
		setUser: function(username){
			this.user = username || null;
			if(this.user){
				request("getBeers.php", {method: "GET", content: { user: this.user }}).then(lang.hitch(this,function(data){
						
					}));
			}
		}
	});
	return beer.Bottle;
});