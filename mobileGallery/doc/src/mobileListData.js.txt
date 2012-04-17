define(["dojo/_base/lang", 
		"dojo/_base/connect", 
		"dojo/dom","dojo/dom-class",
		"dijit/registry",
		"dojo/data/ItemFileWriteStore",
		"dojox/mobile/iconUtils",
		"dojox/mobile/RoundRectDataList"],
function(lang, connect, dom, domClass, registry, ItemFileWriteStore, iconUtils, RoundRectDataList) {
	lang.getObject("demos.mobile.src.mobileLists", true);
	demos.mobile.src.mobileLists = function() {
		var static_data = { 
			items: [ 
				{label: "Apple"},
				{label: "Banana"},
				{label: "Cherry"},
				{label: "Grape"},
				{label: "Kiwi"}
			]
		};
		var _store1 = new ItemFileWriteStore({url: "data/dataList.json", clearOnClose: true});
		var _store2 = new ItemFileWriteStore({data: lang.clone(static_data)});
		return {
			store1 : _store1,
			store2 : _store2,
			newItems : [[],[]],
			listsStore : _store1,
			updateItemCount: function(){
				this.listsStore.fetch({query:{},
					onBegin: function(size){
						dom.byId("listLengthLabel").innerHTML = size;
					},
					start: 0,
					count: 0});
			},
			switchTo : function(idx) {
				this.listsStore = (idx === 1 ? _store1 : _store2 );
				registry.byId("mobileListsDataList").setStore(this.listsStore);
				var set1Btn = dom.byId("mobileListSet1Btn");
				var set2Btn = dom.byId("mobileListSet2Btn");
				if (idx === 1){
					domClass.add(set1Btn, "mobileListSelected");
					domClass.add(set2Btn, "mobileListUnselected");
					domClass.remove(set1Btn, "mobileListUnselected");
					domClass.remove(set2Btn, "mobileListSelected");
				} else {
					domClass.add(set1Btn, "mobileListUnselected");
					domClass.add(set2Btn, "mobileListSelected");
					domClass.remove(set1Btn, "mobileListSelected");
					domClass.remove(set2Btn, "mobileListUnselected");
				}
				this.updateItemCount();
			},
			add1 : function() {
				var item = this.listsStore.newItem({label : "New Item" } );
				this.newItems[(this.listsStore == this.store1) ? 1 : 0].push(item);
				this.updateItemCount();
			},
			delete1 : function() {
				var item = this.newItems[(this.listsStore== this.store1) ? 1 : 0].pop();
				if(item){
					this.listsStore.deleteItem(item);
				}
				this.updateItemCount();
			}
		};
	}();
	return {
		init: function() { 
			var view = registry.byId("mobileLists");
			var isInit = false;
			connect.connect(view, "onAfterTransitionIn", view, function(){
				if (!isInit) {
					this.resize();
					isInit = true;
				};
			});
			iconUtils.createDomButton(dom.byId("mobileListAddBtn"));
			iconUtils.createDomButton(dom.byId("mobileListDelBtn"));
		}
	};
});
