dependencies = {
	stripConsole: "normal",
	optimize: "shrinksafe",
	cssOptimize: "comments.keepLines",
	version: "1.5.0-EditorDemo",
	action: "release",

	layers: [
		{
			name: "../demos/editor/layer.js",
			dependencies: [
				"dijit.layout.BorderContainer",
				"dijit.layout.ContentPane",
				"dijit.layout.AccordionContainer",
				"dijit.layout.ContentPane",
				"dojox.fx.text",
				"dijit.Editor",
				"dijit._editor.plugins.FullScreen",
				"dijit._editor.plugins.LinkDialog",
				"dijit._editor.plugins.Print",
				"dijit._editor.plugins.ViewSource",
				"dijit._editor.plugins.FontChoice",
				"dijit._editor.plugins.NewPage",
				"dijit._editor.plugins.ToggleDir",
				"dojox.editor.plugins.ShowBlockNodes",
				"dojox.editor.plugins.ToolbarLineBreak",
				"dojox.editor.plugins.Save",
				"dojox.editor.plugins.InsertEntity",
				"dojox.editor.plugins.Preview",
				"dojox.editor.plugins.PageBreak",
				"dojox.editor.plugins.PrettyPrint",
				"dojox.editor.plugins.NormalizeIndentOutdent",
				"dojox.editor.plugins.FindReplace",
				"dojox.editor.plugins.Breadcrumb",
				"dojox.editor.plugins.TextColor",
				"dojox.editor.plugins.CollapsibleToolbar",
				"dojox.editor.plugins.Blockquote",
				"dojox.editor.plugins.PasteFromWord",
				"dojox.editor.plugins.InsertAnchor",
				"dojox.editor.plugins.TablePlugins",
				"dojox.editor.plugins.PasteFromWord",
				"dojox.editor.plugins.Smiley",
				"dojox.editor.plugins.NormalizeStyle",
				"dojox.editor.plugins.StatusBar"
			]
		}
	],

	prefixes: [
		[ "dijit", "../dijit" ],
		[ "dojox", "../dojox" ],
		[ "demos", "../demos" ]
	]
}
