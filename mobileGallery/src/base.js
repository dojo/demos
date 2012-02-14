define(["dojo/_base/array",
	"dojo/_base/window",
	"dojo/has"], 
function(array, win, has){
	
	function set(name, value) {
		has(name, function(){
			return value;
		}, true, true);
	}
	
	/*
	 * parse url parameter to get the device parameter if any. Temporarily use hard
	 * coded values. We can change to use dojo.hash in the future.
	 */
	var search = win.global.location.search;
	if (search && search.length > 1) {
		var queryPairs = search.substr(1).split("&");
		array.forEach(queryPairs, function(pairStr) {
			var query = pairStr.split("=");
			if (query[0] === "theme" && query[1]) {
				// overwrite the agent detection result
				switch (query[1].toLowerCase()) {
				case "iphone":
					set("iphone", true);
					set("android", false);
					set("webos", false);
					break;
				case "android":
					set("iphone", false);
					set("android", true);
					set("webos", false);
					break;
				case "webos":
					set("iphone", false);
					set("android", false);
					set("webos", true);
					break;
				};
			};
		});
	}
});
