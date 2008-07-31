// For accessing Geonames service
dojo.require("dojo.io.script");
dojo.require("dojox.rpc.Service");

dojo.require("dijit.Tree");
dojo.require("dijit._Calendar");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.form.CurrencyTextBox");
dojo.require("dijit.form.NumberSpinner");
dojo.require("dijit.form.ComboBox");
dojo.require("dijit.ColorPalette");
dojo.require("dijit.Menu");
dojo.require("dojo.parser");

var model = null;
dojo.require("demos.i18n.model");
(function(){
	model = new i18nTreeModel({ lang: lang });
})();