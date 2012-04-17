define(["dojo/_base/lang","dojo/_base/html","dojo/_base/connect","dojo/_base/array","dojo/_base/window","dojo/_base/xhr", // dojo Base
		"dojo/dom", "dojo/dom-class","dojo/dom-prop","dojo/dom-construct",
	"dojo/_base/Deferred",
	"dojo/DeferredList",
        "dojo/data/ItemFileReadStore",
        "dijit/registry", 
	"dojox/highlight",
	"dojox/highlight/languages/javascript",
        "dojox/mobile/parser",
        "dojox/mobile/common",
        "dojox/mobile/EdgeToEdgeCategory",
        "dojox/mobile/EdgeToEdgeDataList",
        "dojox/mobile/ListItem",
	"dojox/mobile/PageIndicator",
        "dojox/mobile/ProgressIndicator",
        "dojox/mobile/TransitionEvent",
        "demos/mobileGallery/src/base",
        "demos/mobileGallery/src/Viewport",
        "demos/mobileGallery/src/structure"],
  function(lang, html, connect, array, win, xhr, dom, domClass,domProp, domConstruct,
		   Deferred, DeferredList, ItemFileReadStore, registry, highlight, jshighlight, parser, dm,
		   EdgeToEdgeCategory, EdgeToEdgeDataList, ListItem, PageIndicator, ProgressIndicator, TransitionEvent, 
		   base, Viewport, structure){ 

	/*
	 * show or hide global progress indicator
	 */
	function showProgressIndicator(show){
		var prog = ProgressIndicator.getInstance();
		prog.id = "mobGalleryProgressIndicator";
		// TODO: remove this workaround
		prog.stop();
		if (show) {
			dom.byId("rightPane").appendChild(prog.domNode);
			prog.start();
		}
	};
	
	// flag indicating whether there's transition
	var inTransitionOrLoading = false;

	// flag indicating whether the transition starts
	// TODO: ideally this should not be a global flag
	// We should get rid of it if transition event
	// can provide more context
	var transitFrom;
	
	function transitViews(src, target, move, anim) {
		if (src === target)
			return;
		transitFrom = src;
		var moveDir = (move ? move : -1);
		var animation = (anim ? anim : "slide");
		registry.byId(src).performTransition(target, moveDir, animation);
	}


	function navBtnClickHandler() {
		var navRecord = structure.navRecords.pop();
		// only hide navigation button DIRECTLY if in two column mode
		// otherwise, "onAfterTransitionIn" of "navigation" view will hide it
		// TODO:simply the logic here
		if (structure.navRecords.length == 0 && !structure.layout.leftPane.hidden)
			showHideNavButton();
		transitViews(navRecord.to, navRecord.from);
		if (navRecord.fromTitle)
			dom.byId("headerLabel").innerHTML = navRecord.fromTitle;
	};

	function srcBtnClickHandler() {
		var srcBtn = registry.byId("sourceButton");
		dom.byId("sourceButton").innerHTML = (srcBtn.selected ? "Demo" : "Source");
		if (srcBtn.selected) {
			structure.navRecords.push({
				from: srcBtn.backTo,
				to: "source",
				navTitle: "Back"
			});
			transitViews(srcBtn.backTo, "source", 1);
		} else {
			navBtnClickHandler();
		}

	};

	// update label of navigation button
	function updateNavButtonLabel() {
		var navRecords = structure.navRecords;
		
		if (navRecords.length > 0) {
			var record = navRecords[navRecords.length - 1];
			dom.byId("navButton").innerHTML = record.navTitle;
			registry.byId("header").moveTo = record.from;
		}
	};

	// show or hide navigation button
	// TODO: simplify the logic here or at the caller
	function showHideNavButton() {
		var navButton = dom.byId("navButton");
		var navRecords = structure.navRecords;
		// hide if no record or we have only 1 record in "two column" mode
		// and it is "source"
		if (navRecords.length == 0 ||
		  	(navRecords.length == 1 && !structure.layout.leftPane.hidden &&
			 navRecords[navRecords.length-1].to == "source")) {
			if (!domClass.contains(navButton, "hidden")) {
				domClass.add(navButton, "hidden");
			}
		} else {
			if (domClass.contains(navButton, "hidden")) {
				domClass.remove(navButton, "hidden");
			}
		}
	};

	function updateNavButton() {
		updateNavButtonLabel();
		showHideNavButton();
	};

	function clearNavRecords() {
		var navRecords = structure.navRecords;
		if (navRecords.length == 0)
			return;
		navRecords.splice(0, navRecords.length);
	};
	
	
	/* 
	 * Work-around for the current change to transition.
	 * TODO: Change to use a utility method or some thing similar.
	 */
	function triggerTransition(comp, moveTo){
		transitFrom = "navigation";
		var transOpts = {"moveTo": moveTo, transition: comp.transition, transitionDir: comp.transitionDir};
		return new TransitionEvent(comp.domNode,transOpts).dispatch();
	}
	
	/**
	 * Add syntax highlight to passed-in HTML code.
	 *  
	 * @param raw HTML code to apply syntax highlight.
	 * @returns a string which is an HTML code snippet containing
	 * syntax highlight.
	 */
	function syntaxHighLight(raw) {
		var data = raw;
		//highlight element name, attribute name and value in HTML
		var regex = /<([\/a-zA-Z0-9]+)(\s*)([^>]*)>/g;
		regex.compile(regex);
		var match;
		while (match = regex.exec(data)) {
			var idx = match.index;
			var length = match[0].length;
			var replacement;
			replacement = "<span style=\"color:#0A0096\">&lt;" + match[1] + "</span>" + match[2];
			var regex2 = /(\w+)(\s*)=(\s*)('|")(.*?)\4(\s*)/g;
			var attrs = match[3];
			if (attrs && attrs !== '') {
				var match2;
				while (match2 = regex2.exec(attrs)) {
					replacement += "<span style=\"color:#F6834A\">" + match2[1] + "</span>" + match2[2] + "=" + match2[3];
					replacement += "<span style=\"color:#9B3000\">" + match2[4] + match2[5] + match2[4] + "</span>" + match2[6];
				}
			}
			replacement += "<span style=\"color:#0A0096\">&gt;</span>";
			data = data.slice(0, idx) + replacement + data.slice(idx + length);
			regex.lastIndex = idx + replacement.length;
		}
		return data;
	};
	
	// a map containing html and javascript source
	// codes, indexed by demo view ID. Each entry is
	// an object with "html" and "js" properties.
	var DEMO_SOURCES = {};
	function fillInDemoSource(id, type, src) {
		if (!DEMO_SOURCES[id])
			DEMO_SOURCES[id] = {};
		if (!DEMO_SOURCES[id][type])
			DEMO_SOURCES[id][type] = src;
	};
	function getDemoHtml(id) {
		return (DEMO_SOURCES[id] && DEMO_SOURCES[id].html ? DEMO_SOURCES[id].html : "");
	}
	function getDemoJs(id) {
		return (DEMO_SOURCES[id] && DEMO_SOURCES[id].js ? DEMO_SOURCES[id].js : "There is no user-defined Javascript needed.");
	}
	/**
	 * initialize each view page
	 *
	 * @param args
	 *            three parameters: id: id of the view; header:
	 *            label of the view header; src: URL of the view source
	 * @returns
	 */
	function initView(args){
		var view = registry.byId(args.id);
		var viewType = (args.type) ? args.type : 'demo';
		
		connect.connect(view, "onAfterTransitionIn", view, function(){
			inTransitionOrLoading = false;
			var headerLabel = dom.byId('headerLabel');
			var header = dom.byId("header");
			var sourceButton = dom.byId("sourceButton");
			if (viewType === 'demo') {
				// after transition in, set the header, source button and load
				// the source code of current view.						
				// but exclude when you transit back from "source"
				// otherwise local nav history will be broken
				if (!transitFrom || (transitFrom != "source")) {
					headerLabel.innerHTML = args.title;
					// this is more a timing change, update nav button after transit in
					// so that it can be shown/hidden along with "Source" button
					if (structure.layout.leftPane.hidden) {
						structure.navRecords.push({
							from:"navigation",
							to: args.id,
							toTitle: args.title,
							navTitle:"Back"
						});
					} else {
						clearNavRecords();
					}
					connect.publish("onAfterDemoViewTransitionIn", [args.id]);
				}
				var srcBtn = registry.byId("sourceButton");
				srcBtn.backTo = args.id;
				srcBtn.set("selected", false);
				sourceButton.innerHTML = (srcBtn.selected ? "Demo" : "Source");
				
				// set the header's moveTo attribute to "navigation"
				registry.byNode(header).moveTo = "navigation";
				// restore sourceButton if applicable
				if (domClass.contains(sourceButton, "hidden")) {
					domClass.remove(sourceButton, "hidden");
				}
				
				dom.byId("htmlContent").innerHTML = getDemoHtml(args.id);
				dom.byId("jsContent").innerHTML = getDemoJs(args.id);
				registry.byId("htmlSrcView").scrollTo({x:0,y:0});
				registry.byId("jsSrcView").scrollTo({x:0,y:0});
				structure.layout.currentDemo = {
					id: args.id,
					title: args.title
				};
			}
			else if (viewType === 'navigation') {
				//hide the sourceButton when navigation views 
				//and demo views are in the same holder.
				if (structure.layout.leftPane.hidden) {
					// set header label and the moveTo attribute of header to args.back
					headerLabel.innerHTML = args.title;
					registry.byNode(header).moveTo = args.back;
					// hide or show navigation button, hide sourceButton
					if (!domClass.contains(sourceButton, "hidden")) {
						domClass.add(sourceButton, "hidden");
					}
					// co-operate with "srcBtnClickHandler()" above
					showHideNavButton();
				}
				else {
					// if leftPane is not hidden then we need to set the back attribute of the leftPane header
					var leftHeader = dom.byId("leftHeader");
					var leftHeaderLabel = dom.byId("leftHeaderLabel");
					registry.byNode(leftHeader).moveTo = args.back;
					// set the header label
					leftHeaderLabel.innerHTML = args.title;
				}
				
			}
			structure.layout.setCurrentView(this.id);
		});
	};
	
	/**
	 * Callback handler of loading view.
	 * @param data
	 */
	function createViewHTMLLoadedHandler(args, li){
		return function(htmlText){
			fillInDemoSource(args.id, "html", syntaxHighLight(htmlText));
			var rightPane = dom.byId("rightPane");
			var tmpContainer = domConstruct.create("DIV");
			tmpContainer.innerHTML = htmlText;
			rightPane.appendChild(tmpContainer);
			var ws = parser.parse(tmpContainer);
			array.forEach(ws, function(w){
				if(w && !w._started && w.startup){
					w.startup();
				}
			});
			// reparent
			rightPane.removeChild(tmpContainer);
			for (var i = 0; i < tmpContainer.childNodes.length; i ++) {
				rightPane.appendChild(tmpContainer.childNodes[i]);
			}
		};
	};
	
	/**
	 * Load contents of a view to SplitterPane and switch to it.
	 * @param args
	 * 			args should have args.demourl and args.holder
	 * 			demourl: the url where loader can get the source of view
	 * 			holder: the id of pane that will hold the view
	 * @returns
	 */
	
	function loadAndSwitchView(args, li) {
		showProgressIndicator(true);
		
		function handleError(err){
			alert("Failed to load demo.");
			showProgressIndicator(false);
			inTransitionOrLoading = false;
		};

		function initViewAndTransit() {
			showProgressIndicator(false);
			// TODO: FIX-ME temp work around for the async startup 
			setTimeout(function(){
				initView(args);
//					li.transitionTo(args.id);
				triggerTransition(li, args.id);
			},0);
		};

		function stopProgress(){
		};
		
		var xhrArgs = {
				url: args.demourl,
				timeout: 30000,
				handleAs: "text" //only text can work now, xml will result in null responseXML
		};
		if (args.jsmodule) {
			require([args.jsmodule], function(module){
				var deferArray = [];
				// 1. load template HTML
				var htmlDefer = new Deferred();
				xhr.get({
					url: args.demourl,
				    timeout: 30000,
				    handleAs: "text",
				    load: function(data) {
					createViewHTMLLoadedHandler(args, li)(data);
					if (module.init)
						module.init();
					htmlDefer.resolve(true);
				    },
				    error: function(err) {
					htmlDefer.reject(true);
				    }
				});
				deferArray.push(htmlDefer);
				
				// 2. load JS codes
				if (args.jsSrc) {
				var jsDefer = new Deferred();
				xhr.get({
					url: args.jsSrc,
					timeout: 30000,
					handleAs: "text",
					load: function(data) {
						var src = highlight.processString(data).result;
						//src = src.replace(/\&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
						jsDefer.resolve(src);
					},
					error: function(err) {
						jsDefer.reject(true);
					}
				});
				deferArray.push(jsDefer);
				};

				// put them all in deferred list
				var deferList = new DeferredList(deferArray);
				deferList.then(function(res){
					if (!res[0][0]){
						handleError();
						return;
					}
					// load JS codes
					if (res.length > 1 && res[1][0] && res[1][1]) {
						fillInDemoSource(args.id, "js", res[1][1]);
					}
					initViewAndTransit();
				});
			});
		} else {
			var deferred = xhr.get(xhrArgs);
			deferred.addCallback(createViewHTMLLoadedHandler(args, li)).addCallback(initViewAndTransit);
			deferred.addErrback(handleError);
		}
	};
	
	/**
	 * Show the view of each show case. Load it first, if it's not loaded.
	 * @param args
	 * @param li
	 */
	function showView(args, li){
		if (inTransitionOrLoading)
			return;
		showProgressIndicator(false);
		if (registry.byId(args.id)) {
//				li.transitionTo(args.id);
			if (structure.layout.rightPane.currentView !== args.id) {
				inTransitionOrLoading = true;
				triggerTransition(li, args.id);
			}
		} else {
			inTransitionOrLoading = true;
			loadAndSwitchView(args, li);
		}
	};
	
	/**
	 * Initialize the navigation list items.
	 *
	 * @param {Object} demos
	 */
	function initNavList(demos){
		var navView = registry.byId("navigation");
		array.forEach(demos, function(demo){
			// first, set the category label
			var cat = new EdgeToEdgeCategory({
				"label": demo.label
			});
			cat.placeAt(navView.containerNode);
			cat.startup();
			// then, add the list
			var items = [];
			array.forEach(demo.views, function(item){
				// mapping "id" to "moveTo" for EdgeToEdgeList
				var def = {
						iconPos: item.iconPos,
						label: item.title + "<sup>1." + item.speclevel + "</sup>",
						href: item.href,
						hrefTarget: item.hrefTarget
				};
				if (item.demourl){
					def.moveTo = "#";
					def.onClick = function(){
						ListItem.prototype.onClick.apply(this, arguments);
						showView(item, this);
					};
				}
				items.push(def);
			});
			var list = new EdgeToEdgeDataList({
				id: demo.id,
				iconBase: demo.iconBase, // TODO: precise clone?
				store: new ItemFileReadStore({
					data: {
						"items": items
					}
				})
			});
			list.placeAt(navView.containerNode);
			list.startup();
			
		});
		// move navigation list view under correct parent (right or left pane)
		var holder = dom.byId(structure.layout.leftPane.hidden ? "rightPane" : "leftPane");
		holder.appendChild(dom.byId("navigation"));
	};
	
	/**
	 * Chage the layout according to the new width of screen after resize
	 * or change orientation.
	 *
	 * @param event
	 * 			event is the onresize or onorientationchange event data
	 * @returns
	 */
	function changeLayout(event){
		var hideLeftPane = (window.innerWidth < structure.layout.threshold) ? true : false;
		if (hideLeftPane !== structure.layout.leftPane.hidden) {
			//change the layout
			
			//apply new value to demos.mobileGallery.src.structure.layout.leftPane.hidden
			structure.layout.leftPane.hidden = hideLeftPane;
			if (hideLeftPane === false) {
				// move navigation list view from rightPane to leftPane
				dom.byId("leftPane").appendChild(dom.byId("navigation"));
				
				//show leftPane
				var leftPane = dom.byId("leftPane");
				domClass.add(leftPane, "navPane");
				domClass.remove(leftPane, "hidden");
				
				var navigationView = registry.byId("navigation");
				if ("navigation" === structure.layout.rightPane.currentView) {
					//if rightPane currentView is navigation view 
					//then show default view and remove display:none style
					var defaultView = registry.byId("welcome");
					html.style(defaultView.domNode, "display", "");
					defaultView.onAfterTransitionIn();
					navigationView.onAfterTransitionIn();
				}
				else {
					//if rightPane currentView is not navigation view 
					//then show navigation view and remove display:none style in leftPane
					html.style(navigationView.domNode, "display", "");
					navigationView.onAfterTransitionIn();
				}
				
				//hide navButton if applicable
				var navButton = dom.byId("navButton");
				if (!domClass.contains(navButton, "hidden")) {
					domClass.add(navButton, "hidden");
				}
				structure.navRecords.shift();
			}
			else {
				//hide leftPane
				var leftPane = dom.byId("leftPane");
				domClass.add(leftPane, "hidden");
				domClass.remove(leftPane, "navPane");
				//show navButton if applicable
				var navButton = dom.byId("navButton");
				if (domClass.contains(navButton, "hidden")) {
					domClass.remove(navButton, "hidden");
				}
				//move navigation views in demos.mobileGallery.src.structure.navigation from leftPane to rightPane
				html.style(registry.byId(structure.layout.leftPane.currentView).domNode, "display", "none");
				dom.byId("rightPane").appendChild(dom.byId("navigation"));
				structure.navRecords.unshift({
					from: "navigation",
					to: structure.layout.currentDemo.id,
					navTitle:"Back"
				});
			}
			//refresh the whole page after the layout change
			registry.byId('splitter').startup();
		}//else (the current layout match the screen width, then do nothing)
	};
	
	return {
		init: function(){
		// set view port size
		Viewport.onViewportChange();
		
		if (structure.layout.leftPane.hidden) {
			//hide the leftPane is when the screen is small
			//define layout, hide leftPane and keep navButton visibile
			domClass.add(dom.byId('leftPane'), "hidden");
		}
		else {
			//initialize view with two splitter pane
			//define layout, show leftPane and hide navButton
			domClass.add(dom.byId('leftPane'), "navPane");
			domClass.add(dom.byId('navButton'), "hidden");
		}
		
		var hideLeftPane = structure.layout.leftPane.hidden;
		domProp.set("navigation", "selected", "true");
		//when the screen is small, only show "navigation"
		//recently the strategy of view is changed, if there's is no visible view
		//then the 1st view is selected. So we have to move navigation to the first view.
		if (hideLeftPane) {
			html.place("navigation", "rightPane", "first");
		}
		
		parser.parse(win.body());
		array.forEach(structure._views, function(view){
			initView(view);
		});
		initNavList(structure.demos);
		connect.connect(dom.byId("sourceButton"), "onclick",
				registry.byId("header"), srcBtnClickHandler);
		connect.connect(dom.byId("navButton"), "onclick", registry.byId("header"),
				navBtnClickHandler);
		var navRecords = structure.navRecords;
		// view's internal navigation rely on "pop" to update label
		// we don't hide nav button instantly, it should be handled
		// along with source button.
		connect.connect(navRecords, "pop", updateNavButtonLabel);
		connect.connect(navRecords, "push", updateNavButton);
		connect.connect(navRecords, "shift", updateNavButton);
		connect.connect(navRecords, "unshift", updateNavButton);
		connect.connect(navRecords, "splice", updateNavButton);

		
		registry.byId("navigation").onAfterTransitionIn();
		if (!hideLeftPane) //initialize view with two splitter pane
			registry.byId("welcome").onAfterTransitionIn();
		
		connect.connect(win.global, "onorientationchange", function(event){
			Viewport.onViewportChange();
			changeLayout(event);
		});
		connect.connect(win.global, "onresize", function(event){
			changeLayout(event);
		});
		
		// set color of progress indicator bars
		var prog = ProgressIndicator.getInstance();
		prog.colors = [
			"#fafafa", "#f1f1f1", "#e3e3e3", "#d3d3d3",
			"#c2c2c2", "#afafaf", "#9b9b9b", "#898989",
			"#767676", "#676767", "#5a5a5a", "#505050"
		];
		
		// workaround for flash during loading due to auto hide address bar
		setTimeout(function(){
//			dojox.mobile.resizeAll();
			html.style("loadDiv", "visibility", "hidden");
		}, dm.hideAddressBarWait + 100);
	}
	}
});
