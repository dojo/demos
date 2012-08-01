require([
	"dojox/mobile",
	"dojox/mobile/parser",
	"dojox/mobile/compat",
	"dojox/mobile/deviceTheme",
	"dojox/data/FileStore",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/declare",
	"dojo/_base/config",
	"dojo/_base/query", 
	"dojo/_base/window",
	"dojo/ready",
	"dojo/dom",
	"dojo/dom-construct",
	"dijit/registry",
	"dijit/tree/ForestStoreModel",
	"dojox/mobile/Heading",
	"dojox/mobile/View",
	"dojox/mobile/ListItem", 
	"dojox/mobile/RoundRectList", 
	"dojox/mobile/ProgressIndicator",
	"dojox/mobile/_ScrollableMixin",
	"dojo/NodeList-traverse",
	"dojo/domReady!"
	], 
	function(mobile, parser, compat, deviceTheme, FileStore, array, lang, declare, config, $,
			window, ready, dom, domConstruct, registry, ForestStoreModel, Heading, View, ListItem, 
			RoundRectList, ProgressIndicator, ScrollableMixin){
	ready(function(){
		var store = new FileStore({
			url: "../../dojox/data/demos/stores/filestore_dojotree.php",
			id: "theStore",
			label: "name",
			pathAsQueryParam: true
		});
		var treeModel = new ForestStoreModel({
			store: store,
			rootLabel: "Files",
			childrenAttrs: ["children"],
			newItemIdAttr: "path"
		});
		declare("TreeView", [View, ScrollableMixin], {
			postCreate: function(){
				this._load();
				this.inherited(arguments);
			},
			_load: function() {
				this.model.getRoot(
					lang.hitch(this, function(item) {
						var scope = this;
						var list = new RoundRectList();
						var node = {};
						var listitem = new ListItem({
							label: scope.model.rootLabel,
							moveTo: '#',
							onClick: function() {scope.handleClick(this)},
							id: "modelRoot",
							item: item
						});
						list.addChild(listitem);
						this.addChild(list);
					})
				)
			},
			handleClick: function(li) {
				var newViewId = "view_";
				if (li.item[this.model.newItemIdAttr]) {
					newViewId += li.item[this.model.newItemIdAttr];
				} else {
					newViewId += "rootView";
				}
				newViewId = newViewId.replace('/', '_');
				if (registry.byId(newViewId)) {  // view already exists, just transition to it
					registry.byNode(li.domNode).transitionTo(newViewId);
					return;
				}
				var prog = ProgressIndicator.getInstance();
				window.body().appendChild(prog.domNode);
				prog.start();
				this.model.getChildren(li.item,
					lang.hitch(this, function(items) {
						var scope = this;
						var list = new RoundRectList();
						array.forEach(items, function(item, i) {
							var listItemArgs = {
								item: item,
								label: item[scope.model.store.label],
								transition: "slide"
							};
							if (scope.model.mayHaveChildren(item)) {
								listItemArgs.moveTo = '#';
								listItemArgs.onClick = function() {scope.handleClick(this)};
							}
							var listitem = new ListItem(listItemArgs);
							list.addChild(listitem);
						});
						// find the parent View's id so we can enable the back button
						var ulParent = $('#'+li.id).parent();
						var divParent = $('#'+ulParent[0].id).parent();
						var headingArgs = {
							label: "Dynamic View",
							back : "Back",
							moveTo : divParent[0].id
						};
						var heading = new Heading(headingArgs);
						var newView = View({
							id: newViewId,
							selected: true
						}, domConstruct.create("DIV", null, window.body()));
						newView.addChild(heading);
						newView.addChild(list);
						newView.startup();
						prog.stop();
						registry.byNode(li.domNode).transitionTo(newView.id);
					})
				);
			}
		});
		new TreeView({model: treeModel, selected: true}, dom.byId("treeView")).startup();
	});
});
