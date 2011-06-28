define([
	"dojo/_base/kernel",
	"dijit",
	"dojo/text!./GridConfig.html",
	"dojo/parser",
	"dijit/form/CheckBox",
	"dijit/form/RadioButton",
	"dijit/form/TextBox",
	"dijit/form/Select",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/html",
	"dojo/parser"
], function(dojo, dijit, template){

	return dojo.declare("demos.gridx.src._tests.GridConfig", [dijit._Widget, dijit._TemplatedMixin, dijit._WidgetsInTemplateMixin], {
		templateString: template,
		
		widgetsInTemplate: true,
		
		coreModules: [],
		
		modules: {},
		
		getID: function(type, name){
			return this.id + "_" + type + "_" + name;
		},
		
		_createModsNode: function(){
			var sb = [], modName, implName;
			for(modName in this.modules){
				var mod = this.modules[modName];
				sb.push("<tr><td><div dojoType='dijit.form.CheckBox' id='", this.getID('cb', modName), "'  modName='", modName, "' ", (mod.defaultCheck ? "checked='true' disabled='true'" : ""), "></div>", 
					"<label for='", this.getID('cb', modName), "'>", modName, "</label>",
					"</td><td><select dojoType='dijit.form.Select'", (mod['default'] ? ' disabled=true': ' '), " id='", this.getID('select', modName), "'>");
				for(implName in mod){
					if(implName == 'defaultCheck'){ continue; }
					sb.push("<option value='", implName, "'>", implName, "</option>");
				}
				sb.push("</select></td></tr>");
			}
			dojo.place(sb.join(''), this.modsNode);
		},
		
		postCreate: function(){
			this._createModsNode();
			
			dojo.parser.parse(this.domNode);
	
			for(modName in this.modules){
				this.connect(dijit.byId(this.getID('cb', modName)), 'onChange', dojo.hitch(this, '_onChangeCheckBox', modName, 'cb'));
			}
		},
			
		getMods: function(){
			var mods = [], modName;
			for(modName in this.modules){
				var mod = this.modules[modName];
				if(dijit.byId(this.getID('cb', modName)).get('checked')){
					var implName = dijit.byId(this.getID('select', modName)).get('value');
					if(implName){
						mods.push(mod[implName]);					
					}
				}
			}
			return mods.concat(this.coreModules);
		},
		
		_selectAllMods: function(checked){
			var modName;
			for(modName in this.modules){
				if(!this.modules[modName].defaultCheck){
					dijit.byId(this.getID('cb', modName)).set('checked', checked);
				}
			}
		}
	});
});