define([
	"dojo",
	"dojo/io/script",
	"dojo/parser",
	"dijit/form/ComboBox",
	"dijit/Tree",
	"dijit/Menu",
	"dijit/ColorPalette",
	"dijit/Calendar",
	"dijit/form/CurrencyTextBox",
	"dijit/form/DateTextBox",
	"dijit/form/NumberSpinner",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dojox/analytics/Urchin",
	"dojox/rpc/Service",
	"demos/i18n/model"
], function (dojo, ioScript, parser, formComboBox, Tree, Menu, ColorPalette, Calendar, formCurrencyTextBox, formDateTextBox, formNumberSpinner, layoutBorderContainer, layoutContentPane, analyticsUrchin, rpcService, i18nModel) {

	// For accessing Geonames service
	dojo.addOnLoad(function(){
		new analyticsUrchin({
			acct: "UA-3572741-1",
			GAonLoad: function(){
				this.trackPageView("/demos/i18n");
			}
		});
	});
});