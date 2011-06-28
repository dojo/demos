define([
	"dojo/_base/kernel",
	"../core/_Module",
	"dijit/form/TextBox",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/json",
	"dojo/_base/connect"
], function(dojo, _Module){
	
	/*=====
	var columnDefinitionEditorMixin = {
		// editable: Boolean
		//		If true then the cells in this column will be editable. Default is false.
		editable: false, 
	
		// editor: Widget Class (Function) | String
		//		Set the dijit/widget to be used when a cell is in editing mode.
		//		The default dijit is dijit.form.TextBox.
		//		This attribute can either be the declared class name of a dijit or 
		//		the class construct function of a dijit (the one that is used behide "new" keyword).
		editor: "dijit.form.TextBox",
	
		// editorArgs: __GridCellEditorArgs
		editorArgs: null
	};
	
	var __GridCellEditorArgs = {
		// fromGridToEditor: Function(storeData, gridData) return anything
		//		By default the dijit used in an editing cell will use store value.
		//		If this default behavior can not meet the requirement (for example, store data is freely formatted date string,
		//		while the dijit is dijit.form.DateTextBox, which requires a Date object), this function can be used.
		fromGridToEditor: null,
	
		// fromEditorToGrid: Function(valueInEditor) return anything
		//		By default when applying an editing cell, the value of the editor dijit will be retreived by get('value') and
		//		directly set back to the store. If this can not meet the requirement, this getEditorValue function can be used
		//		to get a suitable value from editor.
		fromEditorToGrid: null,
	
		// dijitProperties: Properties for a dijit
		//		The properties to be used when creating the dijit in a editing cell.
		dijitProperties: null
	};
	=====*/
	
	
	return _Module.registerModule(
	dojo.declare('demos.gridx.src.modules.Edit', _Module, {
		name: 'edit',
	
		forced: ['cellDijit'],
	
		constructor: function(){
			this._editingCells = {};
		},
	
		getAPIPath: function(){
			return {
				edit: this
			};
		},
	
		load: function(){
			this.connect(this.grid, 'onCellDblClick', '_onUIBegin');
			this.connect(this.grid, 'onCellKeyPress', '_onKey');
			this.loaded.callback();
		},
	
		cellMixin: {
			beginEdit: function(){
				return this.grid.edit.begin(this.row.id, this.column.id);
			},
	
			cancelEdit: function(){
				this.grid.edit.cancel(this.row.id, this.column.id);
				return this;
			},
	
			applyEdit: function(){
				return this.grid.edit.apply(this.row.id, this.column.id);
			},
	
			isEditing: function(){
				return this.grid.edit.isEditing(this.row.id, this.column.id);
			}
		},
	
		columnMixin: {
			isEditable: function(){
				return this.grid._columnsById[this.id].editable;
			},
	
			setEditable: function(editable){
				this.grid._columnsById[this.id].editable = !!editable;
				return this;
			},
	
			editor: function(){
				return this.grid._columnsById[this.id].editor;
			},
	
			setEditor: function(/*dijit|short name*/dijitClass, args){
				this.grid.edit.setEditor(this.id, dijitClass, args);
				return this;
			}
		},
		
		//Public------------------------------------------------------------------------------
		begin: function(rowId, colId){
			//summary:
			//	Begin to edit a cell with defined dijit.
			if(!this.isEditing(rowId, colId)){
				var rowIndex = this.model.idToIndex(rowId),
					col = this.grid._columnsById[colId];
				if(rowIndex >= 0 && col.editable){
					this.grid.cellDijit.setCellDecorator(rowId, colId, 
						this._getDecorator(colId), 
						this._getEditorValueSetter(col.editorArgs && col.editorArgs.fromGridToEditor)
					);
					this._record(rowId, colId);
					this.grid.body.refresh(rowIndex, 1).then(dojo.hitch(this, this._focusEditor, rowId, colId));
					return true;
				}
				return false;
			}else{
				return true;
			}
		},
	
		cancel: function(rowId, colId){
			//summary:
			//	Cancel the edit. And end the editing state.
			var rowIndex = this.model.idToIndex(rowId);
			if(rowIndex >= 0){
				this.grid.cellDijit.restoreCellDecorator(rowId, colId);
				this._erase(rowId, colId);
				this.grid.body.refresh(rowIndex, 1);
			}
		},
	
		apply: function(rowId, colId){
			//summary:
			//	Apply the edit value to the grid store. And end the editing state.
			var cell = this.grid.cell(rowId, colId, true);
			if(cell){
				var widget = this.grid.cellDijit.getCellWidget(rowId, colId);
				if(widget && widget.gridCellEditField){
					var v = widget.gridCellEditField.get('value');
					try{
						var editorArgs = cell.column.editorArgs;
						if(editorArgs && editorArgs.fromEditorToGrid){
							v = editorArgs.fromEditorToGrid(v);
						}
						cell.setRawData(v);
					}catch(e){
						console.warn('Can not apply change! Error message: ', e);
						return false;
					}
					this.grid.cellDijit.restoreCellDecorator(rowId, colId);
					this._erase(rowId, colId);
					this.grid.body.refresh(cell.row.index(), 1);
				}
			}
			return true;
		},
	
		isEditing: function(rowId, colId){
			var widget = this.grid.cellDijit.getCellWidget(rowId, colId);
			return widget && !!widget.gridCellEditField;
		},
	
		setEditor: function(colId, editor, args){
			//summary:
			//	Define the dijit to edit a column of a grid.
			//	The dijit should have a get and set method to get value and set value.
			var col = this.grid._columnsById[colId],
				editorArgs = col.editorArgs = col.editorArgs || {};
			col.editor = editor;
			if(args){
				editorArgs.fromGridToEditor = args.fromGridToEditor;
				editorArgs.fromEditorToGrid = args.fromEditorToGrid;
				editorArgs.dijitProperties = args.dijitProperties;
			}
		},
	
		//Private------------------------------------------------------------------
	//    _init: function(){
			//summary:
			//	Init the grid so that it could have below behaviors:
			//	1. Double click a cell to begin edit.
			//	2. Tab to end one edit and jump to the next.
			//	3. Escape key to cancel edit.
			//	4. Make grid to set column editor by definition. Using column.defineEditor method.
	//    },
	
		_getColumnEditor: function(colId){
			var editor = this.grid._columnsById[colId].editor;
			if(dojo.isFunction(editor)){
				return editor.prototype.declaredClass;
			}else if(dojo.isString(editor)){
				return editor;
			}else{
				return 'dijit.form.TextBox';
			}
		},
	
		_focusEditor: function(rowId, colId){
			var widget = this.grid.cellDijit.getCellWidget(rowId, colId);
			if(widget && widget.gridCellEditField){
				widget.gridCellEditField.focus();
			}
		},
	
		_getDecorator: function(colId){
			var className = this._getColumnEditor(colId);
			var p, properties = [];
			var col = this.grid._columnsById[colId];
			var dijitProperties = col.editorArgs && col.editorArgs.dijitProperties;
			if(dijitProperties){
				for(p in dijitProperties){
					properties.push(p, "='", dojo.toJson(dijitProperties[p]), "' ");
				}
			}
			properties = properties.join('');
			return function(){
				return ["<div dojoType='", className, "' ",
					"dojoAttachPoint='gridCellEditField' ",
					"class='dojoxGridxHasGridCellValue dojoxGridxUseStoreData' ",
					"style='width: 100%; height:100%;' ",
					properties,
					"></div>"
				].join('');
			};
		},
	
		_getEditorValueSetter: function(fromGridToEditor){
			return fromGridToEditor && function(gridData, storeData, cellWidget){
				cellWidget.gridCellEditField.set('value', fromGridToEditor(storeData, gridData));
			};
		},
	
		_record: function(rowId, colId){
			var cells = this._editingCells, r = cells[rowId];
			if(!r){
				r = cells[rowId] = {};
			}
			r[colId] = true;
		},
	
		_erase: function(rowId, colId){
			var cells = this._editingCells, r = cells[rowId];
			if(r){
				delete r[colId];
			}
		},
	
		_onUIBegin: function(e){
			var cells = this._editingCells, r, c;
			for(r in cells){
				for(c in cells[r]){
					this.cancel(r, c);
				}
			}
			this.begin(e.rowId, e.columnId);
		},
	
		_onKey: function(e){
			var dk = dojo.keys;
			switch(e.keyCode){
				case dk.ENTER:
					this[this.isEditing(e.rowId, e.columnId) ? 'apply' : 'begin'](e.rowId, e.columnId);
					break;
				case dk.ESCAPE:
					this.cancel(e.rowId, e.columnId);
					break;
			}
		}
	}));
});