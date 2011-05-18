define(["dojo", "dojo/gesture"], function(dojo, gesture){
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

var clz = dojo.declare(null, {
	defaultEvent: "rotate",
	
	subEvents: ['end'],

	press: function(gestureElement, e){
		if(e.touches && e.touches.length == 2){
			gestureElement.rotateStart = true;
			gestureElement.rotation = 0;
			gestureElement.point1 = {
				x: e.touches[0].clientX,
				y: e.touches[0].clientY
			}
			gestureElement.point2 = {
				x: e.touches[1].clientX,
				y: e.touches[1].clientY
			}
		}
	},
	
	move: function(gestureElement, e){
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
				gestureElement.rotation = e.rotation;
			}else{
				//calculate rotation manually if the event does not have rotation property 
				var rotation = 0;
				v1 = {
					x: point1.x - point2.x,
					y: point1.y - point2.y
				}
				v2 = {
					x: gestureElement.point1.x - gestureElement.point2.x,
					y: gestureElement.point1.y - gestureElement.point2.y
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
					gestureElement.rotation += rotation;
				}
				else{
					gestureElement.rotation -= rotation;
				}
			}
			
			gestureElement.point1 = point1;
			gestureElement.point2 = point2;
			
			e.rotation = gestureElement.rotation;
			gesture.fire(gestureElement, "rotate", e);
		}
	},
	
	release: function(gestureElement, e){
		if(gestureElement.rotateStart){
			if(!e.rotation){
				e.rotation = gestureElement.rotation;
			}
			gestureElement.rotateStart = false;
			gesture.fire(gestureElement, "rotate.end", e);
			gestureElement.rotation = 0;
		}
	}
});

var rotate = new clz();

gesture.register(rotate);

var ns = dojo.getObject("demos.touch", true);

return (ns.rotate = rotate);//demos.touch.rotate

});