dojo.provide("demos.faces.src.webcam");
dojo.require("dojox.embed.Flash");

function setImage(data){
	base64Img = "data:image/jpeg;base64," + data;
	var found = false;
	for(i in people){
		if(people[i]=="webcam"){
			found = true;
			break;
		}
	}
	if(! found) people.push("webcam");
	dojo.style(dojo.byId("photoShot"), "display", "none");
	dojo.query("#hair, #eyes, #mouth").forEach(function(item){
		var image = new Image();
		image.src = base64Img;
		//dojo.body().appendChild(image);
		dojo.style(item, "backgroundImage", "url(" + image.src + ")");
	});
}

dojo.addOnLoad(function(){

	var swf = dojo.moduleUrl("dojoc.flash", "photo_shot.swf");
	var args = {
		path: swf,
		width:"100%",
		height:"100%",
		params:{
			allowFullScreen:true,
			wmode:"transparent"
		}
	}
	var flashObj = new dojox.embed.Flash(args, "photoShot");
	
	dojo.query("#addPic").onclick(function(e){
		dojo.style("photoShot", "display", "");
	});
	
	dojo.removeClass("addPic","invisible");
	
});