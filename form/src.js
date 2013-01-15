define([
	"dojo",
	"dojo/parser",
	"dojo/data/ItemFileReadStore",
	"dijit/form/HorizontalSlider",
	"dijit/form/CurrencyTextBox",
	"dijit/form/Button",
	"dijit/form/CheckBox",
	"dijit/_editor/plugins/FontChoice",
	"dijit/Editor",
	"dijit/form/ComboBox",
	"dijit/form/DateTextBox",
	"dijit/form/FilteringSelect",
	"dijit/form/Form",
	"dijit/form/HorizontalRule",
	"dijit/form/HorizontalRuleLabels",
	"dijit/form/NumberSpinner",
	"dijit/form/RadioButton",
	"dijit/form/Textarea",
	"dijit/form/ValidationTextBox"
], function (dojo, parser, dataItemFileReadStore, formHorizontalSlider, formCurrencyTextBox, formButton, formCheckBox, _editorPluginsFontChoice, Editor, formComboBox, formDateTextBox, formFilteringSelect, formForm, formHorizontalRule, formHorizontalRuleLabels, formNumberSpinner, formRadioButton, formTextarea, formValidationTextBox) {

	// make dojo.toJson() print dates correctly (this feels a bit dirty)
	Date.prototype.json = function(){ return dojo.date.stamp.toISOString(this, {selector: 'date'});};
});