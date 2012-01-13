require([
	"require",
	"dojo/_base/array",
	"dojo/_base/config",
	"dojo/dom",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/_base/kernel",
	"dojo/query",
	"dojo/ready",
	"dojo/_base/window",
	"dojo/_base/fx",
	"dijit/registry",
	"dijit/MenuItem",
	"dojo/date/locale",
	"dojo/parser",
	"dojo/data/ItemFileReadStore",
	"dijit/tree/ForestStoreModel",
	"dojo/number", // dojo.number.format
	"dojo/dnd/Source", // dojo.dnd.Source
	"dojo/_base/json", // dojo.toJson
	"dijit/dijit-all" // dijit.*
], function(require, array, config, dom, domClass, domConstruct, kernel, query, ready, win, fx, registry, MenuItem, locale, parser, ItemFileReadStore, ForestStoreModel){

	continentStore = new ItemFileReadStore({ data: {
		identifier: 'id',
		label: 'name',
		items: [
		        { id: 'AF', name:'Africa', type:'continent', population:'900 million', area: '30,221,532 sq km',
		        		timezone: '-1 UTC to +4 UTC',
		        		children:[{_reference:'EG'}, {_reference:'KE'}, {_reference:'SD'}] },
		        	{ id: 'EG', name:'Egypt', type:'country' },
		        	{ id: 'KE', name:'Kenya', type:'country',
		        			children:[{_reference:'Nairobi'}, {_reference:'Mombasa'}] },
		        		{ id: 'Nairobi', name:'Nairobi', type:'city' },
		        		{ id: 'Mombasa', name:'Mombasa', type:'city' },
		        	{ id: 'SD', name:'Sudan', type:'country',
		        			children:{_reference:'Khartoum'} },
		        		{ id: 'Khartoum', name:'Khartoum', type:'city' },
		        	{ id: 'AS', name:'Asia', type:'continent',
		        			children:[{_reference:'CN'}, {_reference:'IN'}, {_reference:'RU'}, {_reference:'MN'}] },
		        		{ id: 'CN', name:'China', type:'country' },
		        		{ id: 'IN', name:'India', type:'country' },
		        		{ id: 'RU', name:'Russia', type:'country' },
		        		{ id: 'MN', name:'Mongolia', type:'country' },
		        	{ id: 'OC', name:'Oceania', type:'continent', population:'21 million',
		        			children:{_reference:'AU'}},
		        	{ id: 'AU', name:'Australia', type:'country', population:'21 million'},
		        	{ id: 'EU', name:'Europe', type:'continent',
		        			children:[{_reference:'DE'}, {_reference:'FR'}, {_reference:'ES'}, {_reference:'IT'}] },
		        	{ id: 'DE', name:'Germany', type:'country' },
		        	{ id: 'FR', name:'France', type:'country' },
		        	{ id: 'ES', name:'Spain', type:'country' },
		        	{ id: 'IT', name:'Italy', type:'country' },
		        { id: 'NA', name:'North America', type:'continent',
		        		children:[{_reference:'MX'}, {_reference:'CA'}, {_reference:'US'}] },
		        	{ id: 'MX', name:'Mexico', type:'country',  population:'108 million', area:'1,972,550 sq km',
		        			children:[{_reference:'Mexico City'}, {_reference:'Guadalajara'}] },
		        		{ id: 'Mexico City', name:'Mexico City', type:'city', population:'19 million', timezone:'-6 UTC'},
		        		{ id: 'Guadalajara', name:'Guadalajara', type:'city', population:'4 million', timezone:'-6 UTC' },
		        	{ id: 'CA', name:'Canada', type:'country',  population:'33 million', area:'9,984,670 sq km',
		        			children:[{_reference:'Ottawa'}, {_reference:'Toronto'}] },
		        		{ id: 'Ottawa', name:'Ottawa', type:'city', population:'0.9 million', timezone:'-5 UTC'},
		        		{ id: 'Toronto', name:'Toronto', type:'city', population:'2.5 million', timezone:'-5 UTC' },
		        	{ id: 'US', name:'United States of America', type:'country' },
		        { id: 'SA', name:'South America', type:'continent',
		        		children:[{_reference:'BR'}, {_reference:'AR'}] },
		        	{ id: 'BR', name:'Brazil', type:'country', population:'186 million' },
		        	{ id: 'AR', name:'Argentina', type:'country', population:'40 million' }
		]
	}});
	stateStore = new ItemFileReadStore({ data: {
		identifier:"abbreviation",
		label: "name",
		items: [
			{name:"Alabama", label:"<img width='97px' height='127px' src='images/Alabama.jpg'/>Alabama",abbreviation:"AL"},
			{name:"Alaska", label:"Alaska",abbreviation:"AK"},
			{name:"American Samoa", label:"American Samoa",abbreviation:"AS"},
			{name:"Arizona", label:"Arizona",abbreviation:"AZ"},
			{name:"Arkansas", label:"Arkansas",abbreviation:"AR"},
			{name:"Armed Forces Europe", label:"Armed Forces Europe",abbreviation:"AE"},
			{name:"Armed Forces Pacific", label:"Armed Forces Pacific",abbreviation:"AP"},
			{name:"Armed Forces the Americas", label:"Armed Forces the Americas",abbreviation:"AA"},
			{name:"California", label:"California",abbreviation:"CA"},
			{name:"Colorado", label:"Colorado",abbreviation:"CO"},
			{name:"Connecticut", label:"Connecticut",abbreviation:"CT"},
			{name:"Delaware", label:"Delaware",abbreviation:"DE"},
			{name:"District of Columbia", label:"District of Columbia",abbreviation:"DC"},
			{name:"Federated States of Micronesia", label:"Federated States of Micronesia",abbreviation:"FM"},
			{name:"Florida", label:"Florida",abbreviation:"FL"},
			{name:"Georgia", label:"Georgia",abbreviation:"GA"},
			{name:"Guam", label:"Guam",abbreviation:"GU"},
			{name:"Hawaii", label:"Hawaii",abbreviation:"HI"},
			{name:"Idaho", label:"Idaho",abbreviation:"ID"},
			{name:"Illinois", label:"Illinois",abbreviation:"IL"},
			{name:"Indiana", label:"Indiana",abbreviation:"IN"},
			{name:"Iowa", label:"Iowa",abbreviation:"IA"},
			{name:"Kansas", label:"Kansas",abbreviation:"KS"},
			{name:"Kentucky", label:"Kentucky",abbreviation:"KY"},
			{name:"Louisiana", label:"Louisiana",abbreviation:"LA"},
			{name:"Maine", label:"Maine",abbreviation:"ME"},
			{name:"Marshall Islands", label:"Marshall Islands",abbreviation:"MH"},
			{name:"Maryland", label:"Maryland",abbreviation:"MD"},
			{name:"Massachusetts", label:"Massachusetts",abbreviation:"MA"},
			{name:"Michigan", label:"Michigan",abbreviation:"MI"},
			{name:"Minnesota", label:"Minnesota",abbreviation:"MN"},
			{name:"Mississippi", label:"Mississippi",abbreviation:"MS"},
			{name:"Missouri", label:"Missouri",abbreviation:"MO"},
			{name:"Montana", label:"Montana",abbreviation:"MT"},
			{name:"Nebraska", label:"Nebraska",abbreviation:"NE"},
			{name:"Nevada", label:"Nevada",abbreviation:"NV"},
			{name:"New Hampshire", label:"New Hampshire",abbreviation:"NH"},
			{name:"New Jersey", label:"New Jersey",abbreviation:"NJ"},
			{name:"New Mexico", label:"New Mexico",abbreviation:"NM"},
			{name:"New York", label:"New York",abbreviation:"NY"},
			{name:"North Carolina", label:"North Carolina",abbreviation:"NC"},
			{name:"North Dakota", label:"North Dakota",abbreviation:"ND"},
			{name:"Northern Mariana Islands", label:"Northern Mariana Islands",abbreviation:"MP"},
			{name:"Ohio", label:"Ohio",abbreviation:"OH"},
			{name:"Oklahoma", label:"Oklahoma",abbreviation:"OK"},
			{name:"Oregon", label:"Oregon",abbreviation:"OR"},
			{name:"Pennsylvania", label:"Pennsylvania",abbreviation:"PA"},
			{name:"Puerto Rico", label:"Puerto Rico",abbreviation:"PR"},
			{name:"Rhode Island", label:"Rhode Island",abbreviation:"RI"},
			{name:"South Carolina", label:"South Carolina",abbreviation:"SC"},
			{name:"South Dakota", label:"South Dakota",abbreviation:"SD"},
			{name:"Tennessee", label:"Tennessee",abbreviation:"TN"},
			{name:"Texas", label:"Texas",abbreviation:"TX"},
			{name:"Utah", label:"Utah",abbreviation:"UT"},
			{name:"Vermont", label:"Vermont",abbreviation:"VT"},
			{name: "Virgin Islands, U.S.",label:"Virgin Islands, U.S.",abbreviation:"VI"},
			{name:"Virginia", label:"Virginia",abbreviation:"VA"},
			{name:"Washington", label:"Washington",abbreviation:"WA"},
			{name:"West Virginia", label:"West Virginia",abbreviation:"WV"},
			{name:"Wisconsin", label:"Wisconsin",abbreviation:"WI"},
			{name:"Wyoming", label:"Wyoming",abbreviation:"WY"}
		]
	}});
	continentModel = new ForestStoreModel({store:continentStore, query:{type:"continent"},rootId:"continentRoot", rootLabel:"Continents", childrenAttrs:["children"]});

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

	ready(function(){
		// Delay parsing until the dynamically injected theme <link>'s have had time to finish loading
		setTimeout(function(){
			parser.parse(dom.byId('container'));

			dom.byId('loaderInner').innerHTML += " done.";
			setTimeout(function hideLoader(){
				fx.fadeOut({ 
					node: 'loader', 
					duration:500,
					onEnd: function(n){
						n.style.display = "none";
					}
				}).play();
			}, 250);

			// Fill in menu/links to get to other themes.		
			// availableThemes[] is just a list of 'official' dijit themes, you can use ?theme=String
			// for 'un-supported' themes, too. (eg: yours)
			var availableThemes = [
				{ theme:"claro", author:"Dojo", baseUri:"../../dijit/themes/" },
				{ theme:"tundra", author:"Dojo", baseUri:"../../dijit/themes/" },
				{ theme:"soria", author:"nikolai", baseUri:"../../dijit/themes/" },
				{ theme:"nihilo", author:"nikolai", baseUri:"../../dijit/themes/" }
			];

			var tmpString='';
			array.forEach(availableThemes,function(theme){
				tmpString += 
					'<a href="?theme='+theme.theme+'">'+theme.theme+'</'+'a> (' +
					'<a href="?theme='+theme.theme+'&dir=rtl">RTL</'+'a> ' +
					'<a href="?theme='+theme.theme+'&a11y=true">high-contrast</'+'a> ' +
					'<a href="?theme='+theme.theme+'&dir=rtl&a11y=true">RTL+high-contrast</'+'a> )' +
					' - by: '+theme.author+' <br>';
				registry.byId('themeMenu').addChild(new MenuItem({
					label: theme.theme,
					onClick: function(){ location.search = "?theme=" + theme.theme; }
				}))
			});
			dom.byId('themeData').innerHTML = tmpString;

			// It's the server's responsibility to localize the date displayed in the (non-edit) version of an InlineEditBox,
			// but since we don't have a server we'll hack it in the client
			registry.byId("backgroundArea").set('value', locale.format(new Date(2005, 11, 30), { selector: 'date' }));

			var nineAm = new Date(0);
			nineAm.setHours(9);
			registry.byId("timePicker").set('value', locale.format(nineAm, { selector: 'time' }));
		}, 320);
	});

//		you should NOT be using this in a production environment. include
//		your css and set your classes manually. for test purposes only ...

	var dir = "",
		theme = false,
		themeModule = "dijit",
		testMode = null,
		defTheme = "claro",
		vars={};

	if(window.location.href.indexOf("?") > -1){
		var str = window.location.href.substr(window.location.href.indexOf("?")+1).split(/#/);
		var ary  = str[0].split(/&/);
		for(var i=0; i<ary.length; i++){
			var split = ary[i].split("="),
				key = split[0],
				value = (split[1]||'').replace(/[^\w]/g, "");	// replace() to prevent XSS attack
			switch(key){
				case "locale":
					// locale string | null
					kernel.locale = config.locale = locale = value;
					break;
				case "dir":
					// rtl | null
					document.getElementsByTagName("html")[0].dir = value;
					dir = value;
					break;
				case "theme":
					// tundra | soria | nihilo | claro | null
					theme = value;
					break;
				case "a11y":
					if(value){ testMode = "dijit_a11y"; }
					break;
				case "themeModule":
					// moduleName | null
					if(value){ themeModule = value; }
			}
			vars[key] = value;
		}
	}
	kernel._getVar = function(k, def){	// TODO: not sure what this is
		return vars[k] || def;
	};

	// BIDI
	if(dir == "rtl"){
		ready(0, function(){
			// pretend all the labels are in an RTL language, because
			// that affects how they lay out relative to inline form widgets
			query("label").attr("dir", "rtl");
		});
	}

	// a11y
	if(testMode){
		ready(0, function(){
			var b = win.body();
			if(testMode){
				domClass.add(b, testMode);
			}
		});
	}

	// If URL specifies a non-claro theme then pull in those theme CSS files and modify
	// <body> to point to that new theme instead of claro.
	//
	// Also defer parsing and any dojo.ready() calls that the test file makes
	// until the CSS has finished loading.
	if(theme){
		// Wait until JS modules have finished loading so this doesn't confuse
		// AMD loader.
		ready(1, function(){
			// Reset <body> to point to the specified theme
			var b = win.body();
			domClass.replace(b, theme, defTheme);

			// Remove claro CSS
			query('link[href$="claro.css"]').orphan();
			query('link[href$="claro/document.css"]').orphan();

			// Load theme CSS.
			// Eventually would like to use [something like]
			// https://github.com/unscriptable/curl/blob/master/src/curl/plugin/css.js
			// to load the CSS and then know exactly when it finishes loading.
			var modules = [
				require.toUrl(themeModule+"/themes/"+theme+"/"+theme+".css"),
				require.toUrl(themeModule+"/themes/"+theme+"/"+theme+"_rtl.css"),
				require.toUrl("dojo/resources/dojo.css")
			];
			var head = query("head")[0];
			array.forEach(modules, function(css){
				if(document.createStyleSheet){
					// For IE
					document.createStyleSheet(css);
				}else{
					// For other browsers
					domConstruct.place('<link rel="stylesheet" type="text/css" href="'+css+'"/>',
						head);
				}
			});
		});
	}
});
