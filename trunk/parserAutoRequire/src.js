require([
 	"dojo/_base/fx",
	"dojo/_base/lang",
	"dojo/dom-style",
	"dojo/parser",
	"dojo/ready",
	"dijit/registry",
	"dijit/layout/ContentPane"
], function(baseFx, lang, domStyle, parser, ready, registry, ContentPane){

	lang.setObject("demo.basename", function(path, suffix) {
	    // Returns the filename component of the path  
	    // 
	    // version: 1109.2015
	    // discuss at: http://phpjs.org/functions/basename
	    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	    // +   improved by: Ash Searle (http://hexmen.com/blog/)
	    // +   improved by: Lincoln Ramsay
	    // +   improved by: djmix
	    // *     example 1: basename('/www/site/home.htm', '.htm');
	    // *     returns 1: 'home'
	    // *     example 2: basename('ecra.php?p=1');
	    // *     returns 2: 'ecra.php?p=1'
	    var b = path.replace(/^.*[\/\\]/g, '');
	 
	    if (typeof(suffix) == 'string' && b.substr(b.length - suffix.length) == suffix) {
	        b = b.substr(0, b.length - suffix.length);
	    }
	 
	    return b;
	});
	
	lang.setObject("demo.addTab", function(tabContainer, href, title, closable){
		if (typeof tabContainer === "string"){
			tabContainer = registry.byId(tabContainer);
		}
		var tabName = "tab" + demo.basename(href,".html"),
			tab = registry.byId(tabName);
		if (typeof tab === "undefined"){
			tab = new ContentPane({
				id: tabName,
				title: title,
				href: href,
				closable: closable,
				style: "padding: 0;"
			});
			tabContainer.addChild(tab);
		}
		tabContainer.selectChild(tab);
	});
	
	lang.setObject("demo.formatterIcon", function(iconClass){
		return '<div class="' + iconClass + '"></div>';
	});
	
	ready(function(){
		parser.parse().then(function(objects){
			baseFx.fadeOut({  //Get rid of the loader once parsing is done
				node: "preloader",
				onEnd: function() {
					domStyle.set("preloader","display","none");
				}
			}).play();
		});
	});
});