dojo.provide("MainAssistant");
dojo.require("dojox.mobile.app.SceneAssistant");

dojo.declare("MainAssistant", dojox.mobile.app.SceneAssistant, {
  
  setup: function(){
    console.log("In main assistant setup");
    
    // Instantiate widgets in the template HTML.
    this.controller.parse();
    
	this.setService("FourSquare")
	
  },
  
  activate: function(data){
    console.log("In main assistant activate");
    
  },
  
  setService: function(name){
  	dijit.byId("serviceBtn").domNode.innerHTML = name;
  }
  
});