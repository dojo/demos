define([
	"dojo",
	"dojo/has",
	"dojo/_base/array",
	"dojo/_base/declare",
	"dojo/dom-class",
	"dojo/fx",
	"dojo/_base/lang",
	"dojo/dom-style",
	"dojo/fx/easing",
	"dojo/parser",
	"dojo/query",
	"dojo/topic",
	"dojo/on",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetBase",
	"dijit/focus",
	"dojo/dom-geometry",
	"dijit/registry",
	"dojo/_base/fx",
	"dojo/keys"
], function (dojo, has, arrayUtil, declare, domClass, fx, lang, domStyle, easing, parser, query, topic, on, _TemplatedMixin, _WidgetBase, focus, domGeometry, registry, baseFx, keys) {

	declare("image.Skewed",
		[_WidgetBase, _TemplatedMixin],{
		// a node on the surface
		
		imgUrl: "", // dojo.moduleUrl("dojo", "resources/blank.gif"),
		// filterUrl: String
		//		Endpoint to get valid image data. This url is passed query params
		//		of 'src' (the original filename) and dir 1 || 0 (left of right skew)
		//		The default [supplied] implementation uses PHP-5 and required the GD
		//		library.
		filterUrl:"imageReflect.php",
	
		// Selected: Boolean
		//		Is image initially selected
		selected:"",
		// value: String
		//		Each Item has a value associated with it's image.
		value:"",
	
		reflectSpacing: 5,
		angle: 25,
	
		templateString:
			'<div class="anImage"><div data-dojo-attach-point="holder" class="imageInner">'+
				'<img data-dojo-attach-point="leftImage" class="imageNodeLeft" src="${imgUrl}" alt="${value}" />'+
				'<img data-dojo-attach-point="imageNode" class="imageNodeCenter" src="${imgUrl}" alt="${value}" />'+
				'<img data-dojo-attach-point="rightImage" class="imageNodeRight" src="${imgUrl}" alt="${value}" />'+
			'</div></div>',
			
		postCreate: function(){
			// summary:
			//		start the widget, and fetch the filtered images.
			this.inherited(arguments);
			this.imageNode.src = this.filterUrl + "?greyscale=1&src=" + this.imgUrl + "&spacing=" + this.reflectSpacing;
			this.leftImage.src = this.filterUrl + "?greyscale=1&src=" + this.imgUrl + "&skew=left&angle=" + this.angle + "&spacing=" + this.reflectSpacing;
			this.rightImage.src = this.filterUrl + "?greyscale=1&src=" + this.imgUrl + "&skew=right&angle=" + this.angle + "&spacing=" + this.reflectSpacing;
			on(this.domNode,"focus",lang.hitch(this, this.center));
		},
		
		startup: function(){
			if(!this._started){
				this.inherited(arguments);
				if(this.selected){
					this.center();
				}
			}
		},
		
		center: function(e){
			// summary:
			//		public function to center a particular image
			var p = registry.getEnclosingWidget(this.domNode.parentNode);
			p._center(this.domNode);
		}
		
	});
	
	declare("image.Container",
		[_WidgetBase,_TemplatedMixin],
		{
	
		// loop: Boolean
		//		If true, Images will loop when continuing on beyond end or before beginning
		loop:false,
		// useWheel: Boolean
		//		Disable/enable mouse wheel listener
		useWheel: true,
		// useDrag: Boolean
		//		Experimental: NOT WORKING, toggles dragging a direction on the pane as
		//		a method of reordering
		useDrag: false,
		// spacing: Integer
		//		The relative offset of each image from it's immediate siblings
		spacing: 50,
		_spacing: 50, // an additional param for offset from center
		
		
		// only use even numbers:
		visibleItems: 15,
		
		// offOpacity: Float
		//		An opacity value to set to the images that do not have focus
		offOpacity: 0.75,
		
		// easing: String|Function
		//		An easing function [name] to use
		easing:easing.easeOut,
		
		templateString:
			'<div tabIndex="0"><div class="imageContainer" data-dojo-attach-point="containerWrapper,containerNode">'+
			'</div></div>',
			
		postCreate:function(){
			
			this.inherited(arguments);
			this.threshold = (this.visibleItems + (this.visibleItems % 2)) / 2;
	
			var node = this.domNode;
			domStyle.set(this.containerWrapper, "position", "relative");
			this.easing = (lang.isString(this.easing) ? lang.getObject(this.easing) : this.easing);
	
			if(has("ie")){
				// FIXME: can move to css with .dj_ie prefix
				domStyle.set(this.containerNode, "overflow", "hidden");
			}
	
			on(node,"click","_click");
			on(node,"keypress","_handleKey");
			if(this.useWheel){
				on(node, (!has("mozilla") ? "mousewheel" : "DOMMouseScroll"), "_scroll");
			}
	
		},
		
		startup:function(){
			
			// sets this.nl
			if(this._started) return;
			this.inherited(arguments);
			var sel = Math.floor(this._getChildren().length / 2);
			// FIXME: if no children, this throws an error
			this._center(this.nl[sel].firstChild);
			
		},
		
		_getChildren: function(){
			this.nl = query(".anImage",this.domNode);
			return this.nl;
		},
		
		_click: function(e){
			if(!has("ie")){
				focus(this.domNode);
			}
			var n = e.target;
			if(n !== this.domNode && n !== this.containerNode){
				this._center(n);
			}
		},
	
		resize: function(){
			this._size = {
				w: this.domNode.clientWidth,
				h: this.domNode.clientHeight
			};
			if(has("ie")){
				domGeometry.setMarginBox(this.containerNode,lang.mixin(this._size,{ t: 0, l:0 }));
			}
			if(this.selectedChild){
				this._center(this.selectedChild.domNode);
			}
		},
		
		_center: function(/* DomNode */node){
			// summary:
			//		Main function used to arrage the images based on a selected node
			var w = registry.getEnclosingWidget(node);
			if(this._centering){
				this.selectedChild = w;
				return;
			}
			this._centering = true;
			var _anims = [];
			
			var currentIdx = null;
			if(this.selectedChild){
				currentIdx = this.nl.indexOf(this.selectedChild.domNode);
			}
								
			this.selectedChild = w;
			var x = this.nl.indexOf(w.domNode);
			
			// fire our stub functions
			this[(x === currentIdx ? "onSelected" : "onShow")](this.selectedChild);
			
			if(!this._size){ this.resize(); }
			var centerL = Math.floor(this._size.w / 2);
			
			// FIXME: we can use just a slice around +/- x for long lists! (alex?)
			var _delay = 10;
			var _diff = this._spacing;
			var thresh = this.threshold;
			var some = this.nl.map(function(n,i){
				var dist = Math.abs(i - x);
				domStyle.set(n, "display", Math.abs(i - x) > thresh ? "none" : "");
				
			});
			
			this.nl
				.forEach(function(n,i){
		
					var isNextRight = (i === x + 1);
					var isNextLeft = (i === x - 1);
					var _mix = {
						opacity: this.offOpacity,
						zIndex:69
					};
	
					var c;
					if(i > x){
						c = "alignRight";
						// stagger z-index downward from center on
						_mix.zIndex = isNextRight ? 45 : 40 - i;
					}else if(i < x){
						c = "alignLeft";
						// left z-indexes are fine, they go in order of markup
						_mix.zIndex = isNextLeft ? 45 : 40;
					}else{
						// center should be on top always
						c = "alignCenter";
						_mix.opacity = 1;
					}
					domStyle.set(n, _mix);
					arrayUtil.forEach(["alignLeft","alignRight","alignCenter"],function(cl){
						domClass.remove(n,cl);
					});
					domClass.add(n,c);
					
					// need to make dynamic, this is "half the size of a single image"
					var _half = 50;
					
					if(currentIdx || currentIdx === 0){
						// figure out where our left edge will be: magically,
						// this centers and seems to subtly get further from
						// center. need maff master here:
						var d = i - x;
						var _off = (d === 0 ? 0 : _diff) * (d < 0 ? -1 : 1);
						var lef = centerL - _half + (d * this.spacing) + _off;
	
						// create another animation for this node:
						_anims.push(
							baseFx.animateProperty({
								duration:150,
								node:n,
								properties: { left: lef },
								delay: parseInt(_delay),
								easing: this.easing
							})
						);
						// oh so slightly, or less if going away from node:
						_delay += (d < 0 ? 15 : -15);
					}
	
				}, this) // forEach
			;
			
			// don't use onEnd here, but might ought to stop()?
			// seems like it handles the new animations okay?
			this._anim && this._anim.stop && this._anim.stop();
			
			this._anim = fx.combine(_anims);
			this._anim.play();
			this._centering = false;
			
		},
		
		onShow: function(widget){
			// summary:
			//		stub fired when a user triggers a recenter
			//		this could happen very often!
		},
		
		onSelected: function(widget){
			// summary:
			//		stub fired when a user explicitly clicks the already displayed value
		},
		
		_handleKey: function(e){
			// summary:
			//		keyboard handling code
			var dk = keys,
				cur = this.nl.indexOf(this.selectedChild.domNode || this.nl[0]),
				ni
			;
			
			switch(e.charOrCode){
				
				case dk.RIGHT_ARROW:
					// goto next item or stop if loop='false' and at end
					ni = cur + 1;
					if(ni >= this.nl.length){ ni = (this.loop ? 0 : cur); }
					if(ni !== cur){ this._center(this.nl[ni]);	}
					break;
	
				case dk.LEFT_ARROW:
					// ditto, but left.
					ni = cur - 1;
					if(ni < 0){ ni = (this.loop ? this.nl.length - 1 : cur); }
					if(ni !== cur){ this._center(this.nl[ni]); }
					break;
				
				case dk.ENTER:
					// just like clicking a selected image
					this.onSelected(this.selectedChild);
					break;
			}
			
		},
		
		_scroll: function(e){
			// summary:
			//		handle mouse wheel event, and duck type a fake event to pass
			//		along to _handleKey
			e.preventDefault();
			e.stopPropagation();
			var scroll = e[(!has("mozilla") ? "wheelDelta" : "detail")] * (!has("mozilla") ? 1 : -1);
			this._handleKey({
				charOrCode: keys[(scroll > 0 ? "LEFT_ARROW" : "RIGHT_ARROW")]
			});
			
		}
		
	});
	
	
	return image.Skewed;
});