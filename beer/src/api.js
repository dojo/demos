define([
	"dojo/ready",
	"dojox/rpc/Service"
], function (dojo, rpcService) {

	ready(function(){
	
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
	
		beer.api = new rpcService(require.toUrl("demos/beer/resources/api.smd"));
		
	});
	return beer.api;
});