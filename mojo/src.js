define([
	"dojo/ready",
	"dojo/topic",
	"dojo/_base/lang",
	"dojo/dnd/Moveable",
	"dojo/dom",
	"dojo/fx",
	"dojo/fx/easing",
	"dojo/has",
	"dojo/on",
	"dojo/query",
	"dojox/analytics/Urchin",
	"dojox/widget/Roller",
	"demos/mojo/src/download",
	"demos/mojo/src/drop",
	"dojo/aspect"
], function (ready, topic, lang, dndMoveable, dom, fx, fxEasing, has, on, query, analyticsUrchin, widgetRoller, mojoSrcDownload, mojoSrcDrop, aspect) {

	// our core requirements:
	// tracking:
	// our custom code:
	 // gravity code
	 // download link code
	
	(function(){
			
		var nodes, style = dojo.style;
		
		ready(function(){
			
			if(has("ie")){
				dom.byId("logoImg").src = "images/logo.gif";
			}
			nodes = query("#container > div");
			// iterate over each div in the container
			nodes.forEach(function(n){
				// hide the node, first thing, and undo native-css hiding:
				style(n, { opacity:0, visibility:"visible" });
	
				// the drag handle will be the h1 element in this div
				var handle = query("h1", n)[0];
				new dndMoveable(n, { handle: handle });
	
				// there is really only one image in here though:
				query("img", n).forEach(function(img){
					style(img,{
						width:"1px", height:"1px",
						top:"155px", left:"155px"
					});
					if(has("ie")){
						// no png's for ie users
						img.src = "images/shot3.gif";
					}
				});
			});
			
			// dojo.fx.combine takes an array of animations:
			var _anims = [];
			var _delay = 1200;
			
			nodes.forEach(function(n){
				// fade in the node, delayed 500ms
				_anims.push(dojo.fadeIn({
					duration:850,
					node: n, delay: _delay + 1200,
					properties: {
						paddingTop: {
							start:155, end:1
						},
						fontSize:{
							start:0.1, end:16
						}
					}
				}))
				
				query("img", n).forEach(function(img){
					_anims.push(dojo.animateProperty({
						duration:450,
						delay: _delay + 1000,
						node: img,
						properties: {
							width: 310,
							height: 310,
							top: 0,
							left: 0
						}
					}));
				});
	
				_delay += 1500; // step up the delay base just a smidge
	
			});
			
			// add the header-in-animation to our _anims array
			_anims.push(dojo.animateProperty({
				node: "header",
				properties: {
					top: 5,
					left: 5
				},
				delay: _delay,
				duration: 700
			}));
			
			_anims.push(dojo.fadeIn({
				node:"downloadButton",
				duration:400,
				delay:2000,
				beforeBegin: lang.partial(style, "downloadButton", {
					opacity:0, visibility:"visible"
				})
			}));
			
			// combine them all, and play a s single animation (with a
			// setTimeout to give the broswer a second to be sane again)
			var anim = fx.combine(_anims);
			
			var roller = new dojox.widget.RollerSlide({ delay:5000, autoStart:false },"whyList");
			aspect.after(anim, "onEnd", lang.hitch(roller, "start"));
	
			setTimeout(lang.hitch(anim,"play"), 15);
			
			var _coords = null;
			var _z = null;
			
			topic.subscribe("/dnd/move/start", function(e){
				// when drag starts, save the coords of the node we're pulling
				var n = e.node;
				_coords = dojo.coords(n);
				// and "bring to top"
				// and make it partially opaque
				_z = style(n, "zIndex");
				style(n, { zIndex:888, opacity:0.65 });
			});
			
			topic.subscribe("/dnd/move/stop", function(e){
				// when it ends, reset z-index, opacity, and animate back to spot
				style(e.node, "opacity", 1);
				if(_coords){
					fx.slideTo({
						node: e.node, // drag node
						top: _coords.t, // tmp top
						left: _coords.l, // tmp left
						easing: fxEasing.elasticOut,
						duration:950 // ms
					}).play(5); // small delay for performance?
					style(e.node, "zIndex", _z);
				}
			});
			
			new analyticsUrchin({
				acct: "UA-3572741-1",
				GAonLoad: function(){
					this.trackPageView("/demos/mojo");
				}
			});
	
		});
	
	})();
});