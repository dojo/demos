require([
	"dojo/_base/array", "dojo/_base/fx", "dojo/_base/window", "dojo/dom", "dojo/dom-class", "dojo/dom-geometry", "dojo/dom-style",
	"dojo/hccss", "dojo/date/locale", "dojo/parser", "dojo/store/Memory",
	"dijit/registry", "dijit/tree/ObjectStoreModel",

	"dijit/CheckedMenuItem", "dijit/RadioMenuItem", "dijit/MenuSeparator",

	// Editors used by InlineEditBox.  Must be pre-loaded.
	"dijit/form/Textarea", "dijit/form/DateTextBox", "dijit/form/TimeTextBox", "dijit/form/FilteringSelect",

	// These plugins are used by the Editor, and need to be pre-loaded
	"dijit/_editor/plugins/LinkDialog", // for createLink
	"dijit/_editor/plugins/FontChoice", // for fontName

	// Modules referenced by the parser
	"dijit/Menu", "dijit/PopupMenuItem", "dijit/ColorPalette", "dijit/layout/BorderContainer", "dijit/MenuBar",
	"dijit/PopupMenuBarItem", "dijit/layout/AccordionContainer", "dijit/layout/ContentPane", "dijit/TooltipDialog",
	"dijit/Tree", "dijit/layout/TabContainer", "dijit/form/ComboButton", "dijit/form/ToggleButton",
	"dijit/form/CheckBox", "dijit/form/RadioButton", "dijit/form/CurrencyTextBox", "dijit/form/NumberSpinner",
	"dijit/form/Select", "dijit/Editor", "dijit/form/VerticalSlider", "dijit/form/VerticalRuleLabels",
	"dijit/form/VerticalRule", "dijit/form/HorizontalSlider", "dijit/form/HorizontalRuleLabels",
	"dijit/form/HorizontalRule", "dijit/TitlePane", "dijit/ProgressBar", "dijit/InlineEditBox", "dojo/dnd/Source",
	"dijit/Dialog",

	// Don't call the parser until the DOM has finished loading
	"dojo/domReady!"
], function(array, baseFx, win, dom, domClass, domGeom, domStyle, has, locale, parser, Memory, registry, ObjectStoreModel,
			CheckedMenuItem, RadioMenuItem, MenuSeparator){
	// If you are doing box-model sizing then need to tell dom-geometry, see #15104
	if(domStyle.get(document.body, "boxSizing") == "border-box" ||
		domStyle.get(document.body, "MozBoxSizing") == "border-box"){
		domGeom.boxModel = "border-box";
	}

	// various function ripped out of inline script type=dojo/* blocks
	showDialog = function(){
		var dlg = registry.byId('dialog1');
		dlg.show();
		// avoid (trying to) restore focus to a closed menu, go to MenuBar instead
		dlg._savedFocus = dom.byId("header");
	};

	showDialogAb = function(){
		var dlg = registry.byId('dialogAB');
		dlg.show();
		// avoid (trying to) restore focus to a closed menu, go to MenuBar instead
		dlg._savedFocus = dom.byId("header");
	};

	//var setTextBoxPadding;
	// current setting (if there is one) to override theme default padding on TextBox based widgets
	var currentInputPadding = "";

	setTextBoxPadding = function(){
		// summary:
		//		Handler for when a MenuItem is clicked to set non-default padding for
		//		TextBox widgets

		// Effectively ignore clicks on the	 currently checked MenuItem
		if(!this.get("checked")){
			this.set("checked", true);
		}

		// val will be "theme default", "0px", "1px", ..., "5px"
		var val = this.get("label");

		// Set class on body to get requested padding, and remove any previously set class
		if(currentInputPadding){
			domClass.remove(win.body(), currentInputPadding);
			currentInputPadding = "";
		}
		if(val != "theme default"){
			currentInputPadding = "inputPadding" + val.replace("px", "");
			domClass.add(win.body(), currentInputPadding);
		}

		// Clear previously checked MenuItem (radio-button effect).
		array.forEach(this.getParent().getChildren(), function(mi){
			if(mi != this){
				mi.set("checked", false);
			}
		}, this);
	};

	// Data for Tree, ComboBox, InlineEditBox
	var data = [
		{ id: "earth", name: "The earth", type: "planet", population: "6 billion"},
		{ id: "AF", name: "Africa", type: "continent", population: "900 million", area: "30,221,532 sq km",
			timezone: "-1 UTC to +4 UTC", parent: "earth"},
		{ id: "EG", name: "Egypt", type: "country", parent: "AF" },
		{ id: "KE", name: "Kenya", type: "country", parent: "AF" },
		{ id: "Nairobi", name: "Nairobi", type: "city", parent: "KE" },
		{ id: "Mombasa", name: "Mombasa", type: "city", parent: "KE" },
		{ id: "SD", name: "Sudan", type: "country", parent: "AF" },
		{ id: "Khartoum", name: "Khartoum", type: "city", parent: "SD" },
		{ id: "AS", name: "Asia", type: "continent", parent: "earth" },
		{ id: "CN", name: "China", type: "country", parent: "AS" },
		{ id: "IN", name: "India", type: "country", parent: "AS" },
		{ id: "RU", name: "Russia", type: "country", parent: "AS" },
		{ id: "MN", name: "Mongolia", type: "country", parent: "AS" },
		{ id: "OC", name: "Oceania", type: "continent", population: "21 million", parent: "earth"},
		{ id: "AU", name: "Australia", type: "country", population: "21 million", parent: "OC"},
		{ id: "EU", name: "Europe", type: "continent", parent: "earth" },
		{ id: "DE", name: "Germany", type: "country", parent: "EU" },
		{ id: "FR", name: "France", type: "country", parent: "EU" },
		{ id: "ES", name: "Spain", type: "country", parent: "EU" },
		{ id: "IT", name: "Italy", type: "country", parent: "EU" },
		{ id: "NA", name: "North America", type: "continent", parent: "earth" },
		{ id: "MX", name: "Mexico", type: "country", population: "108 million", area: "1,972,550 sq km",
			parent: "NA" },
		{ id: "Mexico City", name: "Mexico City", type: "city", population: "19 million", timezone: "-6 UTC", parent: "MX"},
		{ id: "Guadalajara", name: "Guadalajara", type: "city", population: "4 million", timezone: "-6 UTC", parent: "MX" },
		{ id: "CA", name: "Canada", type: "country", population: "33 million", area: "9,984,670 sq km", parent: "NA" },
		{ id: "Ottawa", name: "Ottawa", type: "city", population: "0.9 million", timezone: "-5 UTC", parent: "CA"},
		{ id: "Toronto", name: "Toronto", type: "city", population: "2.5 million", timezone: "-5 UTC", parent: "CA" },
		{ id: "US", name: "United States of America", type: "country", parent: "NA" },
		{ id: "SA", name: "South America", type: "continent", parent: "earth" },
		{ id: "BR", name: "Brazil", type: "country", population: "186 million", parent: "SA" },
		{ id: "AR", name: "Argentina", type: "country", population: "40 million", parent: "SA" }
	];

	// Create test store.
	continentStore = new Memory({
		data: data
	});

	// Since dojo.store.Memory doesn't have various store methods we need, we have to add them manually
	continentStore.getChildren = function(object){
		// Add a getChildren() method to store for the data model where
		// children objects point to their parent (aka relational model)
		return this.query({parent: this.getIdentity(object)});
	};

	// Create the model for the Tree
	continentModel = new ObjectStoreModel({store: continentStore, query: {id: "earth"}});

	parser.parse(dom.byId('container')).then(function(){
		dom.byId('loaderInner').innerHTML += " done.";
		setTimeout(function hideLoader(){
			baseFx.fadeOut({
				node: 'loader',
				duration: 500,
				onEnd: function(n){
					n.style.display = "none";
				}
			}).play();
		}, 250);

		// availableThemes[] is just a list of 'official' dijit themes, you can use ?theme=String
		// for 'un-supported' themes, too. (eg: yours)
		var availableThemes = [
			{ theme: "claro", author: "Dojo", baseUri: "../themes/" },
			{ theme: "tundra", author: "Dojo", baseUri: "../themes/" },
			{ theme: "soria", author: "nikolai", baseUri: "../themes/" },
			{ theme: "nihilo", author: "nikolai", baseUri: "../themes/" }
		];

		// Get current theme, a11y, and dir setting for page
		var curTheme = location.search.replace(/.*theme=([a-z]+).*/, "$1") || "claro",
			a11y = has("highcontrast") || /a11y=true/.test(location.search),
			rtl = document.body.parentNode.dir == "rtl";
		
		function setUrl(theme, rtl, a11y){
			// Function to reload page with specified theme, rtl, and a11y settings
			location.search = "?theme=" + theme + (rtl ? "&dir=rtl" : "") + (a11y ? "&a11y=true" : "");
		}

		// Create menu choices and links to test other themes
		var tmpString = '';
		array.forEach(availableThemes, function(theme){
			if(theme != curTheme){
				tmpString +=
					'<a href="?theme=' + theme.theme + '">' + theme.theme + '</' + 'a> (' +
					'<a href="?theme=' + theme.theme + '&dir=rtl">RTL</' + 'a> ' +
					'<a href="?theme=' + theme.theme + '&a11y=true">high-contrast</' + 'a> ' +
					'<a href="?theme=' + theme.theme + '&dir=rtl&a11y=true">RTL+high-contrast</' + 'a> )' +
					' - by: ' + theme.author + ' <br>';
			}
		});
		dom.byId('themeData').innerHTML = tmpString;

		// Create menu choices to test other themes
		array.forEach(availableThemes, function(theme){
			registry.byId('themeMenu').addChild(new RadioMenuItem({
				id: theme.theme + "_radio",
				label: theme.theme,
				group: "theme",
				checked: theme.theme == curTheme,
				onClick: function(){
					// Change theme, keep current a11y and rtl settings
					setUrl(theme.theme, a11y, rtl);
				}
			}));
		});
		registry.byId('themeMenu').addChild(new MenuSeparator({}));
		registry.byId('themeMenu').addChild(new CheckedMenuItem({
			label: "RTL",
			checked: rtl,
			onChange: function(val){
				// Keep current theme and a11y setting, but use new dir setting
				setUrl(curTheme, val, a11y);
			}
		}));
		registry.byId('themeMenu').addChild(new CheckedMenuItem({
			label: "high contrast",
			checked: a11y,
			onChange: function(val){
				// Keep current theme and dir setting, but use high-contrast (or not-high-contrast) setting
				setUrl(curTheme, rtl, val);
			}
		}));

		// It's the server's responsibility to localize the date displayed in the (non-edit) version of an InlineEditBox,
		// but since we don't have a server we'll hack it in the client
		registry.byId("backgroundArea").set('value', locale.format(new Date(2005, 11, 30), { selector: 'date' }));

		var nineAm = new Date(0);
		nineAm.setHours(9);
		registry.byId("timePicker").set('value', locale.format(nineAm, { selector: 'time' }));
	});
});