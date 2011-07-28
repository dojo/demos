define(["dojo/_base/kernel", // dojo.getObject
        "dojo/_base/html", // dojo.byId/addClass/hasClass/removeClass/create/style/attr/place
        "dojo/_base/connect", // dojo.connect
        "dojo/_base/array", // dojo.forEach
        "dojo/_base/window", // dojo.global
        "dojo/_base/xhr", // dojo.xhrGet
        "dojo/ready", // dojo.ready
        "dojo/data/ItemFileReadStore",
        "dijit/_base/manager", // dijit.byId/byNode
        "dojox/mobile/parser",
	"dojox/mobile/common",
	"dojox/mobile/EdgeToEdgeCategory",
        "dojox/mobile/EdgeToEdgeDataList",
        "dojox/mobile/ProgressIndicator",
        "dojox/mobile/TransitionEvent",
        "demos/mobileGallery/src/Viewport",
        "demos/mobileGallery/src/structure"],
        function(dojo, html, connect, array, win, xhr, ready, ItemFileReadStore, dijit, parser, dm,
        		 EdgeToEdgeCategory, EdgeToEdgeDataList, ProgressIndicator, TransitionEvent, Viewport, structure){

	dojo.getObject("demos.mobileGallery.src.base", true);
	
	function goToView(event) {
		var currentView = structure.layout.rightPane.currentView;
		
		if (currentView) {
			var targetView = "";
			var moveDir = 1;
			if (event.target.id === "sourceButton") {
				targetView = "source";
			} else {
				// TODO targetView for navButton should be set to header's
				// moveTo
				// targetView="settings";
				targetView = this.moveTo;
				moveDir = -1;
			}
			if (targetView !== currentView.id) {
				currentView.performTransition(targetView, moveDir,
						this.transition);
			}
		}
	};
	
	/* 
	 * Work-around for the current change to transition.
	 * TODO: Change to use a utility method or some thing similar.
	 */
	function triggerTransition(comp, moveTo){
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
	
	/**
	 * initialize each view page
	 *
	 * @param args
	 *            three parameters: id: id of the view; header:
	 *            label of the view header; src: URL of the view source
	 * @returns
	 */
	function initView(args){
		var view = dijit.byId(args.id);
		var viewType = (args.type) ? args.type : 'demo';
		
		connect.connect(view, "onAfterTransitionIn", view, function(){
			var headerLabel = html.byId('headerLabel');
			var header = html.byId("header");
			var sourceButton = html.byId("sourceButton");
			var navButton = html.byId("navButton");
			if (viewType === 'demo') {
				// after transition in, set the header, source button and load
				// the source code of current view.						
				headerLabel.innerHTML = args.title;
				dijit.byId("sourceHeader").moveTo = args.id;
				
				// set the header's moveTo attribute to "navigation"
				dijit.byNode(header).moveTo = "navigation";
				// restore sourceButton if applicable
				if (html.hasClass(sourceButton, "hidden")) {
					html.removeClass(sourceButton, "hidden");
				}
				// if leftPane is hidden restore navButton if applicable
				if (structure.layout.leftPane.hidden) {
					if (html.hasClass(navButton, "hidden")) {
						html.removeClass(navButton, "hidden");
					}
				}
				
				// TODO: FIX-ME find a better way to handle views which are not loaded
				// asynchronously or should not show source codes.
				if (args.srcCode){
					html.byId("sourceContent").innerHTML = args.srcCode;
				}
			}
			else 
				if (viewType === 'navigation') {
					//hide the sourceButton when navigation views 
					//and demo views are in the same holder.
					if (structure.layout.leftPane.hidden) {
						// set header label and the moveTo attribute of header to args.back
						headerLabel.innerHTML = args.title;
						dijit.byNode(header).moveTo = args.back;
						// hide or show navigation button, hide sourceButton
						if (!html.hasClass(sourceButton, "hidden")) {
							html.addClass(sourceButton, "hidden");
						}
						if (dijit.byNode(header).moveTo === "") {
							if (!html.hasClass(navButton, "hidden")) {
								html.addClass(navButton, "hidden");
							}
						}
						else {
							if (html.hasClass(navButton, "hidden")) {
								html.removeClass(navButton, "hidden");
							}
						}
					}
					else {
						// if leftPane is not hidden then we need to set the back attribute of the leftPane header
						var leftHeader = html.byId("leftHeader");
						var leftHeaderLabel = html.byId("leftHeaderLabel");
						dijit.byNode(leftHeader).moveTo = args.back;
						// set the header label
						leftHeaderLabel.innerHTML = args.title;
					}
					
				}
			structure.layout.setCurrentView(this);
		});
	};
	
	/**
	 * Callback handler of loading view.
	 * @param data
	 */
	function createViewHTMLLoadedHandler(args, li){
		return function(htmlText){
			var rightPane = html.byId("rightPane");
			var tmpContainer = html.create("DIV");
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
			args.srcCode = syntaxHighLight(htmlText);
			// TODO: FIX-ME temp work around for the async startup 
			setTimeout(function(){
				initView(args);
//					li.transitionTo(args.id);
				triggerTransition(li, args.id);
			},0);
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
		
		var progDiv = html.byId("progDiv");
		var prog = ProgressIndicator.getInstance();
		progDiv.appendChild(prog.domNode);
		prog.start();
		html.style(progDiv, "visibility", "visible");
		
		function stopProgress(){
			html.style(progDiv, "visibility", "hidden");
			prog.stop();
			prog = null;
		};
		
		var xhrArgs = {
				url: args.demourl,
				handleAs: "text" //only text can work now, xml will result in null responseXML
		};
		if (args.jsmodule) {
			require([args.jsmodule], function(module){
				var deferred = xhr.get(xhrArgs);
				deferred.addCallback(function(data){
					createViewHTMLLoadedHandler(args, li)(data);
					if (module.init)
						module.init();
				}).addCallback(stopProgress);
				deferred.addErrback(stopProgress);
			});
		} else {
			var deferred = xhr.get(xhrArgs);
			deferred.addCallback(createViewHTMLLoadedHandler(args, li))
				.addCallback(stopProgress);
			deferred.addErrback(stopProgress);
		}
	};
	
	/**
	 * Show the view of each show case. Load it first, if it's not loaded.
	 * @param args
	 * @param li
	 */
	function showView(args, li){
		if (dijit.byId(args.id)) {
//				li.transitionTo(args.id);
			triggerTransition(li, args.id);
		} else {
			loadAndSwitchView(args, li);
		}
	};
	
	/**
	 * Initialize the navigation list items.
	 *
	 * @param {Object} demos
	 */
	function initNavList(demos){
		var navView = dijit.byId("navigation");
		array.forEach(demos, function(demo){
			// first, set the category label
			navView.addChild(new EdgeToEdgeCategory({
				"label": demo.label
			}));
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
			navView.addChild(list);
		});
		// move navigation list view under correct parent (right or left pane)
		var holder = html.byId(structure.layout.leftPane.hidden ? "rightPane" : "leftPane");
		holder.appendChild(html.byId("navigation"));
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
				html.byId("leftPane").appendChild(html.byId("navigation"));
				
				//show leftPane
				var leftPane = html.byId("leftPane");
				html.addClass(leftPane, "navPane");
				html.removeClass(leftPane, "hidden");
				
				var navigationView = dijit.byId("navigation");
				if ("navigation" === structure.layout.rightPane.currentView.id) {
					//if rightPane currentView is navigation view 
					//then show default view and remove display:none style
					var defaultView = dijit.byId("welcome");
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
				var navButton = html.byId("navButton");
				if (!html.hasClass(navButton, "hidden")) {
					html.addClass(navButton, "hidden");
				}
			}
			else {
				//hide leftPane
				var leftPane = html.byId("leftPane");
				html.addClass(leftPane, "hidden");
				html.removeClass(leftPane, "navPane");
				//show navButton if applicable
				var navButton = html.byId("navButton");
				if (html.hasClass(navButton, "hidden")) {
					html.removeClass(navButton, "hidden");
				}
				//move navigation views in demos.mobileGallery.src.structure.navigation from leftPane to rightPane
				html.style(structure.layout.leftPane.currentView.domNode, "display", "none");
				html.byId("rightPane").appendChild(html.byId("navigation"));
			}
			//refresh the whole page after the layout change
			dijit.byId('splitter').startup();
		}//else (the current layout match the screen width, then do nothing)
	};
	
	ready(function(){
		// set view port size
		Viewport.onViewportChange();
		
		if (structure.layout.leftPane.hidden) {
			//hide the leftPane is when the screen is small
			//define layout, hide leftPane and keep navButton visibile
			html.addClass(html.byId('leftPane'), "hidden");
		}
		else {
			//initialize view with two splitter pane
			//define layout, show leftPane and hide navButton
			html.addClass(html.byId('leftPane'), "navPane");
			html.addClass(html.byId('navButton'), "hidden");
		}
		
		var hideLeftPane = structure.layout.leftPane.hidden;
		html.attr("navigation", "selected", "true");
		//when the screen is small, only show "navigation"
		//recently the strategy of view is changed, if there's is no visible view
		//then the 1st view is selected. So we have to move navigation to the first view.
		if (hideLeftPane) 
			html.place("navigation", "rightPane", "first");
		
		parser.parse(win.body());
		array.forEach(structure._views, function(view){
			initView(view);
		});
		initNavList(structure.demos);
		connect.connect(html.byId("sourceButton"), "onclick",
				dijit.byId("header"), goToView);
		connect.connect(html.byId("navButton"), "onclick", dijit.byId("header"),
				goToView);
		
		dijit.byId("navigation").onAfterTransitionIn();
		if (!hideLeftPane) //initialize view with two splitter pane
			dijit.byId("welcome").onAfterTransitionIn();
		
		connect.connect(win.global, "onorientationchange", function(event){
			Viewport.onViewportChange();
			changeLayout(event);
		});
		connect.connect(win.global, "onresize", function(event){
			changeLayout(event);
		});
		
		dm.resizeAll();
	});
});

