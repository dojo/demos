define([
	"dojo/ready",
	"dojo/_base/lang",
	"dojo/_base/window",
	"dojo/dom",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/io/iframe",
	"dojo/on",
	"dojo/query",
	"dojo/dnd/Moveable",
	"dojo/_base/fx",
	"dojo/fx/easing",
	"dojo/fx"
], function (ready, lang, win, dom, domClass, domStyle, ioIframe, on, query, Moveable, baseFx, easing, fx) {

	// the code for the "live download" link, adapted from http://dojotoolkit.org/~dante/downloadDojo.html
	(function(){
	
		var dojo_ver = "1.6.0rc1";
		
		var node = null;
		var _downloadDialog = {
	
			node: null,
			closeNode: null,
		
			show: function(e){
				if(!this.node){ this.create(); }
				var anim1 = baseFx.animateProperty({
					node: query("img",this.node)[0],
					duration:1500,
					properties: {
						width: { end: 310, start:1 },
						height: { end: 310, start:1 },
						top: { end:0, start:155 },
						left: { end:0, start:155 }
					},
					easing: easing.elasticOut
				});
				var anim2 = baseFx.slideTo({
					node:this.node,
					top: e.pageY - 55,
					left: e.pageX - 155,
					duration:900,
					easing: easing.elasticOut
				});
				fx.combine([anim1,anim2]).play();
				dom.byId("gravity").disabled = true;
			},
	
			hide: function(e){
				dom.byId("gravity").disabled = false;
				e.preventDefault();
				baseFx.slideTo({
					node:this.node,
					duration:375,
					left:-310, top:-50,
					easing:easing.backIn
				}).play();
			},
	
			init: function(e){
				// init the download sequence based on the selected parameters.
				var includeUtils = dom.byId("build").checked;
				var includeSource = dom.byId("sourceR").checked;
				var ext = (dom.byId("tgz").checked ? "tar.gz" : "zip");
				var ver = dojo_ver;
				
				// make the url:
				var host = "http://download.dojotoolkit.org/";
				var url = host + "release-" + (ver) + "/dojo-release-" + (ver) + (includeSource ? "-src." : ".") + (ext);
	
				// trigger the save as ... dialog
				ioIframe.send({
					url: url,
					timeout: 5000
				});
				
				if(includeUtils){
					// and another one if they selected build utils. FIXME: ie7 throws popup warning?
					var utilUrl = host + "release-" + (ver) + "/dojo-release-"+(ver)+"-shrinksafe."+(ext);
					setTimeout(function(){
						ioIframe.send({
							url: utilUrl,
							timeout:5000
						});
					},3000);
				}
	
			},
			
			create: function(e){
				// dynamically create the dialog box:
	
				var img = query("img.clone")[0];
				this.node = win.body().appendChild(win.doc.createElement('div'));
				var nimg = this.node.appendChild(lang.clone(img));
				domStyle.set(nimg, "position", "absolute");
	
				var h = this.node.appendChild(win.doc.createElement('h1'));
				domClass.add(h,"handle");
	
				this.node.id = "downloadDiv";
				h.innerHTML = "download?";
	
				var form = this.node.appendChild(dom.byId("downloadForm"));
				domStyle.set(form, "visibility", "visible");
				domStyle.set(this.node, "zIndex", "100");
				new Moveable(this.node,{ handle: h });
				
				this.closeNode = dom.byId("closeNode");
				on(this.closeNode, "click", lang.hitch(this, "hide"));
				this.submitNode = dom.byId("submitNode");
				on(this.submitNode, "click", lang.hitch(this, "init"));
	
			}
		};
		
		var button = null;
		ready(function(){
			button = dom.byId("downloadButton");
			on(button, "click", lang.hitch(_downloadDialog, "show"));
		});
		
	})();
});