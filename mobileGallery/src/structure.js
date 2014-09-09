define(["dojo/_base/lang"],
		function(lang){
	lang.getObject("demos.mobileGallery.src.structure", true);
	
	var THRESHOLD_WIDTH = 600;

	demos.mobileGallery.src.structure = {
		layout: {
			threshold: THRESHOLD_WIDTH, // threshold for layout change
			leftPane: {
				hidden: (window.innerWidth < THRESHOLD_WIDTH) ? true : false,
						currentView: null
			},
			rightPane: {
				hidden: false,
				currentView: null
			},
			getViewHolder: function(id) {
				if (id === "navigation")
					return (window.innerWidth < THRESHOLD_WIDTH) ? "rightPane" : "leftPane";
				else
					return "rightPane";
			},
			setCurrentView: function(id) {
				var holder = this.getViewHolder(id);
				this[holder].currentView = id;
			},
			// last selected demo view
			currentDemo: {
				id: "welcome",
				title: "Welcome"
			}
		},
		demos: [{
			id: "controls",
			label: "Controls",
			iconBase: "images/navigation_list_all_29.png",
			views: [{
				id: "buttons",
				iconPos: "0,0,29,29",
				title: "Buttons",
				demourl: "views/buttons.html"
			}, {
				id: "forms",
				iconPos: "29,0,29,29",
				title: "Forms",
				demourl: "views/forms.html",
				jsmodule: "demos/mobileGallery/src/forms",
				jsSrc: "doc/src/forms.js.txt"
			}, {
				id: "mobileSwitches",
				iconPos: "29,0,29,29",
				title: "Switches",
				demourl: "views/mobileSwitches.html"
			}, {
				id: "swapView",
				iconPos: "58,0,29,29",
				title: "Swap View",
				demourl: "views/swapView.html"
			}, {
				id: "icons",
				iconPos: "87,0,29,29",
				title: "Icons",
				demourl: "views/icons.html",
				jsmodule: "demos/mobileGallery/src/icons",
				jsSrc: "doc/src/icons.js.txt"
			}, {
				id: "tabBar",
				iconPos: "116,0,29,29",
				title: "Tab Bar",
				demourl: "views/tabBar.html"
			}, {
				id: "headings",
				iconPos: "145,0,29,29",
				title: "Headings",
				demourl: "views/headings.html",
				jsmodule: "demos/mobileGallery/src/headings",
				jsSrc: "doc/src/headings.js.txt"
			}, {
				id: "list",
				iconPos: "203,0,29,29",
				title: "Lists",
				demourl: "views/list.html",
				jsmodule: "demos/mobileGallery/src/list",
				jsSrc: "doc/src/list.js.txt"
			}, {
				id: "mobileLists",
				iconPos: "203,0,29,29",
				title: "List Data",
				demourl: "views/mobileListData.html",
				jsmodule: "demos/mobileGallery/src/mobileListData",
				jsSrc: "doc/src/mobileListData.js.txt"
			}, {
				id: "filteredLists",
				iconPos: "203,0,29,29",
				title: "Filtered Lists",
				demourl: "views/filteredLists.html",
				jsmodule: "demos/mobileGallery/src/filteredLists",
				jsSrc: "doc/src/filteredLists.js.txt"
			}, {
				id: "longLists",
				iconPos: "203,0,29,29",
				title: "Long Lists",
				demourl: "views/longLists.html",
				jsmodule: "demos/mobileGallery/src/longLists",
				jsSrc: "doc/src/longLists.js.txt"
			}, {
				id: "accordion",
				iconPos: "464,0,29,29",
				title: "Accordion",
				demourl: "views/accordion.html",
				jsmodule: "demos/mobileGallery/src/accordion",
				jsSrc: "doc/src/accordion.js.txt"
			}, {		
				id: "gridLayout",
				iconPos: "580,0,29,29",
				title: "GridLayout",
				demourl: "views/gridLayout.html",
				jsmodule: "demos/mobileGallery/src/gridLayout",
				jsSrc: "doc/src/gridLayout.js.txt"
			}, {
				id: "scrollablePane",
				iconPos: "551,0,29,29",
				title: "Scroll Pane",
				demourl: "views/scrollablePane.html",
				jsmodule: "demos/mobileGallery/src/scrollablePane",
				jsSrc: "doc/src/scrollablePane.js.txt"
			}, {				
				id: "progress",
				iconPos: "493,0,29,29",
				title: "Progress",
				demourl: "views/progress.html",
				jsmodule: "demos/mobileGallery/src/progress",
				jsSrc: "doc/src/progress.js.txt"
			}, {					
				id: "media",
				iconPos: "435,0,29,29",
				title: "Media",
				demourl: "views/mobileMedia.html",
				jsmodule: "demos/mobileGallery/src/media"
			}, {
				id: "badges",
				iconPos: "522,0,29,29",
				title: "Badges",
				demourl: "views/badges.html",
				jsmodule: "demos/mobileGallery/src/badges",
				jsSrc: "doc/src/badges.js.txt"				
			}, {
				id: "rating",
				iconPos: "609,0,29,29",
				title: "Rating",
				demourl: "views/rating.html",
				jsmodule: "demos/mobileGallery/src/rating",
				jsSrc: "doc/src/rating.js.txt"
			}, {
				id: "dialogs",
				iconPos: "638,0,29,29",
				title: "Dialogs",
				demourl: "views/dialogs.html",
				jsmodule: "demos/mobileGallery/src/dialogs",
				jsSrc: "doc/src/dialogs.js.txt"
			}, {
				id: "valuePicker",
				iconPos: "667,0,29,29",
				title: "Pickers",
				demourl: "views/valuePicker.html",
				jsmodule: "demos/mobileGallery/src/valuePicker",
				jsSrc: "doc/src/valuePicker.js.txt"
			}, {				
				id: "map",
				iconPos: "174,0,29,29",
				title: "Map (Google)",
				demourl: "views/map.html",
				jsmodule: "demos/mobileGallery/src/map",
				jsSrc: "doc/src/map.js.txt"
			}, {			
				href: "../mobileGauges/demo.html",
				hrefTarget: "_blank",
				title: "Gauge",
				iconPos: "232,0,29,29"
			}, {
				href: "../mobileCharting/demo.html",
				hrefTarget: "_blank",
				title: "Chart",
				iconPos: "377,0,29,29"
			}, {
				href: "../mobileGeoCharting/demo.html",
				hrefTarget: "_blank",
				title: "Geo Chart",
				iconPos: "377,0,29,29"
			}, {
				href: "../mobileOpenLayers/demo.html",
				hrefTarget: "_blank",
				title: "OpenLayers Map",
				iconPos: "174,0,29,29"
			}, {
				href: "../touch/demo.html",
				hrefTarget: "_blank",
				title: "Touch",
				iconPos: "261,0,29,29"
			}]
		}, {
			id: "effects",
			label: "Effects",
			iconBase: "images/navigation_list_all_29.png",
			views: [{
				id: "mobileTransitions",
				iconPos: "290,0,29,29",
				title: "Transitions",
				demourl: "views/mobileTransitions.html"
			},{
				id: "css3",
				iconPos: "406,0,29,29",
				title: "CSS 3",
				demourl: "views/css3.html",
				jsmodule: "demos/mobileGallery/src/css3",
				jsSrc: "doc/src/css3.js.txt"
			}]
		}, {
			id: "dataList",
			label: "Data",
			iconBase: "images/navigation_list_all_29.png",
			views: [{
				id: "ajax",
				iconPos: "348,0,29,29",
				title: "AJAX",
				demourl: "views/ajax.html",
				jsmodule: "demos/mobileGallery/src/ajax",
				jsSrc: "doc/src/ajax.js.txt"
			}, {
				id: "html5",
				iconPos: "348,0,29,29",
				title: "HTML5",
				demourl: "views/html5.html",
				jsmodule: "demos/mobileGallery/src/html5",
				jsSrc: "doc/src/html5.js.txt"
			}]
		}],
		/* Below are internal views. */
		_views: [{
			id: 'source',
			title: 'Source',
			type: 'source'
		}, {
			id: 'welcome',
			title: 'Welcome'
		}, {
			id: 'navigation',
			title: 'Showcase',
			type: 'navigation',
			back: ''
		}],
		/* data model for tracking view loading */
		load: {
			loaded: 0,
			target: 0 //target number of views that should be loaded
		},
		// navigation list
		navRecords: []
	};
	return demos.mobileGallery.src.structure;
});
