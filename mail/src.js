define([
	"dojo/ready",
	"dojo/_base/window",
	"dojo/date/locale",
	"dojo/date/stamp",
	"dojo/dom-style",
	"dojo/on",
	"dojo/dom-class",
	"dojo/dom",
	"dojo/_base/lang",
	"dojo/parser",
	"dojo/data/ItemFileWriteStore",
	"dojo/query",
	"dijit/layout/AccordionContainer",
	"dijit/Calendar",
	"dijit/layout/TabContainer",
	"dijit/_editor/plugins/LinkDialog",
	"dijit/ProgressBar",
	"dijit/Declaration",
	"dijit/Editor",
	"dijit/Toolbar",
	"dijit/Menu",
	"dijit/Tree",
	"dijit/Tooltip",
	"dijit/Dialog",
	"dijit/_editor/plugins/FontChoice",
	"dijit/ColorPalette",
	"dijit/form/FilteringSelect",
	"dijit/form/CheckBox",
	"dijit/dijit",
	"dijit/form/ComboBox",
	"dijit/form/ComboButton",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/Textarea",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dojox/analytics/Urchin",
	"dojox/grid/DataGrid",
	"dojox/widget/FisheyeLite",
	"dijit/registry",
	"dojo/_base/fx",
	"dojo/fx/easing",
	"dojo/string"
], function (ready, windowModule, dateLocale, dateStamp, domStyle, on, domClass, dom, lang, parser, dataItemFileWriteStore, queryModule, layoutAccordionContainer, Calendar, layoutTabContainer, _editorPluginsLinkDialog, ProgressBar, Declaration, Editor, Toolbar, Menu, Tree, Tooltip, Dialog, _editorPluginsFontChoice, ColorPalette, formFilteringSelect, formCheckBox, dijit, formComboBox, formComboButton, formForm, formTextBox, formTextarea, layoutBorderContainer, layoutContentPane, analyticsUrchin, gridDataGrid, widgetFisheyeLite, registry, fx, easing, string) {

	ready(function(){
	
		parser.parse();
		windowModule.body().setAttribute("role", "application");
	
		var n = dom.byId("preLoader");
		fx.fadeOut({
			node:n,
			duration:720,
			onEnd:function(){
				// dojo._destroyElement(n);
				domStyle.set(n, "display", "none");
			}
		}).play();
	
		// Set up handler so that when contact information is updated the "display field"
		// (used by "To" field drop-down") is also updated
		on(contactStore, "Set", function(/* item */ item,
						/* attribute-name-string */ attribute,
						/* Object|Array */ oldValue,
						/* Object|Array */ newValue){
			if(attribute != "display"){
				contactStore.setValue(item, "display",
						contactStore.getValue(item, "first") + " " +
						contactStore.getValue(item, "last") + " <" +
						contactStore.getValue(item, "email") + ">");
			}
		});
		
		// make tooltips go down (from buttons on toolbar) rather than to the right
		Tooltip.defaultPosition = ["above", "below"];
		
		// Write A-Z "links" on contactIndex tab to do filtering
		genIndex();
	
		new analyticsUrchin({
			acct: "UA-3572741-1",
			GAonLoad: function(){
				this.trackPageView("/demos/dijitmail");
			}
		});
	
	});
	
	function genIndex(){
		// summary:
		//		generate A-Z push buttons for navigating contact list
		var ci = dom.byId("contactIndex");
		
		function addChar(c, func, cls){
			// add specified character, when clicked will execute func
			var span = document.createElement("span");
			span.innerHTML = c;
			span.className = cls || "contactIndex";
			ci.appendChild(span);
			new widgetFisheyeLite(
				{
					properties: {fontSize: 1.5},
					easeIn: easing.linear,
					durationIn: 100,
					easeOut: easing.linear,
					durationOut: 100
				},
				span
			);
			on(span, "click", func || function(){ contactTable.setQuery({first: c+"*"}, {ignoreCase: true}) });
			on(span, "click", function(){
				queryModule(">", ci).removeClass("contactIndexSelected");
				domClass.add(span, "contactIndexSelected");
			});
		}
	
		addChar("ALL", function(){contactTable.setQuery({})}, 'contactIndexAll' );
		for(var l = "A".charCodeAt(0); l <= "Z".charCodeAt(0); l++){
			addChar(String.fromCharCode(l))
		}
		addChar("ALL", function(){contactTable.setQuery({})}, 'contactIndexAll' );
	}
	
	// Globals used by demo.html
	paneId = 1;
	
	onMessageClick = function(cell){
		// summary:
		//		when user clicks a row in the message list pane
		var item = cell.grid.getItem(cell.rowIndex),
			sender = this.store.getValue(item, "sender"),
			subject = this.store.getValue(item, "label"),
			sent = dateLocale.format(
					dateStamp.fromISOString(this.store.getValue(item, "sent")),
					{formatLength: "long", selector: "date"}),
			text = this.store.getValue(item, "text"),
			messageInner = "<span class='messageHeader'>From: " + sender + "<br>" +
			"Subject: "+ subject + "<br>" +
			"Date: " + sent + "<br><br></span>" +
			text;
		registry.byId("message").setContent(messageInner);
	};
	
	searchMessages = function(){
		// summary:
		//		do a custom search for messages across inbox folders
		var query = {type: "message"};
		var searchCriteria = searchForm.get('value');
		for(var key in searchCriteria){
			var val = searchCriteria[key];
			if(val){
				query[key] = "*" + val + "*";
			}
			table.setQuery(query, {ignoreCase: true});
		}
	};
	
	// for "new message" tab closing
	testClose = function(pane,tab){
	  return confirm("Are you sure you want to leave your changes?");
	};
	
	// fake mail download code:
	var numMails;
	var updateFetchStatus = function(x){
		if(x == 0){
			registry.byId('fakeFetch').update({ indeterminate: false });
			return;
		}
		registry.byId('fakeFetch').update({ progress: x + 1 });
		if(x == numMails){
			fx.fadeOut({ node: 'fetchMail', duration:800,
				// set progress back to indeterminate. we're cheating, because this
				// doesn't actually have any data to "progress"
				onEnd: function(){
					registry.byId('fakeFetch').update({ indeterminate: true });
					dom.byId('fetchMail').style.visibility='hidden'; // remove progress bar from tab order
				}
			}).play();
		}
	}
	
	fakeReport = function(percent){
		// FIXME: can't set a label on an indeterminate progress bar
		// like if(this.indeterminate) { return " connecting."; }
		return string.substitute("Fetching: ${0} of ${1} messages.", [percent * this.maximum, this.maximum]);
	};
	
	fakeDownload = function(){
		dom.byId('fetchMail').style.visibility='visible';
		numMails = Math.floor(Math.random()*10) + 1;
		registry.byId('fakeFetch').update({ maximum: numMails, progress:0 });
		fx.fadeIn({ node: 'fetchMail', duration:300 }).play();
		for(var ii = 0; ii < numMails + 1; ++ii){
			var func = lang.partial(updateFetchStatus, ii);
			setTimeout(func,  ((ii + 1) * (Math.floor(Math.random()*100) + 400)));
		}
	};
	
	// fake sending dialog progress bar
	stopSendBar = function(){
		registry.byId('fakeSend').update({ indeterminate: false });
		registry.byId('sendDialog').hide();
		tabs.selectedChildWidget.onClose = function(){return true;};  // don't want confirm message
		tabs.closeChild(tabs.selectedChildWidget);
	};
		 
	showSendBar = function(){
		registry.byId('fakeSend').update({ indeterminate: true });
		registry.byId('sendDialog').show();
		setTimeout(function(){stopSendBar();}, 3000);
	};
	
	formatDate = function(inDatum){
	    return dateLocale.format(dateStamp.fromISOString(inDatum), {selector: "date"});
	};
	
	
});