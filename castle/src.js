define([
	"dojo/ready",
	"dojo/NodeList-Fx",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/dom",
	"dojo/fx",
	"dojo/fx/easing",
	"dojo/query",
	"dojo/topic",
	"dijit/layout/AccordionContainer",
	"dojox/analytics/Urchin",
	"dojox/layout/ScrollPane",
	"dojox/widget/FisheyeLite",
	"dojo/NodeList-dom"
], function (ready, NodeListFx, arrayUtil, lang, dom, fx, fxEasing, query, topic, layoutAccordionContainer, analyticsUrchin, layoutScrollPane, widgetFisheyeLite) {

	;(function(){
		
		window.show = function(id){
			var contents = dom.byId(id).innerHTML;
			query("#content").style("opacity", 0).forEach(function(n){ n.innerHTML = contents; }).anim({ opacity:1 });
		}
	
		var init = function(){
				// turn li's in this page into fisheye items, presumtiously:
			query("#hidden ul > li").forEach(function(n){
				new widgetFisheyeLite({
					properties:{
					  fontSize:1.5
					},
					easeIn: fxEasing.linear,
					durationIn: 100,
					easeOut: fxEasing.linear,
					durationOut: 100
				}, n);
			});
	 
		  	//accordion widget
		  	accordion = new layoutAccordionContainer({}, "accordionPanel");
	
			// children are scrollpanes, add titles (and id for css styles)
			var dates = ["25.07.2008", "26.07.2008", "27.07.2008"];
			arrayUtil.forEach(["day1","day2","day3"], function(id,i){
				new layoutScrollPane({
					id: "pane" + (i+1),
					style: "width:450px;height:170px",
					title: dates[i]
				}, id).placeAt(accordion);
			});
	
			// we do this because despite accordion passing correct sizes, scrollpane uses
			// it's scrollheight/etc for sizing
			topic.subscribe("accordionPanel-selectChild", function(child){
				setTimeout(lang.hitch(child, "resize"), accordion.duration + 50);
			});
	
			// start the accordion:
			accordion.startup();
	
			query('.dijitAccordionText').style('opacity', 0.01);
	
			// demo usage tracking:
			new analyticsUrchin({
				acct: "UA-3572741-1",
				GAonLoad: function(){
					this.trackPageView("/demos/castle");
				}
			});
			
		}
	
		ready(init);
	
	})();
});