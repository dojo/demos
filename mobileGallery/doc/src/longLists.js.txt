define([
	"dojo/ready",
	"dijit/registry",
	"dojo/dom",
	"dojo/_base/connect",
	"dojox/mobile/ListItem",
	"dojox/mobile/parser",
	"dojox/mobile",
	"dojox/mobile/ScrollableView",
	"dojox/mobile/TabBar",
	"dojox/mobile/TabBarButton",
	"dojox/mobile/RoundRectList",
	"dojox/mobile/LongListMixin"
], function(ready, registry, dom, connect, ListItem){
	fillList = function(list){
		for(var i = 0; i < 2000; i++){
			list.addChild(new ListItem({
				variableHeight:true,
				style:"font-size:10px",
				innerHTML: 	i + '. <a href="#" class="lnk">Book Title '+i+'</a><br>'+
					'Author '+i+'<br>'+
					'Eligible for FREE Super Saver Shipping<br>'+
					'<span style="color:red">$14.50 (50%)</span> In Stock<br>'+
					'# ('+i+')'
			}));
		}
	};
	return {
		init: function() {
			fillList(longList);
			connect.connect(longList, "_addAfter",
				function(){
					dom.byId("itemCount").innerHTML = "Displayed items: " + longList.domNode.childNodes[1].childElementCount + " out of 2000";
				}
			);
		}
	};
});
