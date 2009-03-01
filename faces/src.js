dojo.provide("dojoc.demos.faces.src");

dojo.require("dojox.fx.flip");
dojo.require("dojoc.demos.faces.src.block");
dojo.require("dijit._base.sniff");
dojo.require("dojox.image._base");
dojo.require("dojox.image.LightboxNano");

(function(d){
	
	// to reuse
	d.NodeList.prototype.makeNano = function(){
		return this.forEach(function(n){
			console.log('making nano:',n);
			new dojox.image.LightboxNano({ href: d.attr(n, "href") }, n);
		});
	}
	
	var v = "flip", x = 0;
	var base64Img = "";
	
	var sortDivsByLengthOfFirstChildUl = function(id){
		console.log("calling ridiculously named function");
		id = d.byId(id);
		dojo.query("> div", id).sort(function(a,b){
			var q = "ul > li", al = d.query(q, a).length, bl = d.query(q, b).length;
			return al > bl ? 0 : al < bl ? 1 : -1;
		}).forEach(function(n){
			id.appendChild(n);
		});
	}
	
	var demo = function(){	
		
		// each region has an id, and this order is convenient. keep it: 
		var pieceId = ["hair", "eyes", "mouth"],
		
		// cache a ref to this node, and always make it 'off' by default
			checknode = d.byId("random");
			
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
				d.style(n, "backgroundImage", "url(" + image.src + ")");
			}else{
				// otherwise, just set the image
				d.style(n, "backgroundImage", "");
				n.parentNode.className = people[x];
			}		
		};

		var flip = function(e){
			// flip one of the pieceId nodes:
			var n = e.target,
				// create the flip animation:
				fl = dojox.fx[v]({ node: n }),
				// and determine which image to show after flip is over:
				c = d.connect(fl, "onEnd", function(){
					nextImage(n);
					d.disconnect(c);
				})
			;
			fl.play();
		}

		// random logic, could move out into module:
		var randomInterval;
		var stopRandom = function(){
			checknode.checked = false; 
			clearTimeout(randomInterval);
			randomInterval = null;
		}
		var randomFunc = function(){
			// pseudo-emulate (duck) the event object randomly:
			flip({ target: d.byId(pieceId[(Math.floor(Math.random() * 3))]) });
		}
		var startRandom = function(){
			randomInterval = setInterval(randomFunc, 4500);
			randomFunc();
		}
		
		d.query("#flipper").onclick(function(e){
			if(randomInterval){ stopRandom(); }
			flip(e); 
		});
		d.connect(checknode, "onchange", function(e){	
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
		d.query("#saveAs").onclick(function(e){

			var target = d.query("#faceContainer .container")[0];
			blocker = d.block(target, { opacity:0.6, keepPosition:true, backgroundColor:"#000" });

			// onclick, create a data object from the selected faces and send to backend
			var data = {};
			d.forEach(pieceId, function(piece){
				data[piece] = d.byId(piece).parentNode.className || ""; 
			});	
			setTimeout(d.partial(saveFace, data), 50);
			stopRandom();

		});

		var saveFace = function(data){
			// a function to send the list of currently selected users to the backend
			var url; 
			d.xhrPost({
				url: "resources/imageMaker.php",
				handleAs: "json",
				handle: function(data){
					console.log(data);
					url = data["file"];
					if(data["name"]){
						// FIXME: should move this out into a function. set the images then call setNames()
						d.byId("savedName").innerHTML = 
							"<p class='who'>" + nameset() + "</p>" +
							"<h2 id='currentName'>" + data["name"] + "</h2>" 
							;
							
						if(!data['duplicate']){
							// figure out clan
							
							var clan = dojo.query("ul." + data['clan']);
							if(!clan.length){
								var t = 
									dojo.create("div",{
										"class":"clan",
										innerHTML:"<h2>" + data['clan'] + "</h2>"
											+ "<ul class='" + data['clan'] + "'></ul>"
									}, "thumbnails");
								clan = dojo.query("ul", t);
							}
							
							var td = dojo.create("li", { 
								"class":"thumbnail",
								style:{ opacity:0 },
								innerHTML:"<a href ='" + data["file"] + "'><img src='" + data["thumb"] + "'></a>"
							}, clan[0]);
							
							dojo.query("a", td).makeNano();
							
							dojo.fadeIn({ node: td }).play();
							
						}
						
						sortDivsByLengthOfFirstChildUl("thumbnails");
						
					}
					blocker.hide();
				}, 
				content: data
			});
		}

		var nameset = function(){
			// quick, generate a list of names from top to bottom
			var byid = d.byId;
			return	"" +
					byid("hair").parentNode.className + ", " +
					byid("eyes").parentNode.className + ", and " +
					byid("mouth").parentNode.className + " make: "
					;
		};

		// preload all the available images in people array:
		dojox.image.preload(d.map(people, function(person){
			return "images/" + person + ".jpg";
		}));

		// connect to the "hidden" setupSwf button to load the webcam code:
		d.query("#setupSwf").onclick(function(e){
			this.disabled = true;
			d.addClass(this, "invisible");
			// use keepRequires=[..] or this bracketed notation to prevent build from inlining:
			// TODOC: maybe 'd.require()' isn't picked up either?!?
			// d.require("dojoc.demos.faces.src.webcam");
			d["require"]("dojoc.demos.faces.src.webcam");
		}).forEach(function(n){
			// in the "progressive case", FF and others retain all states :/ force it back.
			n.disabled = false; 
		});
		
		d.query("#thumbnails a").makeNano();
		
		// now set the three images to something random:
		// FIXME: should we look for a #hash first, too?
		setTimeout(function(){
			d.forEach(pieceId, function(p, i){
				setTimeout(function(){
					flip({ target: d.byId(p) });
				}, i * 150);
			});
		}, 300); // after a bit of time

		

	};

	d.addOnLoad(demo);

})(dojo);