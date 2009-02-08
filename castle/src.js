dojo.require("dijit.layout.AccordionContainer");
dojo.require("dojox.layout.ScrollPane");
dojo.require("dojox.widget.FisheyeLite");
dojo.require("dojo.NodeList-fx");
dojo.require("dojo.fx");
dojo.require("dojo.fx.easing");
dojo.require("dojox.analytics.Urchin");

;(function(){
	
	window.show = function(id){
		var contents = dojo.byId(id).innerHTML;
		dojo.query("#content").style("opacity", 0).forEach(function(n){ n.innerHTML = contents; }).anim({ opacity:1 });
	}

	var init = function(){
			// turn li's in this page into fisheye items, presumtiously:  
		dojo.query("#hidden ul > li").forEach(function(n){
			new dojox.widget.FisheyeLite({
				properties:{
				  fontSize:1.5
				},
				easeIn: dojo.fx.easing.linear,
				durationIn: 100,
				easeOut: dojo.fx.easing.linear,
				durationOut: 100
			}, n);
		});

		var panes = [];
		var paneType = dojo.getObject("dojox.layout.ScrollPane");
  
	
	  	//accordion widget
	  	accordion = new dijit.layout.AccordionContainer({}, "accordionPanel");

	  	var content1 = new dijit.layout.ContentPane({ id:'pane1', title: '25.07.2008', selected: true },'day1').placeAt(accordion);
	  	var content2 = new dijit.layout.ContentPane({ id:'pane2', title: '26.07.2008' }, 'day2').placeAt(accordion);
	  	var content3 = new dijit.layout.ContentPane({ id:'pane3', title: '27.07.2008' }, 'day3').placeAt(accordion);
		accordion.startup();

		dojo.subscribe("accordionPanel-selectChild", function(child){
			// we do this because despite accordion passing correct sizes, scrollpane uses it's scrollheight/etc for sizing
			setTimeout(dojo.hitch(child, "_layoutChildren"), 300);
		});

		dojo.forEach(["day1s","day2s","day3s"], function(id){
			new paneType({ style: "width:450px;height:170px" }, id);
		});

		dojo.query('.dijitAccordionText').style('opacity', 0.01);

		// demo usage tracking: 
		new dojox.analytics.Urchin({ 
			acct: "UA-3572741-1", 
			GAonLoad: function(){
				this.trackPageView("/demos/castle");
			}
		});	
		
	}

	dojo.addOnLoad(init);

})();