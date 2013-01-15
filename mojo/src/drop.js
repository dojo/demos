define([
	"dojo/ready",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/aspect",
	"dojo/dom",
	"dojo/dom-style",
	"dojo/fx",
	"dojo/fx/easing",
	"dojo/has",
	"dojo/on",
	"dojo/query",
	"dojo/window",
	"dojo/dom-geometry",
	"dojo/dnd/Moveable"
], function (ready, lang, baseWin, aspect, dom, domStyle, fx, fxEasing, has, on, query, win, domGeometry, Moveable) {

	// adds gravity effect to mojoDemo
	(function(){
	
		var mojo = {}, nodes, _coords = [], cb;
		
		lang.mixin(mojo, {
			drop: {
				_calcPositions: function(e){
					// store or return the current calculated positions of each ball
					var c = [];
					nodes.forEach(function(n){
						c.push(domGeometry.position(n));
					});
	
					if(e){
						_coords = c; // with luck maybe in this limited scope, but this is bad.
					}
					return c; // Array
				},
				dropNodes: function(){
					// summary:
					//		drop all the nodes using the bounce easing function
	
					_coords = mojo.drop._calcPositions(); // store positions for later
					// ball is 310px, so the bottom edges are height - 310 roughly.
					var t = win.getBox().h - 310;
					domStyle.set(baseWin.body(), "overflow", "hidden");
	
					var _anims = [];
					nodes.forEach(function(n,idx){
						// we want to keep the left: attribute in tact, so pass it along
						var l = _coords[idx].x;
						_anims.push(fx.slideTo({
							top:t, left:l, node:n,
							duration:1000,
							easing:fxEasing.bounceOut
						}));
					});
					// play the _anims as one animation
					fx.combine(_anims).play();
				},
				floatNodes: function(){
					// summary:
					//		reset all the nodes to the orig. positions
					var _anims = [];
					nodes.forEach(function(n,idx){
						// push each slide animation in _anims, based on it's stored coords
						var t = _coords[idx].y;
						var l = _coords[idx].x;
						_anims.push(fx.slideTo({
							top: t, left:l, node:n,
							duration:500
						}));
					});
					// play the anim, and set overflow:auto on body
					var _anim = fx.combine(_anims);
					var con = aspect.after(_anim, "onEnd", function(){
						domStyle.set(baseWin.body(), "overflow", "visible");
					});
					_anim.play();
				}
			}
		});
		
		var _toggleGravity = function(e){
			// drop or float the nodes based on the state of the checkbox
			mojo.drop[(cb.checked ? "dropNodes" : "floatNodes")]();
		};
		
		ready(function(){
			// convenience:
			nodes = query("#container > div");
	
			// setup the "gravity toggler"
			cb = dom.byId("gravity");
			cb.checked = false;
			
			// var del = dojo.byId("interact");
			aspect.after(cb, has("ie") ? "onclick" : "onchange", _toggleGravity, true);
			// FIXME: ie7 fires onchange after blur() ... ugh
			//	dojo.connect(cb,"onchange",_toggleGravity);
			
			// just in case, because our nodes are absolutely positioned:
			on(window, "resize", lang.hitch(mojo.drop, "_calcPositions"));
	
			// lets make the logo drag/snap-able, too.
			new Moveable("logoImg");
			domStyle.set("logoImg", "cursor", "move");
		});
	
	})();
});