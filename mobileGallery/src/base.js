define(["dojo", "dijit", "dojox/mobile/parser",
        "dojo/data/ItemFileReadStore",
        "dojox/mobile/EdgeToEdgeDataList",
         "dojox/mobile/ProgressIndicator",
         "dojox/mobile/TransitionEvent",
         "demos/mobileGallery/src/_base",
         "demos/mobileGallery/src/Viewport",
         "demos/mobileGallery/src/structure"], function(dojo){
	
	// preload images
	new Image(25,25).src = "images/progress-indicator.gif";
	
	function goToView(event) {
		var currentView = demos.mobileGallery.src.structure.layout.rightPane.currentView;
		
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
	
	function triggerTransition(comp, moveTo){
		var transOpts = {"moveTo": moveTo, transition: comp.transition, transitionDir: comp.transitionDir};
		return new dojox.mobile.TransitionEvent(comp.domNode,transOpts).dispatch();
	}
	
	
	dojo.getObject("mobileGallery.src.base",true,demos);
	
	demos.mobileGallery.src.base = {
		/**
		 * Initialize all views.
		 *
		 * @returns
		 */
		initViews: function(){
			var viewsToInit = [];
			
			dojo.forEach(demos.mobileGallery.src.structure.demos, function(demo){
				dojo.forEach(demo.views, function(view){
					viewsToInit.push({
						id: view.id,
						title: view.title,
						src: view.demourl
					});
					
				});
			});
			
			viewsToInit = viewsToInit.concat(demos.mobileGallery.src.structure._views);
			
			dojo.forEach(viewsToInit, function(view){
				this.initView(view);
			}, this);
		},
		
		/**
		 * Add syntax highlight to passed-in HTML code.
		 *  
		 * @param raw HTML code to apply syntax highlight.
		 * @returns a string which is an HTML code snippet containing
		 * syntax highlight.
		 */
		syntaxHighLight: function(raw) {
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
		},
			
		/**
		 * initialize each view page
		 *
		 * @param args
		 *            three parameters: id: id of the view; header:
		 *            label of the view header; src: URL of the view source
		 * @returns
		 */
		initView: function(args){
				var view = dijit.byId(args.id);
				var viewType = (args.type) ? args.type : 'demo';
				
				dojo.connect(view, "onAfterTransitionIn", view, function(){
					var headerLabel = dojo.byId('headerLabel');
					var header = dojo.byId("header");
					var sourceButton = dojo.byId("sourceButton");
					var navButton = dojo.byId("navButton");
					if (viewType === 'demo') {
						// after transition in, set the header, source button and load
						// the source code of current view.						
						headerLabel.innerHTML = args.title;
						dijit.byId("sourceHeader").moveTo = args.id;
						
						// set the header's moveTo attribute to "navigation"
						dijit.byNode(header).moveTo = "navigation";
						// restore sourceButton if applicable
						if (dojo.hasClass(sourceButton, "hidden")) {
							dojo.removeClass(sourceButton, "hidden");
						}
						// if leftPane is hidden restore navButton if applicable
						if (demos.mobileGallery.src.structure.layout.leftPane.hidden) {
							if (dojo.hasClass(navButton, "hidden")) {
								dojo.removeClass(navButton, "hidden");
							}
						}
						
						// TODO: FIX-ME find a better way to handle views which are not loaded
						// asynchronously or should not show source codes.
						if (args.srcCode){
							dojo.byId("sourceContent").innerHTML = args.srcCode;
						}
					}
					else 
						if (viewType === 'navigation') {
							//hide the sourceButton when navigation views 
							//and demo views are in the same holder.
							if (demos.mobileGallery.src.structure.layout.leftPane.hidden) {
								// set header label and the moveTo attribute of header to args.back
								headerLabel.innerHTML = args.title;
								dijit.byNode(header).moveTo = args.back;
								// hide or show navigation button, hide sourceButton
								if (!dojo.hasClass(sourceButton, "hidden")) {
									dojo.addClass(sourceButton, "hidden");
								}
								if (dijit.byNode(header).moveTo === "") {
									if (!dojo.hasClass(navButton, "hidden")) {
										dojo.addClass(navButton, "hidden");
									}
								}
								else {
									if (dojo.hasClass(navButton, "hidden")) {
										dojo.removeClass(navButton, "hidden");
									}
								}
							}
							else {
								// if leftPane is not hidden then we need to set the back attribute of the leftPane header
								var leftHeader = dojo.byId("leftHeader");
								var leftHeaderLabel = dojo.byId("leftHeaderLabel");
								dijit.byNode(leftHeader).moveTo = args.back;
								// set the header label
								leftHeaderLabel.innerHTML = args.title;
							}
							
						}
					demos.mobileGallery.src.structure.layout.setCurrentView(this);
				});
		},
		
		/**
		 * Load contents of a view to SplitterPane and switch to it.
		 * @param args
		 * 			args should have args.demourl and args.holder
		 * 			demourl: the url where loader can get the source of view
		 * 			holder: the id of pane that will hold the view
		 * @returns
		 */
		
		loadAndSwitchView: function(args, li) {
			var xhrArgs = {
				url: args.demourl,
				handleAs: "text" //only text can work now, xml will result in null responseXML
			};
			/**
			 * Callback handler of loading view.
			 * @param data
			 */
			function parseViewHTML(data){
				var rightPane = dojo.byId("rightPane");
				var tmpContainer = dojo.create("DIV");
				tmpContainer.innerHTML = data;
				rightPane.appendChild(tmpContainer);
				var ws = dojo.parser.parse(tmpContainer);
				dojo.forEach(ws, function(w){
					if(w && !w._started && w.startup){
						w.startup();
					}
				});
				// reparent
				rightPane.removeChild(tmpContainer);
				for (var i = 0; i < tmpContainer.childNodes.length; i ++) {
					rightPane.appendChild(tmpContainer.childNodes[i]);
				}
				args.srcCode = dojo.global.demos.mobileGallery.src.base.syntaxHighLight(data);
				// TODO: FIX-ME temp work around for the async startup 
				setTimeout(function(){
					demos.mobileGallery.src.base.initView(args);
//					li.transitionTo(args.id);
					triggerTransition(li, args.id);
				},0);
			}
			
			var progDiv = dojo.byId("progDiv");
			var prog = new dojox.mobile.ProgressIndicator();
			prog.setImage("images/progress-indicator.gif");
			progDiv.appendChild(prog.domNode);
			prog.start();
			dojo.style(progDiv, "visibility", "visible");
			
			function stopProgress(){
				dojo.style(progDiv, "visibility", "hidden");
				prog.stop();
				prog = null;
			};
			
			if (args.jsmodule) {
				require([args.jsmodule], function(module){
					var deferred = dojo.xhrGet(xhrArgs);
					deferred.addCallback(function(data){
						parseViewHTML(data);
						if (module.init)
							module.init();
					}).addCallback(stopProgress);
					deferred.addErrback(stopProgress);
				});
			} else {
				var deferred = dojo.xhrGet(xhrArgs);
				deferred.addCallback(parseViewHTML).addCallback(stopProgress);
				deferred.addErrback(stopProgress);
			}
		},
		
		/**
		 * Show the view of each show case. Load it first, if it's not loaded.
		 * @param args
		 * @param li
		 */
		showView: function(args, li){
			if (dijit.byId(args.id)) {
//				li.transitionTo(args.id);
				triggerTransition(li, args.id);
			} else {
				this.loadAndSwitchView(args, li);
			}
		},
		
		/**
		 * Initialize the navigation list items.
		 *
		 * @param {Object} demos
		 */
		initNavList: function(demos){
			var navView = dijit.byId("navigation");
			dojo.forEach(demos, function(demo){
				// first, set the category label
				navView.addChild(new dojox.mobile.EdgeToEdgeCategory({
					"label": demo.label
				}));
				// then, add the list
				var items = [];
				dojo.forEach(demo.views, function(item){
					// mapping "id" to "moveTo" for EdgeToEdgeList
					var def = {
							iconPos: item.iconPos,
							label: item.title + "<sup>1." + item.speclevel + "</sup>",
							href: item.href,
							hrefTarget: item.hrefTarget
					};
					if (item.demourl){
						def.moveTo = "#";
						def.onclick = function(){
							dojo.global.demos.mobileGallery.src.base.showView(item, this);
						};
					}
					items.push(def);
				});
				var list = new dojox.mobile.EdgeToEdgeDataList({
					id: demo.id,
					iconBase: demo.iconBase, // TODO: precise clone?
					store: new dojo.data.ItemFileReadStore({
						data: {
							"items": items
						}
					})
				});
				navView.addChild(list);
			});
			// move navigation list view under correct parent (right or left pane)
			var holder = dojo.byId(dojo.global.demos.mobileGallery.src.structure.layout.leftPane.hidden ? "rightPane" : "leftPane");
			holder.appendChild(dojo.byId("navigation"));
		},
		
		/**
		 * Initialize the whole UI.
		 */
		initUI: function(){
			this.initViews();
			this.initNavList(demos.mobileGallery.src.structure.demos);
		},
		
		/**
		 * Chage the layout according to the new width of screen after resize
		 * or change orientation.
		 *
		 * @param event
		 * 			event is the onresize or onorientationchange event data
		 * @returns
		 */
		changeLayout: function(event){
			var hideLeftPane = (window.innerWidth < demos.mobileGallery.src.structure.layout.threshold) ? true : false;
			if (hideLeftPane !== demos.mobileGallery.src.structure.layout.leftPane.hidden) {
				//change the layout
				
				//apply new value to demos.mobileGallery.src.structure.layout.leftPane.hidden
				demos.mobileGallery.src.structure.layout.leftPane.hidden = hideLeftPane;
				if (hideLeftPane === false) {
					// move navigation list view from rightPane to leftPane
					dojo.byId("leftPane").appendChild(dojo.byId("navigation"));
					
					//show leftPane
					var leftPane = dojo.byId("leftPane");
					dojo.addClass(leftPane, "navPane");
					dojo.removeClass(leftPane, "hidden");
					
					var navigationView = dijit.byId("navigation");
					if ("navigation" === demos.mobileGallery.src.structure.layout.rightPane.currentView.id) {
						//if rightPane currentView is navigation view 
						//then show default view and remove display:none style
						var defaultView = dijit.byId("welcome");
						dojo.style(defaultView.domNode, "display", "");
						defaultView.onAfterTransitionIn();
						navigationView.onAfterTransitionIn();
					}
					else {
						//if rightPane currentView is not navigation view 
						//then show navigation view and remove display:none style in leftPane
						dojo.style(navigationView.domNode, "display", "");
						navigationView.onAfterTransitionIn();
					}
					
					//hide navButton if applicable
					var navButton = dojo.byId("navButton");
					if (!dojo.hasClass(navButton, "hidden")) {
						dojo.addClass(navButton, "hidden");
					}
				}
				else {
					//hide leftPane
					var leftPane = dojo.byId("leftPane");
					dojo.addClass(leftPane, "hidden");
					dojo.removeClass(leftPane, "navPane");
					//show navButton if applicable
					var navButton = dojo.byId("navButton");
					if (dojo.hasClass(navButton, "hidden")) {
						dojo.removeClass(navButton, "hidden");
					}
					//move navigation views in demos.mobileGallery.src.structure.navigation from leftPane to rightPane
					dojo.style(demos.mobileGallery.src.structure.layout.leftPane.currentView.domNode, "display", "none");
					dojo.byId("rightPane").appendChild(dojo.byId("navigation"));
				}
				//refresh the whole page after the layout change
				dijit.byId('splitter').startup();
			}//else (the current layout match the screen width, then do nothing)
		}
	};
	
	dojo.ready(function(){
		// switch themes for specific device
		dojo.forEach(document.getElementsByTagName('link'), function(link){
			var category = dojo.attr(link, "category");
			if (category) {
				switch (category) {
				case "android":
					link.disabled = !demos.mobileGallery.src._base.isAndroid;
					break;
				default:
					link.disabled = demos.mobileGallery.src._base.isAndroid;
				}
			}
		});
		
		// set view port size
		demos.mobileGallery.src.Viewport.onViewportChange();
		
		if (demos.mobileGallery.src.structure.layout.leftPane.hidden) {
			//hide the leftPane is when the screen is small
			//define layout, hide leftPane and keep navButton visibile
			dojo.addClass(dojo.byId('leftPane'), "hidden");
		}
		else {
			//initialize view with two splitter pane
			//define layout, show leftPane and hide navButton
			dojo.addClass(dojo.byId('leftPane'), "navPane");
			dojo.addClass(dojo.byId('navButton'), "hidden");
		}
		
		var hideLeftPane = demos.mobileGallery.src.structure.layout.leftPane.hidden;
		dojo.attr("navigation", "selected", "true");
		//when the screen is small, only show "navigation"
		//recently the strategy of view is changed, if there's is no visible view
		//then the 1st view is selected. So we have to move navigation to the first view.
		if (hideLeftPane) 
			dojo.place("navigation", "rightPane", "first");
		
		dojox.mobile.parser.parse(dojo.body());
		dojo.forEach(demos.mobileGallery.src.structure._views, function(view){
			demos.mobileGallery.src.base.initView(view);
		});
		demos.mobileGallery.src.base.initNavList(demos.mobileGallery.src.structure.demos);
		dojo.connect(dojo.byId("sourceButton"), "onclick",
				dijit.byId("header"), goToView);
		dojo.connect(dojo.byId("navButton"), "onclick", dijit.byId("header"),
				goToView);
		
		dijit.byId("navigation").onAfterTransitionIn();
		if (!hideLeftPane) //initialize view with two splitter pane
			dijit.byId("welcome").onAfterTransitionIn();
		
		dojo.connect(dojo.global, "onorientationchange", function(event){
			demos.mobileGallery.src.Viewport.onViewportChange();
			demos.mobileGallery.src.base.changeLayout(event);
		});
		dojo.connect(dojo.global, "onresize", function(event){
			demos.mobileGallery.src.base.changeLayout(event);
		});
		
		dojox.mobile.resizeAll();
	});
});

