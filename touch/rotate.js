define(["dojo/_base/kernel", "dojox/gesture/Base", "dojo/_base/declare"], function(dojo, Base){
// module:
//		demos/touch/rotate
// summary:
//		A sample of rotate gesture(muti-touch) showing how to write a new customized gesture
//		Currently only works on iOS
//		- demos.touch.rotate -> to fire 'rotate' event
//		- demos.touch.rotate.end -> to fire 'rotate.end' event
// example:
//		|	dojo.connect(node, demos.touch.rotate, function(e){});
//		|	dojo.connect(node, demos.touch.rotate.end, function(e){});

var clz = dojo.declare(Base, {
	defaultEvent: "rotate",
	
	subEvents: ['end'],

	press: function(data, e){
		if(e.touches && e.touches.length == 2){
			data.rotateStart = true;
			data.rotation = 0;
			data.point1 = {
				x: e.touches[0].clientX,
				y: e.touches[0].clientY
			}
			data.point2 = {
				x: e.touches[1].clientX,
				y: e.touches[1].clientY
			}
		}
	},
	
	move: function(data, e){
		if(e.touches && e.touches.length == 2){
			var point1 = {
					x : e.touches[0].clientX,
					y : e.touches[0].clientY
			}
			var point2 = {
					x : e.touches[1].clientX,
					y : e.touches[1].clientY
			}
			if(e.rotation){
				data.rotation = e.rotation;
			}else{
				//calculate rotation manually if the event does not have rotation property 
				var rotation = 0;
				v1 = {
					x: point1.x - point2.x,
					y: point1.y - point2.y
				}
				v2 = {
					x: data.point1.x - data.point2.x,
					y: data.point1.y - data.point2.y
				}
				
				cos = (v1.x * v2.x + v1.y * v2.y) / (
					Math.sqrt(Math.pow(v1.x,2) + Math.pow(v1.y,2)) * 
					Math.sqrt(Math.pow(v2.x,2) + Math.pow(v2.y,2)) 
					);
				if(cos > 1){
					cos = 1;
				}
				if(cos < -1){
					cos = -1;
				}
				rotation = (Math.acos(cos) * 180) / Math.PI;
				if((v1.y * v2.x - v1.x * v2.y) > 0){
					data.rotation += rotation;
				}else{
					data.rotation -= rotation;
				}
			}
			
			data.point1 = point1;
			data.point2 = point2;
			e.rotation = data.rotation;
			this.fire(e.target, {type: "rotate", rotation: data.rotation});
		}
	},
	
	release: function(data, e){
		if(data.rotateStart){
			if(!e.rotation){
				e.rotation = data.rotation;
			}
			data.rotateStart = false;
			this.fire(e.target, {type: "rotate.end", rotation: data.rotation});
			data.rotation = 0;
		}
	}
});

var rotate = new clz();

var ns = dojo.getObject("demos.touch", true);

return (ns.rotate = rotate);//demos.touch.rotate

});