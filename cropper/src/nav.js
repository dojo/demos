define([
	"dojo/has",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/_base/connect",
	"dojo/_base/array",
	"dojo/NodeList",
	"dojo/dom-class",
	"dojo/ready",
	"dojo/dom-style",
	"dojo/_base/fx",
	"dojo/request",
	"dojo/fx",
	"dojo/fx/easing",
	"dojo/query",
	"dojox/image/_base"
], function (has, lang, attr, connect, arrayUtil, NodeList, domClass, ready, domStyle, baseFx, request, fx, easing, query, image_base) {

	// quick `plugd` plugin:
	var jankyEv = "mouse" + (has("ie") ? "enter" : "over");
	lang.extend(NodeList, {
		hover:function(func, optFunc){
			// summary:
			//		add hover connections to each node in this list
			return this.onmouseenter(func).onmouseleave(optFunc || func);
		},
		hoverClass:function(className){
			// summary:
			//		toggle a class on hover automatically for a node
			return this.hover(function(e){
				domClass[(e.type == jankyEv ? "add" : "remove")](e.target, className);
			});
		}
	});
	
	ready(function(){

		// some placeholders:
		var _anims = [], delay = 70, _outa = [];
		
		// build the animations
		var nodes = query("> li", "picker").forEach(function(n, i){
			
			domStyle.set(n, "position", "relative");

			// make animation to drop the node out of view
			_anims.push(
				baseFx.animateProperty({
					node: n, duration:375,
					delay: delay * i,
					properties: { top:45 },
					easing: easing.backIn
				})
			);
			// fade separate because easing doesn't reach 100% ? might be edge case.
			_anims.push(baseFx.fadeOut({ node:n, delay: delay * i, duration:375 }) );
			
			// also make animations to fade back in, and slide back to top:0
			_outa.push(
				baseFx.animateProperty({
					node: n,
					delay: delay * i,
					properties:{ opacity:1, top:0 }
				})
			);
			
		});
		
		// create grouped animations from the lists:
		var _in = fx.combine(_anims), _out = fx.combine(_outa);
		
		var switchPage = function(arr){
			// summary:
			//		switch out all the thumbnails with src's from this new array of urls.
			
			var c = on(_in, "onEnd", function(){
				// when thumbnails are hidden, do this:
				
				// we set the a.href in this loop so the existing behavior from src.js
				// works as expected. it is looking for <a href="full.png"><img src="thumb.png"></a>
				// and we've got to work around that:
				
				nodes.query("a").forEach(function(n, i){
					attr.set(n, {
						// this is janktastic -- we only know the thumb url
						// and a pattern between it and the full url. fragile.
						href: arr[i].replace(/\/thumb/,"").replace(/t\./, ".")
					});
				});
				
				// set the thumbnails to the new list passed:
				nodes.query("img").forEach(function(n,i){
					attr.set(n, "src", arr[i]);
				});
				
				// we connect each page listen, this is connectOnce
				connect.disconnect(c);
				
				// play this hide animation
				_out.play();
				
			});
			
			// play the show animation, trigger the above connection
			_in.play();
		};
		
		request("images.json", {
			handleAs: "json"
		}).then(function (resp) {				
			// basic loading, then make an array of thumbnail urls:
			var items = resp.images, needed = [], npages = (items.length / 6);
			var thumbs = arrayUtil.map(items, function(item){
				var thumb = item.src.replace(/\./, "t.");
				return "images/thumb/" + thumb;
			});
			dojox.image.preload(thumbs);
			
			// break the list into pages of 6, skipping whatever
			// urls happened to be in the list on page load
			var pages = [];
			pages.push(nodes.query("img").get('src'));
			var other = arrayUtil.filter(thumbs, function(url){
				return arrayUtil.indexOf(pages[0], url) < 0;
			});
			// janky: ie6 is giving me a different order of this array:
			pages.push(other.slice(0, 6));
			pages.push(other.slice(6));

			// make the pager nav, with event connections:
			var pager = domConstruct.create('ul', {
				id:"pager",
				style:{ opacity:0 }
			}, "navi");
			
			arrayUtil.forEach(pages, function(p, i){
				
				var n = domConstruct.create("li", {
					innerHTML: (1 + i) + ""
				}, pager);
				
				// hook up some logic to unselect other items
				// in this group, and handle hover state:
				query(n).hoverClass("over").onclick(function(e){
					if(domClass.contains(n, "selected")){ return; }
					query("> li", pager).removeClass("selected");
					domClass.add(n, "selected");
					switchPage(p);
				});
					
			});
			
			baseFx.fadeIn({ node:pager }).play();
		});
		
	});
});