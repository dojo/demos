define(["dojo/on",
		"dojo/_base/html",
		"dojo/dom", 
		"dojo/_base/array", // dojo.forEach
		"dojo/string",
		"dojo/io/script",
		"dijit/registry", // dijit.byId
		"dojox/mobile/ProgressIndicator"],
		function(on, html, dom, array, string, script, registry, ProgressIndicator){
	
		// twitter search results visualization template
		var template = '<div class="searchResult">'
			+ '<div class="user"><div class="userId">${from_user}</div>'
			+ '<img src="${profile_image_url}"/></div>'
			+ '<div class="tweetText">${text}</div>'
			+ '</div>';
		
		var index = 1;// paging index of twitter search, start from 1
		var searchKeys = "";
		
		function load(isReload){
			var ul = dom.byId("searchResults");
			html.style("findMoreDiv", "display", "none");
			if (isReload) {
				ul.style.display = "none";
				searchKeys = dom.byId("searchKeywords").value;
				ul.innerHTML = "";
				index = 1;
			} else {
				++index;
			}
			
			var prog = ProgressIndicator.getInstance();
			// TODO: remove this workaround
			prog.stop();
			dom.byId("rightPane").appendChild(prog.domNode);
			prog.start();
			
			script.get({
				url : "http://search.twitter.com/search.json",
				handleAs : "json",
				callbackParamName : "callback",
				preventCache : true,
				timeout: 30000,
				content : {
					q : searchKeys,
					rpp: 5,
					page: index
				},
				load : function(data) {
					var res = "";
					if (data.results) {
						array.forEach(data.results, function(result){
							res += string.substitute(template, {
								from_user : result.from_user,
								profile_image_url : result.profile_image_url,
								text : result.text
							});
							
						});
					}
					ul.innerHTML += res;
					prog.stop();
					ul.style.display = "block";
					html.style("findMoreDiv", "display", "block");
					// workaround: if refresh the long content which you've scrolled down,
					// you'll find the content is invisible.
					if (isReload)
						registry.byId("resultPanel").scrollTo({x:0,y:0});
				},
				error: function(err) {
					ul.innerHTML = err;
					prog.stop();
					index = 1;
					ul.style.display = "block";
					html.style("findMoreDiv", "display", "none");
				}
			});
		};
		
		return {
			init: function(){
				on(registry.byId("searchTwitterBtn"), "click", function(){load(true);});
				on(dom.byId("findMoreLnk"), "click", function(){load(false);});
			}
		};
});
