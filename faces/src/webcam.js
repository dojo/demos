define([
	"dojo/ready",
	"dojo/dom",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/query",
	"dojox/embed/Flash"
], function (ready, dom, domClass, domStyle, query, embedFlash) {

	function setImage(data){
		base64Img = "data:image/jpeg;base64," + data;
		var found = false;
		for(var i in people){
			if(people[i]=="webcam"){
				found = true;
				break;
			}
		}
		if(! found) people.push("webcam");
		domStyle.set(dom.byId("photoShot"), "display", "none");
		query("#hair, #eyes, #mouth").forEach(function(item){
			var image = new Image();
			image.src = base64Img;
			//dojo.body().appendChild(image);
			domStyle.set(item, "backgroundImage", "url(" + image.src + ")");
		});
	}
	
	ready(function(){
	
		var swf = require.toUrl("dojoc/flash/photo_shot.swf");
		var args = {
			path: swf,
			width:"100%",
			height:"100%",
			params:{
				allowFullScreen:true,
				wmode:"transparent"
			}
		};
		var flashObj = new embedFlash(args, "photoShot");
		
		query("#addPic").onclick(function(e){
			domStyle.set("photoShot", "display", "");
		});
		
		domClass.remove("addPic","invisible");
		
	});
});