define(["dojo/_base/connect", // dojo.connect
        "dojo/_base/html", // dojo.byId
        "dojo/_base/array", // dojo.forEach
        "dojo/string",
        "dojo/io/script",
        "dijit/_base/manager", // dijit.byId
        "dojox/mobile/ProgressIndicator"], function(){
	
		// twitter search results visualization template
		var template = '<div class="searchResult" style="text-align:center;vertical-align:middle;">'
			+ '<div class="user">${from_user}</div>'
			+ '<img src="${profile_image_url}"/>'
			+ '<div class="text">${text}</div></div>';
		var prog = null;// progress indicator
		
		return {
			init: function(){
				dojo.connect(dijit.byId("searchTwitterBtn"), "onClick", function(){
					var jsonpDiv = dojo.byId("jsonp");
					var ul = dojo.byId("searchResults");
					if (!ul || !jsonpDiv)
						return;
					ul.style.display = "none";
					
					if (prog)
						prog.stop();// prevent duplicated indicators
					prog = dojox.mobile.ProgressIndicator.getInstance();
					jsonpDiv.appendChild(prog.domNode);
					prog.start();
					
					dojo.io.script.get({
						url : "http://search.twitter.com/search.json",
						handleAs : "json",
						callbackParamName : "callback",
						preventCache : true,
						content : {
							q : dojo.byId("searchKeywords").value,
							rpp: 5
						},
						load : function(data) {
							prog.stop();
							prog = null;
							var res = "";
							var results = data.results;
							if (data.results) {
								dojo.forEach(data.results, function(result){
									res += dojo.string.substitute(template, {
										from_user : result.from_user,
										profile_image_url : result.profile_image_url,
										text : result.text
									});
									
								});
							}
							ul.innerHTML = res;
							ul.style.display = "block";
						},
						error: function(err) {
							prog.stop();
							prog = null;
							ul.innerHTML = err;
							ul.style.display = "block";
						}
					});
				});
			}
		};
});