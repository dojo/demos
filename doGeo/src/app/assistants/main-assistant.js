dojo.provide("MainAssistant");
dojo.require("dojox.mobile.app.SceneAssistant");

dojo.declare("MainAssistant", dojox.mobile.app.SceneAssistant, {
  
  setup: function(){
    console.log("In main assistant setup");
	
	this.handleAddressResults = dojo.hitch(this, this.handleAddressResults);
    
    // Instantiate widgets in the template HTML.
    this.controller.parse();
    
	this.serviceBtn = dijit.byId("serviceBtn");
	this.setService("FourSquare");
	
	var _this = this;
	
	dojo.connect(this.serviceBtn, "onClick", function(event){
		this.controller.popupSubMenu({
	      choices: [
	        {label: "FourSquare", value: "FourSquare"},
	        {label: "Twitter", value: "Twitter"},
	        {label: "Flickr", value: "Flickr"}
	      ],

	      fromNode: event.target,
	      
	      onChoose: function(value){
		  	if(!value){
				return;
			}
			dojo.publish("/service", [value]);
	      }
	    });
	});
	dojo.subscribe("/service", dojo.hitch(this, this.setService));
  },
  
  activate: function(data){
    console.log("In main assistant activate");
    
	//this.findAddressImages(["London", "Paris"], this.handleAddressResults);
  },
  
  findAddressImages: function(addresses, callback){
  	//http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20query.multi%20where%20queries%3D%22
	//select%20*%20from%20json%20where%20url%3D%27http%3A%2F%2Fajax.googleapis.com%2Fajax%2Fservices%2Fsearch%2Fimages%3Fv%3D1.0%26q%3DLondon%26count%3D1%27
	//%3B
	//select%20*%20from%20json%20where%20url%3D%27http%3A%2F%2Fajax.googleapis.com%2Fajax%2Fservices%2Fsearch%2Fimages%3Fv%3D1.0%26q%3DParis%26count%3D1%27
	//%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys
	
    var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20query.multi%20where%20queries%3D%22";
    var urlEnd = "%27%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys;"

    url += dojo.map(addresses, function(address){
		return "select%20*%20from%20json%20where%20url%3D%27http%3A%2F%2F" + 
		"ajax.googleapis.com%2Fajax%2Fservices%2Fsearch%2Fimages%3Fv%3D1.0%26q%3D"
		+ address
		+ "%26count%3D1%27";
	}).join("%3B") + "%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
	
	
	console.log("url = ", url);
	
    var deferred = dojo.io.script.get({
		url: url,
		jsonp: "callback"
	});
	deferred.addBoth(callback);
  },
  
  handleAddressResults: function(data){
  	console.log("handleAddressResults ", data);
	
	if(!data || !data.query || !data.query.results || !data.query.results.results){
		// nothing returned
		console.log("Wonky data?");
		return null;
	}
	
	var imageUrls = dojo.map(data.query.results.results, this.parseImageResults);
	
	console.log("Got image urls ", imageUrls);
	dojo.publish("/images", [imageUrls]);
	return imageUrls;
  },
  
  parseImageResults: function(data){
  	if(!data.json || !data.json.responseData || !data.json.responseData.results){
		return null;
	}
	return data.json.responseData.results[0].tbUrl;
  },
  
  setService: function(name){
  	this.serviceName = name;
  	dojo.query("span", this.serviceBtn.domNode)[0].innerHTML = name;
	
	
  }
  
});