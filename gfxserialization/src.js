require([
	"dojo/ready",
	"dojo/_base/sniff",
	"dojo/on",
	"dojo/aspect",
	"dojo/string",
	"dojo/json",
	"dojo/dom",	
	"dojo/dom-geometry",
	"dojo/dom-attr",
	"dojo/_base/array",
	"dojox/gfx",
	"dojox/gfx/matrix",
	"dojox/gfx/utils",
	"dojox/gfx/Moveable",
	"dojo/text!./resources/shapes.json"
],function(ready, has, on, aspect, string, json, dom, domgeom, domattr, array, gfx, matrix, gutils, Moveable, lion){
	var surfaces=[], cc, overview, timer, delayUpdate;

	var initSurface = function(){
		gutils.fromJson(surfaces[0], lion);
		array.forEach(surfaces[0].children, function(s){
			var v = new Moveable(s);
			aspect.after(v,"onMoved", copy);
		});
		// carboncopy
		cc = surfaces[1].createGroup();
		surfaces[1].createImage({src:'./resources/specimen.png',width:300,height:300});
	};
	
	var copy = function(){
		if (timer)
			clearTimeout(timer);
		var f = function(){
			var c = gutils.serialize(surfaces[0]);
			dojo.byId("textview").innerHTML=json.stringify(c);
			cc.clear();
			gutils.deserialize(cc,c);
		};
		if(delayUpdate){
			timer = setTimeout(f, 200);
		}else{
			f();
		}
	};
	ready(function(){
		var box;			
		array.forEach(["surface","overview"], function(id){
			box = domgeom.getContentBox(dom.byId(id));
			surfaces.push(gfx.createSurface(id, box.width, box.height));
		}) 
		overview = dom.byId("overview");
		initSurface();
		copy();
		var cbox = dom.byId("bufferCheck"); 
		if (has("ie")<9){
			domattr.set(cbox,"checked", true);
		}
		on(cbox,"click", function(){
			delayUpdate = domattr.get(cbox,"checked");
		});
		delayUpdate = domattr.get(cbox,"checked");
	});
});
