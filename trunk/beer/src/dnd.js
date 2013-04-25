dojo.provide("demos.beer.src.dnd");
dojo.require("dojo.dnd.Moveable");

dojo.declare("beer.MadeDnd", null, {
	
	constructor: function(node){
		this.node = dojo.byId(node);
		dojo.setSelectable(this.node, false);
		dojo.connect(this.node, "onmousedown", this, "_dragStart");
		this._size = dojo.marginBox(this.node);
		this._listeners = [];
	},
	
	_dragStart: function(e){
		this.avatar = dojo.place(dojo.clone(this.node), dojo.body());
		var xy = this._origxy = dojo.position(this.node);
		dojo.style(this.avatar, {
			position:"absolute",
			top: xy.y + "px",
			left: xy.x + "px"
		});
		this._listeners.push(
			dojo.connect(dojo.global, "onmouseup", this, "_dragStop"),
			dojo.connect(dojo.global, "onmousemove", this, "_moving")
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
		dojo.forEach(this._listeners, dojo.disconnect, dojo);
		this._listeners = [];
		
		if(this.overTarget(e)){
			
			new dojo.dnd.Moveable(this.avatar);
			
		}else{
			dojo.animateProperty({
				node:this.avatar,
				onEnd: function(n){
					dojo.destroy(n);
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

dojo.declare("beer.DndTarget", null, {
	constructor: function(node, args){
		this.node = dojo.byId(node);
		this.pos();
		beer.targets.push(this);
	},
	pos: function(){
		console.log("updating position");
		this.coords = dojo.coords(this.node);
	}
});

dojo.addOnLoad(function(){
	dojo.connect(dojo.global, "resize", function(){
		dojo.forEach(beer.targets, "item.pos()");
	});
});
