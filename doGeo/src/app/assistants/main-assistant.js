dojo.provide("MainAssistant");
dojo.require("dojox.mobile.app.SceneAssistant");

dojo.declare("MainAssistant", dojox.mobile.app.SceneAssistant, {
  
  setup: function(){
    console.log("In main assistant setup");
    
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
    
  },
  
  setService: function(name){
  	this.serviceName = name;
  	dojo.query("span", this.serviceBtn.domNode)[0].innerHTML = name;
	
	
  }
  
});