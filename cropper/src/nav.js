dojo.provide("demos.cropper.src.nav");

dojo.require("dojo.fx");
dojo.require("dojo.fx.easing");
dojo.require("dojox.image._base");

;(function(d, $){

	// quick `plugd` plugin:
	var jankyEv = "mouse" + (d.isIE ? "enter" : "over");
	d.extend(d.NodeList, {
		// summary: add hover connections to each node in this list
		hover:function(func, optFunc){
			return this.onmouseenter(func).onmouseleave(optFunc || func);
		},
		// summary: toggle a class on hover automatically for a node
		hoverClass:function(className){
			return this.hover(function(e){
				d[(e.type == jankyEv ? "addClass" : "removeClass")](e.target, className);
			});
		}
	});
	
	d.addOnLoad(function(){

		// some placeholders:
		var _anims = [], delay = 70, _outa = [];
		
		// build the animations
		var nodes = $("> li", "picker").forEach(function(n, i){
			
			d.style(n, "position", "relative");

			// make animation to drop the node out of view
			_anims.push(
				d.animateProperty({ 
					node: n, duration:375,
					delay: delay * i,
					properties: { top:45 },
					easing: d.fx.easing.backIn
				})
			);
			// fade separate because easing doesn't reach 100% ? might be edge case.
			_anims.push(d.fadeOut({ node:n, delay: delay * i, duration:375 }) );
			
			// also make animations to fade back in, and slide back to top:0
			_outa.push(
				d.animateProperty({
					node: n,
					delay: delay * i,
					properties:{ opacity:1, top:0 }
				})
			);
			
		});
		
		// create grouped animations from the lists:
		var _in = d.fx.combine(_anims), _out = d.fx.combine(_outa);
		
		var switchPage = function(arr){
			// summary: switch out all the thumbnails with src's from this new array of 
			//		urls. 
			
			var c = d.connect(_in, "onEnd", function(){
				// when thumbnails are hidden, do this:
				
				// we set the a.href in this loop so the existing behavior from src.js
				// works as expected. it is looking for <a href="full.png"><img src="thumb.png"></a>
				// and we've got to work around that:
				
				nodes.query("a").forEach(function(n, i){
					d.attr(n, {
						// this is janktastic -- we only know the thumb url
						// and a pattern between it and the full url. fragile.
						href: arr[i].replace(/\/thumb/,"").replace(/t\./, ".")
					})
				});
				
				// set the thumbnails to the new list passed:
				nodes.query("img").forEach(function(n,i){
					d.attr(n, "src", arr[i])
				});
				
				// we connect each page listen, this is connectOnce
				d.disconnect(c);
				
				// play this hide animation
				_out.play();
				
			});
			
			// play the show animation, trigger the above connection 
			_in.play();
		}
		
		d.xhrGet({ 
			
			// load a list of additional images from a url:
			url:"images.json", handleAs:"json",

			// handle the response data from the url:
			load: function(resp){
				
				// basic loading, then make an array of thumbnail urls:
				var items = resp.images, needed = [], npages = (items.length / 6);
				var thumbs = d.map(items, function(item){
					var thumb = item.src.replace(/\./, "t.");
					return "images/thumb/" + thumb;
				});
				dojox.image.preload(thumbs);
				
				// break the list into pages of 6, skipping whatever
				// urls happened to be in the list on page load
				var pages = [];
				pages.push(nodes.query("img").attr('src'));
				var other = d.filter(thumbs, function(url){
					return d.indexOf(pages[0], url) < 0;
				});
				// janky: ie6 is giving me a different order of this array:
				pages.push(other.slice(0, 6)); 
				pages.push(other.slice(6));

				// make the pager nav, with event connections:
				var pager = d.create('ul', { 
					id:"pager",
					style:{ opacity:0 }
				}, "navi");
				
				d.forEach(pages, function(p, i){
					
					var n = d.create("li", {
						innerHTML: (1 + i) + ""
					}, pager);
					
					// hook up some logic to unselect other items 
					// in this group, and handle hover state:
					$(n).hoverClass("over").onclick(function(e){
						if(d.hasClass(n, "selected")){ return; }
						$("> li", pager).removeClass("selected");
						d.addClass(n, "selected");
						switchPage(p);
					});
						
				});
				
				d.fadeIn({ node:pager }).play();
			}
		});
		
	});
	
})(dojo, dojo.query);