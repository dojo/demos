define([
	"dojo",
	"dojo/_base/declare",
	"dojo/_base/window",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/_base/fx",
	"dojo/dnd/Moveable",
	"dojo/_base/connect",
	"dojo/dom",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-style",
	"dojo/on",
	"dojo/ready"
], function (dojo, declare, win, lang, arrayUtil, fx, dndMoveable, connect, dom, domConstruct, domGeometry, domStyle, on, ready) {

	declare("beer.MadeDnd", null, {
		
		constructor: function(node){
			this.node = dom.byId(node);
			dom.setSelectable(this.node, false);
			on(this.node, "mousedown", lang.hitch(this, "_dragStart"));
			this._size = domGeometry.getMarginBox(this.node);
			this._listeners = [];
		},
		
		_dragStart: function(e){
			this.avatar = domConstruct.place(lang.clone(this.node), win.body());
			var xy = this._origxy = domGeometry.position(this.node);
			domStyle.set(this.avatar, {
				position:"absolute",
				top: xy.y + "px",
				left: xy.x + "px"
			});
			this._listeners.push(
				on(dojo.global, "mouseup", lang.hitch(this, "_dragStop")),
				on(dojo.global, "mousemove", lang.hitch(this, "_moving"))
			);
		},
		
		_moving: function(e){
			var s = this.avatar.style,
				mb = this._size
			;
			s.top = e.pageY - (mb.h / 2) + "px";
			s.left = e.pageX - (mb.w / 2) + "px";
		},
		
		_dragStop: function(e){
			arrayUtil.forEach(this._listeners, connect.disconnect, dojo);
			this._listeners = [];
			
			if(this.overTarget(e)){
				
				new dndMoveable(this.avatar);
				
			}else{
				fx.animateProperty({
					node:this.avatar,
					onEnd: function(n){
						domConstruct.destroy(n);
					},
					properties:{
						opacity:0,
						top: this._origxy.y,
						left: this._origxy.x
					},
					duration:175
				}).play(10);
			}
			
		},
		
		overTarget: function(e){
			return true;
	//		return dojo.some(beer.targets, function(target){
	//			return true;
	//		})[0];
		}
		
	});
	
	beer.targets = [];
	
	declare("beer.DndTarget", null, {
		constructor: function(node, args){
			this.node = dom.byId(node);
			this.pos();
			beer.targets.push(this);
		},
		pos: function(){
			console.log("updating position");
			this.coords = domGeometry.position(this.node);
		}
	});
	
	ready(function(){
		on(dojo.global, "resize", function(){
			arrayUtil.forEach(beer.targets, "item.pos()");
		});
	});
	
	return beer.dnd;
});