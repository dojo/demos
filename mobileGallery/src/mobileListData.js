define(["dojo/_base/lang", // dojo.clone
        "dojo/_base/kernel", // dojo.getObject
        "dojo/data/ItemFileWriteStore", "dojox/mobile/RoundRectDataList"], function() {
dojo.getObject("demos.mobile.src.mobileLists", true);
demos.mobile.src.mobileLists = function() {
    var static_data = { 
                items: [ 
                    {label: "Apple"},
                    {label: "Banana"},
                    {label: "Cherry"},
                    {label: "Grape"},
                    {label: "Kiwi"},
                    {label: "Lemon"},
                    {label: "Melon"},
                    {label: "Orange"},
                    {label: "Peach"}
                ]
            };
    var _store1 = new dojo.data.ItemFileWriteStore({url: "data/dataList.json", clearOnClose: true});
    var _store2 = new dojo.data.ItemFileWriteStore({data: dojo.clone(static_data)});
    return {
        store1 : _store1,
        store2 : _store2,
        newItems : [[],[]],
        listsStore : _store1,
        switchTo : function(store) {
            this.listsStore = store;
            dijit.byId("mobileListsDataList").setStore(this.listsStore);
        },
        add1 : function() {
            var item = this.listsStore.newItem({label : "New Item" } );
            this.newItems[(this.listsStore == this.store1) ? 1 : 0].push(item);
        },
        delete1 : function() {
            var item = this.newItems[(this.listsStore== this.store1) ? 1 : 0].pop();
            if(item){
                this.listsStore.deleteItem(item);
            }
        }
    };
}();
});