dojo.provide("demos.beer.src.dnd");

dojo.declare("beer.MadeDnd", null, {
	
	constructor: function(node){
		this.node = dojo.byId(node);
		dojo.connect(this.node, "onmousedown", this, "_dragStart");
	},
	
	_dragStart: function(e){
		this.avatar = dojo.place(dojo.clone(this.node), dojo.body());
		var xy = dojo.coords(this.node);
		dojo.style(this.avatar, {
			position:"absolute", 
			top: xy.y + "px", 
			left: xy.x + "px"
		});
		dojo.connect(this.avatar, "onmouseup", this, "_dragStop");
		this._listener = dojo.connect(dojo.global, "onmousemove", this, "_moving");
	},
	
	_moving: function(e){
		console.log("doit!");
	},
	
	_dragStop: function(e){
		console.log("endit");
		dojo.disconnect(this._listener);
		dojo.destroy(this.avatar);
	}
	
})