define([
	"dojo/dom-construct",
	"dojo/query",
	"dojo/_base/array",
	"dojo/dom",
	"dojo/NodeList",
	"dijit/_base/sniff",
	"dojox/analytics/Urchin",
	"dojox/fx/flip",
	"dojox/image/LightboxNano",
	"dojox/image/_base",
	"demos/faces/src/block",
	"dojo/dom-style",
	"demo/src/block",
	"dojo/_base/lang",
	"dojo/request",
	"dojo/_base/fx",
	"dojox/image",
	"dojo/dom-class",
	"dojo/ready",
	"dojo/dom-attr",
	"dojo/on"
], function (domConstruct, query, arrayUtil, dom, NodeList, _baseSniff, analyticsUrchin, fxFlip, imageLightboxNano, image_base, facesSrcBlock, domStyle, block, lang, request, fx, image, domClass, ready, attr, on) {
	
	var v = "flip", x = 0;
	var base64Img = "";
	
	var sortDivsByLengthOfFirstChildUl = function(id){
		// don't ever let me see you doing this outside of a demo situation. there has
		// got to be a better way.
		id = dom.byId(id);
		query("> div", id).sort(function(a,b){
			var q = "ul > li", al = query(q, a).length, bl = query(q, b).length;
			return al > bl ? 0 : al < bl ? 1 : -1;
		}).forEach(function(n){
			id.appendChild(n);
		});
	};
	
	var nameset = function(){
		// quick, generate a list of names from top to bottom
		var byid = dom.byId;
		return	"" +
				byid("hair").parentNode.className + ", " +
				byid("eyes").parentNode.className + ", and " +
				byid("mouth").parentNode.className + " make: "
				;
	};
	
	var demo = function(){
		
		// each region has an id, and this order is convenient. keep it:
		var pieceId = ["hair", "eyes", "mouth"],
		
		// cache a ref to this node, and always make it 'off' by default
			checknode = dom.byId("random");
			
		checknode.checked = false;
		
		var nextImage = function(n){
			// FIXME: there is no unity to this. should keep an index
			// of each region individually. This is more "random" though.
			if(++x > people.length - 1 ){ x = 0; }
			if(people[x] == "webcam"){
				// if we loaded webcam.js, this applies
				n.parentNode.className = "";
				var image = new Image();
				image.src = base64Img;
				domStyle.set(n, "backgroundImage", "url(" + image.src + ")");
			}else{
				// otherwise, just set the image
				domStyle.set(n, "backgroundImage", "");
				n.parentNode.className = people[x];
			}
		};

		var flip = function(e){
			// flip one of the pieceId nodes:
			var n = e.target,
				// create the flip animation:
				fl = fxFlip.flip({ node: n }),
				// and determine which image to show after flip is over:
				c = on(fl, "onEnd", function(){
					nextImage(n);
					c.remove();
				});
			fl.play();
		};

		// random logic, could move out into module:
		var randomInterval;
		var stopRandom = function(){
			checknode.checked = false;
			clearTimeout(randomInterval);
			randomInterval = null;
		};
		var randomFunc = function(){
			// pseudo-emulate (duck) the event object randomly:
			flip({ target: dom.byId(pieceId[(Math.floor(Math.random() * 3))]) });
		};
		var startRandom = function(){
			randomInterval = setInterval(randomFunc, 4500);
			randomFunc();
		};
		
		query("#flipper").onclick(function(e){
			if(randomInterval){ stopRandom(); }
			flip(e);
		});
		on(checknode, "change", function(e){
			// check if we should be looping or stop it:
			if(!e.target.checked){
				stopRandom();
			}else{
				startRandom();
			}
		});
		// end random logic

		// click handling for "hall of shame" link:
		var blocker;
		query("#saveAs").onclick(function(e){

			var target = query("#faceContainer .container")[0];
			blocker = block(target, { opacity:0.6, keepPosition:true, backgroundColor:"#000" });

			// onclick, create a data object from the selected faces and send to backend
			var data = {};
			arrayUtil.forEach(pieceId, function(piece){
				data[piece] = dom.byId(piece).parentNode.className || "";
			});
			setTimeout(lang.partial(saveFace, data), 50);
			stopRandom();

		});

		var saveFace = function(pay){
			// a function to send the list of currently selected users to the backend
			var url;
			request("resources/imageMaker.php", {
				method: "POST",
				handleAs: "json",
				data: pay
			}).then(function (response) {
				//	try{
						url = response["file"];
					if(response["name"]){
						dom.byId("savedName").innerHTML =
							"<p class='who'>" + nameset() + "</p>" +
							"<h2 id='currentName'>" + response["name"] + "</h2>"
							;

						var c = response['clan'];
						
						if(!response['duplicate'] && c){
							// figure out clan

							var clan = query("ul." + c);
							if(!clan.length){
								var t =
									domConstruct.create("div",{
										"class":"clan",
										id: c,
										innerHTML:"<h2><a href='#" + c + "'>" + c + "</a></h2>"
											+ "<ul class='" + c + "'></ul>"
									}, "thumbnails");
								clan = query("ul", t);
							}
						
							var td = domConstruct.create("li", {
								"class":"thumbnail",
								style:{ opacity:0 },
								innerHTML:"<a href ='" + response["file"] + "'><img src='" + response["thumb"] + "'></a>"
							}, clan[0]);
						
							query("a", td).makeNano();
						
							fx.fadeIn({ node: td }).play();
						
						}
					
						sortDivsByLengthOfFirstChildUl("thumbnails");
					
						setTimeout(function(){
							window.location.hash = c;
						}, 400);

					}
			//	}catch(e){ console.warn(e); }
				blocker.hide();
			})
		}

		// preload all the available images in people array:
		dojox.image.preload(arrayUtil.map(people, function(person){
			return "images/" + person + ".jpg";
		}));

		// connect to the "hidden" setupSwf button to load the webcam code:
		query("#setupSwf").onclick(function(e){
			this.disabled = true;
			domClass.add(this, "invisible");
			// use keepRequires=[..] or this bracketed notation to prevent build from inlining:
			// TODOC: maybe 'd.require()' isn't picked up either?!?
			// d.require("dojoc.demos.faces.src.webcam");
			require("demo/src/webcam");
		}).forEach(function(n){
			// in the "progressive case", FF and others retain all states :/ force it back.
			n.disabled = false;
		});
		
		query(".imageThumb").forEach(function (n) {
			new imageLightboxNano({ href: attr.set(n, "href") }, n);
		});
		
		// now set the three images to something random:
		// FIXME: should we look for a #hash first, too?
		sortDivsByLengthOfFirstChildUl("thumbnails");

		setTimeout(function(){
			arrayUtil.forEach(pieceId, function(p, i){
				setTimeout(function(){
					flip({ target: dom.byId(p) });
				}, i * 150);
			});
		}, 300); // after a bit of time

		// stall this just a little
		setTimeout(function(){
			new analyticsUrchin({
				acct: "UA-3572741-1",
				GAonLoad: function(){
					this.trackPageView("/demos/faces");
				}
			});
		}, 1500);

	};

	ready(demo);
});