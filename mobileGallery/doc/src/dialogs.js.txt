require(["dojo/dom", 
         "dijit/registry",
         "dojox/mobile/ProgressIndicator",
         "dojox/mobile/parser", "dojox/mobile",
         "dojox/mobile/compat",
         "dojox/mobile/SimpleDialog",
         "dojox/mobile/TextBox",
         "dojox/mobile/Button",
         "dojox/mobile/Slider"], function(dom, registry, ProgressIndicator){
                 
  show = function(dlg){
    registry.byId(dlg).show();
  }
  
  hide = function(dlg){
    registry.byId(dlg).hide();
  }
  
  var prog;
  
  show_progress_indicator = function(dlg, cont){
    show(dlg);
    var container = dom.byId(cont);
    prog = ProgressIndicator.getInstance();
    container.appendChild(prog.domNode);
    prog.start();
    setTimeout(function(){
      hide_progress_indicator(dlg);
    }, 5000);
  }
  
  hide_progress_indicator = function(dlg){
    prog.stop();
    hide(dlg);
  }
  
});
