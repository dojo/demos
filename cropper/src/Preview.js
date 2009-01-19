dojo.provide("demos.cropper.src.Preview");

dojo.require("dijit._Widget");
dojo.require("dojo.dnd.move");
dojo.require("dojox.layout.ResizeHandle");

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
		abs = "absolute", 
		pos = "position", 
		pixels = "px",
		_floor = Math.floor;
	
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
		
		// resizeable: Boolean
		//		Can the glass be resized, and provide zooming of the preview?
		resizeable: true,
		
		// opacity: Float
		//		Opacity value to use in hoverable or non-hoverable cases.
		opacity: 0.35, 
		
		postCreate: function(){
			
			var gs = this.glassSize, 
				s = this.scale;
			
			// wrap the target in a div so we can control it with dnd.
			var mb = d.marginBox(this.domNode);
			this.currentSize = mb;

			// wrap the domNode in antoher div so parentDnd works
			this.container = wrap(this.domNode, "div");
			d.marginBox(this.container, mb);
			
			// create a draggable handle thing over our target
			this.picker = d.create('div', {
				"class":"imageDragger",
				style: { 
					opacity: this.hoverable ? 0 : this.opacity, 
					width: gs + pixels, 
					height: gs + pixels
				}
			}, this.domNode, "before");
			
			// create the preview node. _positionPicker places it.
			this.preview = d.create('div', {
				style:{
					position:abs,
					overflow:"hidden",
					width: _floor(gs * s) + pixels, 
					height: _floor(gs * s) + pixels
				}
			}, d.body());

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
				.onload(d.hitch(this, "_adjustImage"))[0]; // the [0] is for the array
			
			this._positionPicker();
			
			// setup dnd for the picker:
			this.mover = new d.dnd.move.parentConstrainedMoveable(this.picker,
				// Safari and IE seem to be pickup up paddings and whatnot
				// as container? ugh. 
				{ area: "content", within: true }
			);
			
			if(this.resizeable){
				// create the resize handle for the glass:
				this._handle = new dojox.layout.ResizeHandle({
					
					// the draggable node is the one to resize. 
					// maintain aspect to keep inline with preview
					targetContainer: this.picker,
					fixedAspect: true,
				
					// rescale the image often, activeResize is true
					intermediateChanges: true,
					activeResize: true,
					onResize: d.hitch(this, function(e,f){
						this._adjustImage(e,f);
						this._whileMoving();
					}),
				
					// constrain to box. 
					constrainMax: true,
					maxWidth: mb.w, 
					maxHeight: mb.h,
				
					// sane default minimums:
					minWidth:40, 
					minHeight:40
				
				}).placeAt(this.picker);
			}
			
			// setup dnd behavior
			d.subscribe("/dnd/move/start", this, "_startDnd");
			d.subscribe("/dnd/move/stop", this, "_stopDnd");
			
			// janky IE src issue fix:
			d.isIE && (this.image.src = this.image.src);
			
			// only because our layout is fluid:
			this.connect(d.global, "onresize", "_positionPicker");
			
			if(this.hoverable){
				this.connect(this.container, "onmouseenter", "_enter");
				this.connect(this.container, "onmouseleave", "_leave");
			}
			
			setTimeout(dojo.hitch(this, "_positionPicker"), 125);
			
		},
		
		_adjustImage: function(e){
			
			var tc = this.coords, 
				s = this.scale; 
			
			// if we were called from the resizehandle, we probably need to adjust our scale.
			if(e && e.type && (e.type == "mouseup" || e.type == "mousemove")){ 
				var xy = d.coords(this.picker);
				this.scale = d.coords(this.preview).w / xy.w;
			}else if(e && e.type && e.type == "load" && this.imageReady(e)){ /* noop, imageReady fired */ }
				
			d.style(this.image, {
				height: _floor(tc.h * s) + pixels,
				width: _floor(tc.w * s) + pixels
			});
			
		},
		
		_positionPicker: function(e){
			// place the preview thinger somewhere relative to the container 
			// we wrapped around the orig image.
			var tc = this.coords = d.coords(this.container, true);
			d.style(this.preview,{
				left: tc.x + tc.w + 10 + pixels,
				top: tc.y + pixels
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
			if(this._interval){
				this.disconnect(this._interval);
				delete this._interval; // remember to delete it ;)
				if(this.resizeable && this._lastXY){
					// update the max size values of our handle to 
					// be based on our current position, only allowing
					// for the glass to be resized to the offset box
					// we're in (eg, @ top 50 with size 50, max next
					// size is 250). if top 0, use orig container size.
					var tc = this.coords;
					this._handle.maxSize = {
						h: _floor(tc.h - (this._lastXY.t - tc.t)),
						w: _floor(tc.w - (this._lastXY.l - tc.l))
					}
				}
			}
		},
		
		_whileMoving: function(){
			// while dnd in progress, adjust the backgroundPosition of the preview
			
			var xy = this._lastXY = d.coords(this.picker), 
				tc = this.coords, 
				r = this.image.width / tc.w,
				x = _floor((xy.l - tc.l) * r), 
				y = _floor((xy.t - tc.t) * r);
			
			// position the image relative to the picker's position 
			// in the container.
			d.style(this.image, {
				top: "-" + y + pixels, 
				left: "-" + x + pixels
			});
		},
		
		destroy: function(){
			// destroy our domNodes. this is a behavioral widget.
			// we can .destroy(true) and leave the image in tact
			d.place(this.domNode, this.container, "before");
			d.forEach(["preview","picker","container","image"], function(n){
				d.destroy(this[n]);
				delete this[n];
			}, this);
			this.inherited(arguments);
		},
		
		imageReady: function(){
			// stub fired anytime the preview.onload happens
		},
		
		_enter: function(e){
			// handler for mouseenter event
			this._anim && this._anim.stop();
			this._anim = d.anim(this.picker, { opacity: this.opacity });
		},
		
		_leave: function(e){
			// handler for mouseleave event
			if(!this._interval && !this._handle._isSizing){
				this._anim && this._anim.stop();
				this._anim = d.anim(this.picker, { opacity: 0 });
			}
		}
		
	});
	
	// setup the query "plugin"
	d.extend(d.NodeList, {
		preview: function(args){
			// example: dojo.query(".something").preview();
			return this.instantiate(image.Preview, args);
		}
	});
	
})(dojo, dojo.query);
