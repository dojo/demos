define([
'dojo',
'../core/_Module',
'dijit',
'dojox/grid/enhanced/plugins/Dialog',
"dojo/text!../templates/GotoPagePane.html",
"dojo/text!../templates/PaginationBar.html",
'dijit/_Widget',
'dijit/_TemplatedMixin',
'dijit/_WidgetsInTemplateMixin',
'dijit/form/Button',
'dijit/form/NumberTextBox',
'dojo/DeferredList',
'dojo/string',
'dojo/i18n!../nls/PaginationBar'
], function(dojo, _Module, dijit, Dialog, goToTemplate, barTemplate){

var strMaker = dojo.string.substitute;

dojo.declare('demos.gridx.src.modules.GotoPagePane', [dijit._Widget, dijit._TemplatedMixin, dijit._WidgetsInTemplateMixin], {
	templateString: goToTemplate,

	pager: null,

	postMixInProperties: function(){
		var nls = this.pager.module._nls;
		this._mainMsg = nls.gotoDialogMainMsg;
		this._okBtnLabel = nls.gotoDialogOKBtn;
		this._cancelBtnLabel = nls.gotoDialogCancelBtn;
	},

	postCreate: function(){
		this._updateStatus();
	},

	_updateStatus: function(){
		this.okBtn.set('disabled', !this.pageInputBox.isValid() || this.pageInputBox.get('displayedValue') === "");
	},

	_onOK: function(){
		this.pager.pagination.gotoPage(this.pageInputBox.get('value') - 1);
		this.pager._gotoDialog.hide();
	},

	_onCancel: function(){
		this.pager._gotoDialog.hide();
	}
});

dojo.declare('demos.gridx.src.modules.Pager', [dijit._Widget, dijit._TemplatedMixin], {
	templateString: barTemplate,

	pagination: null,

	module: null,

	postMixInProperties: function(){
		var nls = this.module._nls;
		this._firstPageTitle = nls.firstPageTitle;
		this._firstPageWai = nls.firstPageWai;
		this._prevPageTitle = nls.prevPageTitle;
		this._prevPageWai = nls.prevPageWai;
		this._nextPageTitle = nls.nextPageTitle;
		this._nextPageWai = nls.nextPageWai;
		this._lastPageTitle = nls.lastPageTitle;
		this._lastPageWai = nls.lastPageWai;
		this._gotoBtnTitle = nls.gotoBtnTitle;
		this._gotoBtnWai = nls.gotoBtnWai;
	},

	postCreate: function(){
		dojo.setSelectable(this.domNode, false);
		this.connect(this.pagination, 'onSwitchPage', '_onSwitchPage');
		this.connect(this.pagination, 'onChangePageSize', '_onChangePageSize');
		this.connect(this.module.grid.model, 'onSizeChange', '_onSwitchPage');
		this._createPageStepper();
		this._createPageSizeSwitch();
		this._createDescription();
	},

	_onSwitchPage: function(){
		this._createPageStepper();
		this._createDescription();
		this.module.grid.layout.reLayout();
	},

	_onChangePageSize: function(size, oldSize){
		var node = dojo.query('[pagesize="' + size + '"]', this._sizeSwitchContainer)[0];
		if(node){
			dojo.addClass(node, 'dojoxGridxPagerSizeSwitchBtnActive');
		}
		node = dojo.query('[pagesize="' + oldSize + '"]', this._sizeSwitchContainer)[0];
		if(node){
			dojo.removeClass(node, 'dojoxGridxPagerSizeSwitchBtnActive');
		}
		this._createPageStepper();
		this._createDescription();
		this.module.grid.layout.reLayout();
	},

	_findNodeByEvent: function(evt, targetClass, containerClass){
		var node = evt.target;
		while(!dojo.hasClass(node, targetClass)){
			if(dojo.hasClass(node, containerClass)){
				return null;
			}
			node = node.parentNode;
		}
		return node;
	},

	// Page Stepper Begin
	_createPageStepper: function(){
		var pageCount = this.pagination.pageCount(),
			currentPage = this.pagination.currentPage(),
			maxCount = this.module.maxVisiblePageCount,
			firstPage = Math.max(currentPage - Math.floor(maxCount / 2), 0),
			lastPage = firstPage + maxCount - 1,
			sb = [], i, tmp, dir = 1, 
			disableLast, disableFirst,
			mod = this.module, nls = mod._nls,
			nlsArr = [
				mod.pageIndexTitleTemplate || nls.pageIndexTitle,
				mod.pageIndexWaiTemplate || nls.pageIndexWai,
				mod.pageIndexTemplate || nls.pageIndex
			];

		if(!(maxCount > 0)){
			maxCount = this.module.maxVisiblePageCount = 5;
		}
		if(lastPage >= pageCount){
			firstPage = Math.max(firstPage - lastPage - 1 + pageCount, 0);
			lastPage = pageCount - 1;
		}
		if(!dojo._isBodyLtr()){
			tmp = firstPage;
			firstPage = lastPage;
			lastPage = tmp;
			dir = -1;
		}
		for(i = firstPage; i !== lastPage + dir; i += dir){
			sb.push('<span class="dojoxGridxPagerStepperBtn dojoxGridxPagerPage ',
				i === currentPage ? 'dojoxGridxPagerStepperBtnActive' : '',
				'" pageindex="', i,
				'" title="', strMaker(nlsArr[0], [i + 1]),
				'" aria-label="', strMaker(nlsArr[1], [i + 1]),
				'" tabindex="0">', strMaker(nlsArr[2], [i + 1]),
			'</span>');
		}
		this._pageBtnContainer.innerHTML = sb.join('');

		if(!currentPage || currentPage === pageCount - 1){
			disableFirst = !currentPage || pageCount <= 1;
			disableLast = currentPage || pageCount <= 1;
		}
		dojo[disableLast ? 'addClass' : 'removeClass'](this._lastPageBtn, 'dojoxGridxPagerLastPageDisable');
		dojo[disableLast ? 'addClass' : 'removeClass'](this._nextPageBtn, 'dojoxGridxPagerNextPageDisable');
		dojo[disableFirst ? 'addClass' : 'removeClass'](this._firstPageBtn, 'dojoxGridxPagerFirstPageDisable');
		dojo[disableFirst ? 'addClass' : 'removeClass'](this._prevPageBtn, 'dojoxGridxPagerPrevPageDisable');
	},

	_gotoFirstPage: function(){
		this.pagination.gotoPage(0);
	},

	_gotoPrevPage: function(){
		this.pagination.gotoPage(this.pagination.currentPage() -1);
	},

	_gotoNextPage: function(){
		this.pagination.gotoPage(this.pagination.currentPage() + 1);
	},

	_gotoLastPage: function(){
		this.pagination.gotoPage(this.pagination.pageCount() - 1);
	},

	_gotoPage: function(evt){
		var node = this._findNodeByEvent(evt, 'dojoxGridxPagerStepperBtn', 'dojoxGridxPagerPages');
		if(node){
			this.pagination.gotoPage(parseInt(dojo.attr(node, 'pageindex'), 10));
		}
	},

	_onHoverPageBtn: function(evt){
		var node = this._findNodeByEvent(evt, 'dojoxGridxPagerStepperBtn', 'dojoxGridxPagerPages');
		if(node){
			dojo.addClass(node, 'dojoxGridxPagerStepperBtnHover');
		}
	},

	_onLeavePageBtn: function(evt){
		var node = this._findNodeByEvent(evt, 'dojoxGridxPagerStepperBtn', 'dojoxGridxPagerPages');
		if(node){
			dojo.removeClass(node, 'dojoxGridxPagerStepperBtnHover');
		}
	},
	
	// Page Size Switch Begin
	_createPageSizeSwitch: function(){
		var sb = [], mod = this.module, nls = mod._nls,
			separator = mod.sizeSwitchSeparator,
			currentSize = this.pagination.pageSize(),
			nlsArr = [
				mod.pageSizeTitleTemplate || nls.pageSizeTitle,
				mod.pageSizeWaiTemplate || nls.pageSizeWai,
				mod.pageSizeTemplate || nls.pageSize,
				mod.pageSizeAllTitleText || nls.pageSizeAllTitle,
				mod.pageSizeAllWaiText || nls.pageSizeAllWai,
				mod.pageSizeAllText || nls.pageSizeAll
			];

		dojo.forEach(mod.pageSizes, function(pageSize){
			var isAll = false;
			//pageSize might be invalid inputs, so be strict here.
			if(!(pageSize > 0)){
				pageSize = 0;
				isAll = true;
			}
			sb.push('<span class="dojoxGridxPagerSizeSwitchBtn ',
				currentSize === pageSize ? 'dojoxGridxPagerSizeSwitchBtnActive' : '',
				'" pagesize="', pageSize,
				'" title="', isAll ? nlsArr[3] : strMaker(nlsArr[0], [pageSize]),
				'" aria-label="', isAll ? nlsArr[4] : strMaker(nlsArr[1], [pageSize]),
				'" tabindex="0">', isAll ? nlsArr[5] : strMaker(nlsArr[2], [pageSize]),
				'</span>',
				//Separate the "separator, so we can pop the last one.
				'<span class="dojoxGridxPagerSizeSwitchSeparator">' + separator + '</span>');
		});
		sb.pop();
		this._sizeSwitchContainer.innerHTML = sb.join('');
	},

	_switchPageSize: function(evt){
		var node = this._findNodeByEvent(evt, 'dojoxGridxPagerSizeSwitchBtn', 'dojoxGridxPagerSizeSwitch');
		if(node){
			this.pagination.setPageSize(parseInt(dojo.attr(node, 'pagesize'), 10));
		}
	},
	
	// Description Begin
	_createDescription: function(){
		var mod = this.module, nls = mod._nls, rowCount = mod.model.size();
		if(rowCount){
			var firstRow = this.pagination.firstIndexInPage(),
				lastRow = this.pagination.lastIndexInPage();
			this._descContainer.innerHTML = strMaker(mod.descriptionTemplate || nls.description, [firstRow + 1, lastRow + 1, rowCount]);
		}else{
			this._descContainer.innerHTML = mod.descriptionEmptyText || nls.descriptionEmpty;
		}
	},
	
	// Goto Button Begin
	_showGotoDialog: function(){
		var mod = this.module, nls = mod._nls;
		if(!this._gotoDialog){
			this._gotoDialog = new Dialog({
				title: nls.gotoDialogTitle,
				refNode: mod.grid.domNode,
				content: new demos.gridx.src.modules.GotoPagePane({
					pager: this
				})
			});
		}
		var pageCount = this.pagination.pageCount(),
			pane = this._gotoDialog.content;
		pane.pageCountMsgNode.innerHTML = strMaker(nls.gotoDialogPageCount, [pageCount]);
		pane.pageInputBox.constraints = {
			fractional: false, 
			min: 1, 
			max: pageCount
		};
		this._gotoDialog.show();
	}
});

return _Module.registerModule(
dojo.declare('demos.gridx.src.modules.PaginationBar', _Module, {
	// [Module Dependency Management] --------------------------------------------
	name: 'paginationBar',	

	required: ['pagination', 'layout'],
	
	// [Module API Management] ---------------------------------------------------
	getAPIPath: function(){
		return {
			paginationBar: this
		};
	},
	
	// [Module Lifetime Management] -----------------------------------------------
	load: function(args, startup){
		//Set arguments
		dojo.mixin(this, args);
		this.maxVisiblePageCount = this.maxVisiblePageCount || this.grid.maxVisiblePageCount || 5;
		this.pageSizes = this.pageSizes || this.grid.pageSizes || [5, 10, 25, 50, 0];
		this.sizeSwitchSeparator = this.sizeSwitchSeparator || this.grid.sizeSwitchSeparator || '|';

		//Register UI before startup
		this.grid.layout.register(this, '_pagerNode', 'footerNode', 5);

		//Initialize after startup and pagination API
		var _this = this;
		(new dojo.DeferredList([
			this.grid.pagination.loaded,
			startup
		])).then(function(){
			_this._init(args);
			_this.loaded.callback();
		});
	},

	_init: function(args){
		this._nls = dojo.i18n.getLocalization("demos.gridx.src", "PaginationBar");
		this._pager = new demos.gridx.src.modules.Pager({
			pagination: this.grid.pagination,
			module: this
		});
		this._pagerNode = this._pager.domNode;
	},
	
	destroy: function(){
		this.inherited(arguments);
		if(this._pager){
			delete this._pagerNode;
			this._pager.destroyRecursive();
		}
	},
	
	// [Public API] --------------------------------------------------------
/*=====
	maxVisiblePageCount: 5,

	pageSizes: [5, 10, 25, 50, 0],

	sizeSwitchSeparator: '|',

	// Configurable texts on the pagination bar:
	// Only set for this plugin, can not set for grid.
	pageIndexTitleTemplate: '',
	pageIndexWaiTemplate: '',
	pageIndexTemplate: '',
	pageSizeTitleTemplate: '',
	pageSizeWaiTemplate: '',
	pageSizeTemplate: '',
	pageSizeAllTitleText: '',
	pageSizeAllWaiText: '',
	pageSizeAllText: '',
	descriptionTemplate: '',
=====*/

	refresh: function(){
		var pager = this._pager;
		pager._createPageStepper();
		pager._createPageSizeSwitch();
		pager._createDescription();
		this.grid.layout.reLayout();
	},

	show: function(){
		dojo.style(this._pager.domNode, "display", "");
		this.grid.layout.reLayout();
	},

	hide: function(){
		dojo.style(this._pager.domNode, "display", "none");
		this.grid.layout.reLayout();
	}
}));	
});

