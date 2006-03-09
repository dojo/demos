// Mail demo javascript code

// Display list of messages (upper right pane)
function displayList(){
    this.update = function(message) {
        var clickedTreeNode =     
            message.node;

		var listPane = dojo.widget.getWidgetById("listPane");
		var url = "Mail/"+clickedTreeNode.title.replace(" ","") + ".html";
		
		listPane.setUrl(url);
    };
}
var displayer = new displayList();
var nodeSelectionTopic = dojo.event.topic.getTopic("listSelected");
nodeSelectionTopic.subscribe(displayer, "update");

// Display a single message (in bottom right pane)
function displayMessage(name){
		var contentPane = dojo.widget.getWidgetById("contentPane");
		var url = "Mail/"+name.replace(" ","") + ".html";
		contentPane.setUrl(url);
}