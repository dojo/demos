require([
	"dojo/_base/connect",
	"dojo/store/JsonRest",
	"dojo/ready",
	"dijit/registry",
	"dojox/mobile/parser",
	"dojox/mobile",
	"dojox/mobile/compat",
	"dojox/mobile/ScrollableView",
	"dojox/mobile/StoreCarousel"
], function(connect, JsonRest, ready, registry){
	store1 = new JsonRest({target: "resources/carousel-categ.json"});
	ready(function(){
		connect.subscribe("/dojox/mobile/carouselSelect", function(w, img, item, idx){
			if(w.id == "carousel1"){
				var store2 = new JsonRest({target: "resources/carousel-"+item.value+".json"});
				var w2 = registry.byId("carousel2");
				w2.set("title", item.value);
				w2.setStore(store2);
				registry.byId("rect1").domNode.style.display = "none";
			}else if(w.id == "carousel2"){
				var rect1 = registry.byId("rect1");
				var u = "unknown";
				var desc = "<div style='float:right;font:14px arial;width:49%'>Model: "+(item.model?item.model:u)+"<br>"+
					"Design: "+(item.design?item.design:u)+"<br>"+
					"Produced: "+(item.produced?item.produced:u)+"<br>"+
					"Size: "+(item.size?item.size:u)+"<br>"+
					"Price: "+(item.price?item.price:u)+"<br></div>";
				rect1.containerNode.innerHTML = desc+"<img src='"+item.src+"' width='50%' align='top'>";
				rect1.domNode.style.display = "";
			}
		});
	});
});
