define([
	"dojo/ready",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/dom",
	"dojo/on",
	"dojo/parser",
	"dojo/request",
	"dijit/form/Button",
	"dojox/analytics/Urchin",
	"dojox/embed/Flash",
	"dojox/form/FileUploader",
	"dijit/registry",
	"dojo/_base/unload"
], function (ready, lang, array, dom, on, parser, request, formButton, analyticsUrchin, embedFlash, formFileUploader, registry, unload) {

	//using this early for the forceNoFlash test:
	forceNoFlash = false;
	selectMultipleFiles = false;
	
	var qs = window.location.href.split("?");
	
	if(qs.length>1){
		qs = qs[1];
		if(qs.indexOf("forceNoFlash")>-1){
			forceNoFlash = true;
		}
		if(qs.indexOf("multiMode")>-1){
			selectMultipleFiles = true;
		}
	}
	 
	var setLoc = function(href){
		window.location.href = window.location.href.split("?")[0] + href;
	};
	
	showWithFlash = function(){
		if(forceNoFlash){
			setLoc("");
		}
	};
	
	showWithoutFlash = function(){
		if(!forceNoFlash){
			setLoc((selectMultipleFiles) ? "?forceNoFlash&multiMode" : "?forceNoFlash");
		}
	};
	
	showMulti = function(){
	 	if(!selectMultipleFiles){
			setLoc((forceNoFlash) ? "?forceNoFlash&multiMode" : "?multiMode");
		}
	};
	
	showSingle = function(){
	 	if(selectMultipleFiles){
			setLoc((forceNoFlash) ? "?forceNoFlash" : "");
		}
	};
	
	imageHTML = function(data){
		console.log("DATA:", data);
		var w = (data.width<320)?data.width:320;
		var date;
		if(data.creationDate){
			var d = data.creationDate.toString().split(" ");
			console.log("D:", d);
			date = d[0]+" "+d[1]+" "+d[2]+" "+d[3];
		}else{
			date = "NA";
		}
		console.log("DATE:",date);
		var name = data.file.split("/")[data.file.split("/").length-1];
		var txt = 	'<div class="picFrame">'+
	    			'<img src="'+data.file+'" width="'+w+'">'+
					'<div class="picDesc"'+
						'<div class="name"><strong>'+name+'</strong></div>'+
						'<div class="date">Date Created: <strong>'+date+'</strong></div>'+
						'<div class="dim">Dimensions: <strong>'+data.width+' x '+data.height+'</strong></div>'+
						'<div class="size">Size: <strong>'+Math.ceil(data.size*.001)+'KB</strong></div>'+
						
					'</div>'+
					'</div>'
		return txt;
	};
	
	var uploadUrl = "UploadFile.php";
	var rmFiles = "";
	var fileMask = [
		["Jpeg File", 	"*.jpg;*.jpeg"],
		["GIF File", 	"*.gif"],
		["PNG File", 	"*.png"],
		["All Images", 	"*.jpg;*.jpeg;*.gif;*.png"]
	];
	// For testing 1D array masks:
	// var fileMask = 	["All Images", 	"*.jpg;*.jpeg;*.gif;*.png"];
	// var fileMask = 	["PNG File", 	"*.png"];
	
	ready(function(){
	
		if(forceNoFlash){
			embedFlash.available = 0;
			dom.byId("hasFlash").style.display = "none";
			dom.byId("fTypes").style.display = "none";
		}else{
			dom.byId("noFlash").style.display = "none";
			if(lang.isArray(fileMask[0])){
				dom.byId("fTypes").innerHTML+=fileMask[fileMask.length-1][1];
			}else{
				dom.byId("fTypes").innerHTML+=fileMask[1];
			}
		}
		
		if(selectMultipleFiles){
			dom.byId("fmode").innerHTML = dom.byId("hmode").innerHTML = "Multi-File Mode";
			dom.byId("fSingle").style.display = "none";
			dom.byId("hSingle").style.display = "none";
			registry.byId("fbm").domNode.style.display = "none";
			registry.byId("hbm").domNode.style.display = "none";
		}else{
			dom.byId("fmode").innerHTML = dom.byId("hmode").innerHTML = "Single-File Mode";
			dom.byId("fMulti").style.display = "none";
			dom.byId("hMulti").style.display = "none";
			registry.byId("fbs").domNode.style.display = "none";
			registry.byId("hbs").domNode.style.display = "none";
		}
		dom.byId("uploadedFiles").value = "";
		dom.byId("fileToUpload").value = "";
	
		console.log("LOC:", window.location)
		console.log("UPLOAD URL:",uploadUrl);
		
		var f0 = new formFileUploader({
			button:registry.byId("btn0"),
			degradable:true,
			uploadUrl:uploadUrl,
			uploadOnChange:false,
			selectMultipleFiles:selectMultipleFiles,
			fileMask:fileMask,
			isDebug:true
		});
		
		doUpload = function(){
			console.log("doUpload")
			dom.byId("fileToUpload").innerHTML = "uploading...";
			f0.upload();
		}
		on(f0, "Change", function(data){
			console.log("DATA:", data);
			array.forEach(data, function(d){
				//file.type no workie from flash selection (Mac?)
				if(selectMultipleFiles){
					dom.byId("fileToUpload").value += d.name+" "+Math.ceil(d.size*.001)+"kb \n";
				}else{
					dom.byId("fileToUpload").value = d.name+" "+Math.ceil(d.size*.001)+"kb \n";
				}
			});
		});
	
		on(f0, "Progress", function(data){
			console.warn("onProgress", data);
			dom.byId("fileToUpload").value = "";
			array.forEach(data, function(d){
				dom.byId("fileToUpload").value += "("+d.percent+"%) "+d.name+" \n";
				
			});
		});
	
		on(f0, "Complete", function(data){
			console.warn("onComplete", data);
			array.forEach(data, function(d){
				dom.byId("uploadedFiles").value += d.file+" \n";
				dom.byId("rgtCol").innerHTML += imageHTML(d);//'<img src="'+d.file+'" />';
				rmFiles+=d.file+";";
			});
		});
		
		Destroy = function(){
			f0.destroyAll();
		}
		
		new analyticsUrchin({
			acct: "UA-3572741-1",
			GAonLoad: function(){
				this.trackPageView("/demos/uploader");
			}
		});
		
	});
	
	cleanUp = function(){
		dom.byId("rgtCol").innerHTML = "";
		dom.byId("uploadedFiles").value = "";
		dom.byId("fileToUpload").value = "";
		request(uploadUrl, {method: "GET", handleAs:"text", content:{
				rmFiles:rmFiles
			}});
		rmFiles = "";
	};
	
	unload.addOnUnload(function(){
		console.log("You're leaving the page");
		cleanUp();
	});
	
});