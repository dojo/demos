dojo.provide("demos.beer.src.api");

dojo.require("dojox.rpc.Service");

dojo.addOnLoad(function(){

	var beerService = {
		"SMDVersion": "2.0",
		"id": "dojoBeer",
		"description": "Dojo Beer Demo API",
		"transport": "JSON",
		"envelope": "URL",
		"additionalParameters": true,
		"services" : {
			"login" : {
				"target":"api.php",
				"parameters":[
					{ "name": "user" },
					{ "name": "pass" }
				]
			}
		}
	};

	beer.api = new dojox.rpc.Service(dojo.moduleUrl("demos.beer.resources","api.smd"));
	
});