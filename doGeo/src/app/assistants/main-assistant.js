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
	
	// Parameterised YQL search string for finding Four Square venues based upon a latitude and longitude
	this.searchYQL = "select * from foursquare.venues where geolong = '${0}' and geolat = '${1}'";
	

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

	dojo.subscribe("/images", function(images){
		console.log("Got images ", images);
        
        this.dataAvailable(
            _this.venues.map(function(record, i){
                record.image = images[i];
                record.title = record.name;
                record.backFaceId = "backface1";
                return record;
            })
	    );
		
	});
	
  },

  dataAvailable: function(data){
    var coverflow = new wink.ui.xyz.CoverFlow({
      covers: data,
      size: 300,
      viewportWidth: window.innerWidth,
      reflected: true,
      displayTitle: true,
      fadeEdges: true,
      handleOrientationChange: true,
      handleGesture: true,
      backgroundColor: { r: 0, g: 0, b: 0 },
      coverSpacing: 25, 			// [optional]
      displayTitleDuration: 1000,	// [optional]
      borderSize: 2 				// [optional]
    });
    $("container").appendChild(coverflow.getDomNode());
  },
  
  activate: function(data){
    console.log("In main assistant activate");
    
   // this.findAddressImages(["London", "Paris"], this.handleAddressResults);
	
	var _this = this;
	this.getVenuesNearby(function(data){
		
		console.log("---->>>> getVenues: ", data);
		data = data.query.results.venues.group.venue;
		
		console.log("---->>>> getVenues: ", data);
		if(!dojo.isArray(data)){
			data = [data];
		}
		
		_this.venues = data;
		_this.findAddressImages(dojo.map(data, function(item){
			var str = item.name;
			
//			if(item.address){
//				str += "," + item.address;
//			}
//			if(item.city){
//				str += "," + item.city;
//			}
			
			return str;
		}), _this.handleAddressResults);
		
	}, function(){
		console.log("error");
	});
  },
  
  findAddressImages: function(addresses, callback){
  	//http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20query.multi%20where%20queries%3D%22
	//select%20*%20from%20json%20where%20url%3D%27http%3A%2F%2Fajax.googleapis.com%2Fajax%2Fservices%2Fsearch%2Fimages%3Fv%3D1.0%26q%3DLondon%26count%3D1%27
	//%3B

	//http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20query.multi%20where%20queries%3D%22
	//select%20*%20from%20json%20where%20url%3D%27http%3A%2F%2Fajax.googleapis.com%2Fajax%2Fservices%2Fsearch%2Fimages%3Fv%3D1.0%26q%3D101%20Allen%20Laundromat%20Inc%2C101%20Allen%20Street%26count%3D1%27
	//%3B
	//select%20*%20from%20json%20where%20url%3D%27http%3A%2F%2Fajax.googleapis.com%2Fajax%2Fservices%2Fsearch%2Fimages%3Fv%3D1.0%26q%3DBank%20Street%20Laundromat%2C296%20West%204th%20Street%26count%3D1%27
	//%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys
	
	
//
//	if(addresses.length > 5){
//		addresses = addresses.slice(0, 5);
//	}
		addresses = addresses.slice(0, 2);
	
    var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20query.multi%20where%20queries%3D%22";
    var urlEnd = "%27%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys;"

    url += dojo.map(addresses, function(address){
		var google = "http://ajax.googleapis.com/ajax/services/search/images?v=1.0&count=1&q="
		+ address;
		
		console.log("===>> " + google);
		
		google = escape(google);
		
		return "select%20*%20from%20json%20where%20url%3D%27" + google;
		
		
//		"ajax.googleapis.com%2Fajax%2Fservices%2Fsearch%2Fimages%3Fv%3D1.0%26q%3D"
//		+ escape(address)
//		+ "%26count%3D1%27";
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
  
  // Retrieve venues near the user's current location as listed
  // by four square. Use YQL to parse and return response from
  // the Four Square API. HTML5 Geolocation API used to extract the current
  // location.
  getVenuesNearby : function (callback, errback) {
	// Callback to search Four Square, through YQL, for venues
	// near the location passed in.
	
	var searchCallback = dojo.hitch(this, function (location) {
		console.log("lat long searchCallback", location);
		
		var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20foursquare.venues%20where%20%20geolong%20%3D%20'"
		+ location[0]
		+ "'%20and%20geolat%20%3D%20'"
		+ location[1]
		+ "'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
		
		var deferred = dojo.io.script.get({
			url: url,
			jsonp: "callback"
		});
		deferred.addBoth(callback);
	});
	// Current latitude and longitude
	this.getCurrentLatLong(searchCallback);
  },

  // Use HTML5 GeoLocation API to retrieve current user's location.
  getCurrentLatLong : function (callback) {
  	callback([40.7204, -73.9933]);//nyc
	return;
	if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition(function(position) {
		// Grab and pass the latitude and longitude attributes and execute callback
		callback([position.coords.latitude, position.coords.longitude]);
   	  });
	} else {
		console.log("No geo");
	}
  },
  
  setService: function(name){
  	this.serviceName = name;
  	dojo.query("span", this.serviceBtn.domNode)[0].innerHTML = name;
	
	
  }
  
});