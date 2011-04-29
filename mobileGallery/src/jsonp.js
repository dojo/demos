define(["dojo", "dojo/io/script", "dojo/string", "dojox/mobile/ProgressIndicator"], function(dojo, script, string, ProgressIndicator){
	dojo.provide("demos.mobileGallery.src.jsonp");
	
	demos.mobileGallery.src.jsonp = (function() {
		// twitter search results visualization template
		var template = '<div class="searchResult" style="text-align:center;vertical-align:middle;">'
			+ '<div class="user">${from_user}</div>'
			+ '<img src="${profile_image_url}"/>'
			+ '<div class="text">${text}</div></div>';
		var prog = null;// progress indicator
		
		return {
			refreshData : function() {
				var jsonpDiv = dojo.byId("jsonp");
				var ul = dojo.byId("searchResults");
				if (!ul || !jsonpDiv)
					return;
				ul.style.display = "none";
				
				if (prog)
					prog.stop();// prevent duplicated indicators
				prog = ProgressIndicator.getInstance();
				jsonpDiv.appendChild(prog.domNode);
				prog.start();
				
				script.get({
					url : "http://search.twitter.com/search.json",
					handleAs : "json",
					callbackParamName : "callback",
					preventCache : true,
					content : {
						q : dojo.byId("searchKeywords").value,
						rpp: 10
					},
					load : function(data) {
						prog.stop();
						prog = null;
						var res = "";
						var results = data.results;
						if (results) {
							for ( var i = 0; i < results.length; i++) {
								var d = results[i];
								
								res += string.substitute(template, {
									from_user : d.from_user,
									profile_image_url : d.profile_image_url,
									text : d.text
								});
							}
						}
						ul.innerHTML = res;
						if (res)
							ul.style.display = "block";
					}
				});
			}
		}
	})();
});