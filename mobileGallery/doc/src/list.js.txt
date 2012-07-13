define(["dojo/query",
	"dojo/dom",
	"dojo/dom-style",
	"dojo/on",
	"dojo/_base/connect",
	"dijit/registry",
	"./structure"], function(query, dom, style, on, connect, registry, structure){
	function createListSwitchHandler(hideEdge, root) {
		return function(node) {
			query(".roundRect", root).forEach(function(node) {
				node.style.display = (hideEdge ? "block" : "none");
			});
			query(".edgeToEdge", root).forEach(function(node) {
				node.style.display = (hideEdge ? "none" : "block");
			});
		};
	};

	var internalNavRecords = [];
	return {
		init: function() {
			on(registry.byId("filmListRndTab"), "click", createListSwitchHandler(true, "filmListView"));
			on(registry.byId("filmListEdgeTab"), "click", createListSwitchHandler(false, "filmListView"));
			on(registry.byId("musicListRndTab"), "click", createListSwitchHandler(true, "musicListView"));
			on(registry.byId("musicListEdgeTab"), "click", createListSwitchHandler(false, "musicListView"));
			var topViews = [{id:"filmListView",label:"Film Genres"}, {id:"musicListView", label:"Music"}];
			var filmViews = [{id:"actionFilmView", label: "Action Movies"}, {id:"comedyFilmView", label:"Comedy Movies"},
				{id:"scienceFilmView", label:"Science Movies"}];
			var musicViews = [{id:"baroqueMusicView", label:"Baroque Music"}, {id:"romanticMusicView", label:"Romantic Music"},
				{id:"modernMusicView", label:"Modern Music"}, {id:"alternativeMusicView",label:"Alternative Rock"},
				{id:"metalMusicView", label:"Metal Rock"}, {id:"progressiveMusicView",label:"Progressive Rock"},
			       	{id:"rbMusicView", label:"R&B Rock"}];
			function addTransitionInHandler(views, backCfg) {
				for (var i = 0; i < views.length; ++i) {
					var view = views[i];
					on(registry.byId(view.id), "afterTransitionIn", (function(view) {
						return function() {
							inTransitionOrLoading = false;
							dom.byId("headerLabel").innerHTML = view.label;
							var navRecords = structure.navRecords;
							navRecords.push({
								from: backCfg.id,
								fromTitle: backCfg.title,
								to: view.id,
								toTitle: view.label,
								navTitle: backCfg.title
							});
						};
					})(view));
				}
			}
			addTransitionInHandler(topViews, {id:"mainListView", title: "Lists"});
			addTransitionInHandler(filmViews, {id:"mainFilmListView", title: "Films"});
			addTransitionInHandler(musicViews, {id:"mainMusicListView", title: "Music"});

			connect.subscribe("onAfterDemoViewTransitionIn", function(id) {
				if (id == "list") {
					var navRecords = structure.navRecords;
					for (var i = 0; i < internalNavRecords.length ; ++i) {
						navRecords.push(internalNavRecords[i]);
					}
					// need to restore the title of previous view in internal navigation history
					if (navRecords.length > 0) {
						dom.byId("headerLabel").innerHTML = navRecords[navRecords.length -1].toTitle;
					}
				}
			});
			on(registry.byId("list"), "beforeTransitionOut", function() {
				var navRecords = structure.navRecords;
				internalNavRecords = [];
				for (var i = 0; i < navRecords.length ; ++ i) {
					var navRecord = navRecords[i];
					if (navRecord.from == "navigation" ||
						navRecord.to == "source")
						continue;
					internalNavRecords.push(navRecord);
				};
			});
		}
	};
});
