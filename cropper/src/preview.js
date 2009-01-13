dojo.provide("demos.cropper.src.preview");
dojo.require("dijit._Widget");
dojo.require("dojo.dnd.move");

(function(d, $){
		
	// a simple "wrap" function. availaing in `plugd`
	// warning: node must be in the DOM before being wrapped.
	var wrap = function(node, withTag){
		// summary: wrap some node with a tag type.
		var n = d.create(withTag);
		d.place(n, node, "before");
		d.place(node, n, "first");
		return n;
	}, 
	// some quick aliases for shrinksafe: 
	abs = "absolute", pos = "position";
	
	d.declare("image.Preview", dijit._Widget, {
		// summary: A Behavioral widget adding a preview pane to any `<img>`
		
		// the size of the draggable/moveable window
		glassSize:150,
		// the size of the preview window relative to the glassSize
		scale:2,
		
		// unsupported atm:
		withMouseMove:false,
		withDrag:true,
		
		// moveInterval: Int
		//		Adjust the time the preview redraws from dnd operations (ms)
		moveInterval: 50,
		
		// hoverable: Boolean
		//		Does this image react to hovering to show/hide the dragger
		hoverable: false,
		
		postCreate: function(){
			
			var gs = this.glassSize, 
				s = this.scale;
			
			// wrap the target in a div so we can control it with dnd.
			var mb = dojo.marginBox(this.domNode);
			this.currentSize = mb;

			// wrap the domNode in antoher div so parentDnd works
			this.container = wrap(this.domNode, "div");
			dojo.marginBox(this.container, mb);
			
			// create a draggable handle thing over our target
			this.picker = d.create('div', {
				"class":"imageDragger",
				style: { 
					opacity: this.hoverable ? 0 : 0.25, 
					width: gs + "px", 
					height: gs + "px"
				}
			}, this.domNode, "before");
			
			// create the preview node. _positionPicker places it.
			this.preview = d.create('div', {
				style:{
					position:abs,
					overflow:"hidden",
					width: gs * s + "px", 
					height: gs * s + "px"
				}
			}, dojo.body());
			this._positionPicker();

			// wrap the full image, so we can position it easily relative
			// to the outer node. embedded position:rel/absolute/rel/abs here
			var n = wrap(d.create('img', {
						style:{ position: abs },
				 		src: this.altSrc || this.domNode.src 
					}, this.preview), "div");
			d.style(n, pos, "relative");
			d.style(this.domNode, pos, abs);
			
			this.image = d.query('img', this.preview)
				// when it is loaded, use those numbers:
				.onload(d.hitch(this, function(e){

					var tc = this.coords, 
						s = this.scale,
						ts = this.targetSize = { 
							w: e.target.width, 
							h: e.target.height 
						};
						
					var tr = this.ratio = {
						x: ts.w / tc.w, y: ts.h / tc.h
					};
					
					d.style(this.image, {
						height: tc.h * s + "px",
						width: tc.w * s + "px"
					});
					
				}))[0];
			
			// setup dnd for the picker:
			this.mover = new d.dnd.move.parentConstrainedMoveable(this.picker,
				// Safari and IE seem to be pickup up paddings and whatnot
				// as container? ugh. 
				{ area: "content", within: true }
			);
			
			// setup dnd behavior
			d.subscribe("/dnd/move/start", this, "_startDnd");
			d.subscribe("/dnd/move/stop", this, "_stopDnd");
			
			// janky IE src issue fix:
			d.isIE && (this.image.src = this.image.src);
			
			// only because our layout is fluid:
			this.connect(d.global, "onresize", "_positionPicker");
		},
		
		_positionPicker: function(e){
			// place the preview thinger somewhere relative to the container 
			// we wrapped around the orig image.
			var tc = this.coords = dojo.coords(this.container, true);
			d.style(this.preview,{
				left: tc.x + tc.w + 10 + "px",
				top: tc.y + "px"
			});
		},
		
		_startDnd: function(n){
			// listen for dnd Start, determine if we care:
			if(!this._interval && n && n.node == this.picker){
				// listen to doc onmousemove 
				this._interval = this.connect(d.doc, "onmousemove", "_whileMoving");
			}
		},
		
		_stopDnd: function(){
			// dnd operations are done, remove the timer
			this._interval && this.disconnect(this._interval);
		},
		
		_whileMoving: function(){
			// while dnd in progress, adjust the backgroundPosition of the preview
			if(!this.ratio){ return; }
			
			var s = this.scale,
				xy = d.coords(this.picker), 
				tc = this.coords, 
				x = (xy.l - tc.l) * s, 
				y = (xy.t - tc.t) * s;
			
			// position the image relative to the pickers position 
			// in the container.
			d.style(this.image, {
				top: "-" + y + "px", 
				left: "-" + x + "px"
			});
		},
		
		destroy: function(){
			// destroy our domNodes. this is a behavioral widget.
			// we can .destroy(true) and leave the image, but I
			// this we're destroying it with "container" destruction.
			// FIXME:
			dojo.forEach(["preview","picker","container","image"], function(n){
				dojo.destroy(this[n]);
				delete this[n];
			}, this);
			this.inherited(arguments);
		}
		
	});
	
	// setup the query "plugin"
	d.extend(d.NodeList, {
		preview: function(args){
			return this.instantiate(image.Preview, args);
		}
	});
	
})(dojo, dojo.query);
