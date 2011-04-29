define(["dojo", "dijit", "dojox/mobile/parser",
         "dojox/mobile/ProgressIndicator",
         "demos/mobileGallery/src/_base",
         "demos/mobileGallery/src/Viewport",
         "demos/mobileGallery/src/ajax",
         "demos/mobileGallery/src/forms",
         "demos/mobileGallery/src/headings",
         "demos/mobileGallery/src/icons",
         "demos/mobileGallery/src/jsonp",
         "demos/mobileGallery/src/map",
         "demos/mobileGallery/src/source",
         "demos/mobileGallery/src/structure"], function(dojo){
	dojo.provide("demos.mobileGallery.src.base");
	
	dojo.mixin(demos.mobileGallery.src.base, {
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
		 * initialize each view page
		 *
		 * @param args
		 *            three parameters: id: id of the view; header:
		 *            label of the view header; src: URL of the view source
		 * @returns
		 */
		initView: function(args){
			dojo.ready(function(){
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
						if (args.src){
							// get source code for current view
							var xhrArgs = {
									url: args.src,
									handleAs: "text",
									load: function(data){
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
										
										dojo.byId("sourceContent").innerHTML = data;
									}
							};
							dojo.xhrGet(xhrArgs);
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
			});
		},
		
		/**
		 * Load contents of an array of views to the SplitterPanes
		 * @returns
		 */
		loadViews: function(){
			//initialize the load structure
			demos.mobileGallery.src.structure.load.loaded = 0;
			
			// now prepare the total views to add.
			var viewsToLoad = [];
			
			// For each category, add all views which need loading
			dojo.forEach(demos.mobileGallery.src.structure.demos, function(dm){
				var candidateViews = dojo.filter(dm.views, function(view){
					// exclude external-linked demo page
					return !!view.demourl;
				});
				viewsToLoad = viewsToLoad.concat(candidateViews);
			});
			
			demos.mobileGallery.src.structure.load.target = viewsToLoad.length;
			
			// load all views
			dojo.forEach(viewsToLoad, function(view){
				this.loadView(view);
			}, this);
		},
		
		/**
		 * Load contents of a view to SplitterPane before dojox.mobile.paser parse dom nodes.
		 * @param args
		 * 			args should have args.src and args.holder
		 * 			src: the url where loader can get the source of view
		 * 			holder: the id of pane that will hold the view
		 * @returns
		 */
		loadView: function(args){
			var xhrArgs = {
					url: args.demourl,
					handleAs: "text", //only text can work now, xml will result in null responseXML
					load: function(data){
						var holder = dojo.byId("rightPane");
						holder.innerHTML = holder.innerHTML + data;
						demos.mobileGallery.src.structure.load.loaded++;
						if (demos.mobileGallery.src.structure.load.loaded === demos.mobileGallery.src.structure.load.target) {
							dojo.publish("viewsLoaded");
						}
						//console.log(data);
					}
			};
			
			dojo.xhrGet(xhrArgs);
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
					var def = {// TODO: better copying
							moveTo: item.id,
							iconPos: item.iconPos,
							label: item.title + "<sup>1." + item.speclevel + "</sup>",
							href: item.href,
							hrefTarget: item.hrefTarget
					};
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
	});
	
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
		
		//hide all page content loaded and display the progress indicator
		dojo.style(dojo.byId('splitter'), "visibility", "hidden");
		var prog = dojox.mobile.ProgressIndicator.getInstance();
		dojo.body().appendChild(prog.domNode);
		prog.start();
		
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
		
		// load views through xhr and add them to their holder/holders
		demos.mobileGallery.src.base.loadViews();
		
		//after the dom node are loaded then we can parse the document
		//and initialize views
		dojo.subscribe("viewsLoaded", function(){
			var hideLeftPane = demos.mobileGallery.src.structure.layout.leftPane.hidden;
			
			dojo.attr("navigation", "selected", "true");
			//when the screen is small, only show "navigation"
			if (!hideLeftPane) 
				dojo.attr("welcome", "selected", "true");
			
			dojox.mobile.parser.parse(dojo.body());
			demos.mobileGallery.src.base.initUI();
			dijit.byId("navigation").onAfterTransitionIn();
			if (!hideLeftPane) //initialize view with two splitter pane
				dijit.byId("welcome").onAfterTransitionIn();
			
			//hide progress indicator and show page
			prog.stop();
			dojo.style(dojo.byId('splitter'), "visibility", "visible");
			
			//when there is any resize or orientationchange event, call changeLayout
			//to check and change layout if necessary 
			dojo.connect(dojo.global, "onorientationchange", function(event){
				demos.mobileGallery.src.Viewport.onViewportChange();
				demos.mobileGallery.src.base.changeLayout(event);
			});
			dojo.connect(dojo.global, "onresize", function(){
				demos.mobileGallery.src.base.changeLayout(event);
			});
			
			dojox.mobile.resizeAll();
			
			dojo.publish("viewsRendered");
		});
	});
});

