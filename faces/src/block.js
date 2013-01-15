define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-style",
	"dojo/on",
	"dojo/dom",
	"dojo/_base/window",
	"dojo/query",
	"dojo/dom-geometry",
	"dojo/_base/fx",
	"dojo/dom-attr",
	"dojo/NodeList",
	"dojo/NodeList-dom"
], function (declare, lang, domStyle, on, dom, win, query, domGeometry, fx, attr, NodeList) {
	
	var Blocker = declare("dojo._Blocker", null, {
		// summary:
		//		The blocker instance used by dojo.block to overlay a node

		// duration: Integer
		//		The duration of the fadeIn/fadeOut for the overlay
		duration: 400,
		
		// opacity: Float
		//		The final opacity of the overlay. A number from 0 to 1
		opacity: 0.6,
		
		// backgroundColor: String
		//		The color to set the overlay
		backgroundColor: "#fff",
		
		// zIndex: Integer
		//		The z-index to apply to the overlay, should you need to adjust for higher elements
		zIndex: 999,
		
		constructor: function(node, args){
			// the constructor function is always called by dojo.declare.
			// first, mixin any passed args into this instance to override defaults, or hook in custom stuff
			lang.mixin(this, args);
			// in-case someone passed node:"something", force this.node to be the first param
			this.node = dom.byId(node);
			// create a node for our overlay.
			this.overlay = win.doc.createElement('div');

			// do some chained magic nonsense
			query(this.overlay)
				// make it the last-child of <body>
				.place(win.body(),"last")
				// give it a common class
				.addClass("dojoBlockOverlay")
				// mixin our styles. I'd prefer to do this purly in CSS, but that would
				// require external css somehow, and is an extra file. ;)
				.style({
					backgroundColor: this.backgroundColor,
					position: "absolute",
					zIndex: this.zIndex,
					display: "none",
					opacity: this.opacity
				});
		},
		
		_position: function(){
			var pos = domGeometry.position(this.node, true);
			// adjust for margins/padding: (edge case, may only be this demo's styles)
			pos = lang.mixin(domGeometry.getMarginBox(this.node), {
				l: pos.x, t: pos.y
			});
	
			domStyle.set(this.overlay, {
				position:"absolute",
				left: pos.l + "px",
				width: pos.w + "px",
				height: pos.h + "px",
				top: pos.t + "px"
			});
		},
		
		show: function(){
			// summary:
			//		Show this overlay
			
			if(this._showing){ return; }
			var	ov = this.overlay;

			this._position();
			if(this.keepPosition){
				this.positionConnect = on(window, "resize", lang.hitch(this, "_position"));
			}

			domStyle.set(ov, { opacity:0, display:"block" });
			fx.fadeIn({ node:ov, end: this.opacity, duration: this.duration }).play();
			this._showing = true;
		},
		
		hide: function(){
			// summary:
			//		Hide this overlay
			
			fx.fadeOut({
				node: this.overlay,
				duration: this.duration,
				// when the fadeout is done, set the overlay to display:none
				onEnd: lang.hitch(this, function(){
					domStyle(this.overlay, "display", "none");
					if(this.keepPosition){
						this.positionConnect.remove();
					}
					this._showing = false;
				})
			}).play();
		}
		
	});

	// Generates a unique id for a node
	var id_count = 0;
	var _uniqueId = function(){
		var id_base = "dojo_blocked",
			id;
		do{
			id = id_base + "_" + (++id_count);
		}while(dom.byId(id));
		return id;
	};

	var blockers = {}; // hash of all blockers
	lang.mixin(Blocker, {
		_block: function(/* String|DomNode */node, /* dojo.block._blockArgs */args){
			// summary:
			//		Overlay the passed node to prevent further input, creates an
			//		instance of dojo._Blocker attached to this node byId, or generates a
			//		unique id if the node doesn't have one already.
			// node:
			//		The node to overlay
			// args:
			//		An object hash of configuration options. See dojo._Blocker for
			//		a list of parameters mixed in.
			// returns:
			//		The dojo._Blocker instance created for the passed node for convenience.
			//		You can call var thing = dojo.block("someNode"); thing.hide(); or simply call
			//		dojo.unblock("someNode"), whichever you prefer.

			var n = dom.byId(node);
			var id = attr.set(n, "id");
			if(!id){
				id = _uniqueId();
				attr.set(n, "id", id);
			}
			if(!blockers[id]){
				blockers[id] = new Blocker(node, args);
			}
			blockers[id].show();
			return blockers[id]; // dojo._Blocker
		},
		
		unblock: function(node, args){
			// summary:
			//		Unblock the passed node
			var id = attr.set(node, "id");
			if(id && blockers[id]){
				blockers[id].hide();
			}
		}
		
	});
	
	lang.extend(NodeList, {
		block: NodeList._adaptAsForEach("block"),
		unblock: NodeList._adaptAsForEach("unblock")
	});
	
	return Blocker;
});