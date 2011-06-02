define([
'dojo',
'./VScroller',
'../core/_Module'
], function(dojo, VScroller, _Module){
	
return _Module.registerModule(
dojo.declare('demos.gridx.src.modules.VirtualVScroller', VScroller, {
	//Public ----------------------------------------------------
	buffSize: 5,
	
	lazyScroll: false,
	
	lazyScrollTimeout: 50,

	scrollToPercentage: function(percent){
	},

	scrollToRow: function(rowIndex){
	},

	//Protected -------------------------------------------------
	_init: function(args){
		this.lazyScroll = args.lazyScroll || this.grid.lazyScroll;
		this.lazyScrollTimeout = args.lazyScrollTimeout || this.grid.lazyScrollTimeout || this.lazyScrollTimeout;
		this._rowHeight = {};
		this._syncHeight();
		this._doScroll(null, true);
	},

	_doVirtualScroll: function(e, forced){
		var dn = this.domNode,
			t = dn.scrollTop,
			deltaT = this._ratio * (t - (this._lastScrollTop || 0));

		if(forced || deltaT){
			this._lastScrollTop = t;

			var scrollRange = dn.scrollHeight - dn.offsetHeight,
				body = this.grid.body,
				logicStart = body.logicalStart,
				logicEnd = logicStart + body.logicalCount,
				bn = this.grid.bodyNode,
				firstRow = bn.firstChild,
				firstRowTop = firstRow && firstRow.offsetTop - deltaT,
				lastRow = bn.lastChild,
				lastRowBtm = lastRow && lastRow.offsetTop - deltaT + lastRow.offsetHeight,
				bnTop = bn.scrollTop,
				bnBtm = bnTop + bn.clientHeight,
				h = this._avgRowHeight,
				pageRowCount = Math.ceil(dn.offsetHeight / h) + 2 * this.buffSize,
				start, end, pos;

			if(firstRow && firstRowTop > bnTop && firstRowTop < bnBtm){
				//Add some rows to the front
				end = body.start;
				start = t === 0 ? logicStart : Math.max(end - pageRowCount, logicStart);
				pos = "top";
//                console.log('top: ', start, end);
			}else if(lastRow && lastRowBtm > bnTop && lastRowBtm < bnBtm){
				//Add some rows to the end
				start = body.start + body.count;
				end = t === scrollRange ? logicEnd : Math.min(start + pageRowCount, logicEnd);
				pos = "bottom";
//                console.log('bottom: ', start, end);
			}else if(!firstRow || firstRowTop > bnBtm || !lastRow || lastRowBtm < bnTop){
				//Replace all
				if(t < scrollRange / 2){
					start = t === 0 ? logicStart : logicStart + Math.max(Math.floor(t / h) - this.buffSize, 0);
					end = Math.min(start + pageRowCount, logicEnd);
				}else{
					end = t === scrollRange ? logicEnd : logicEnd + Math.min(pageRowCount - Math.floor((scrollRange - t) / h), 0);
					start = Math.max(end - pageRowCount, logicStart);
				}
				pos = "clear";
			}else if(firstRow){
				//The body and the scroller bar may be mis-matched, so force to sync here.
				if(t === 0){
					var firstRowIndex = body.start;
					if(firstRowIndex > logicStart){
						start = logicStart;
						end = firstRowIndex;
						pos = "top";
//                        console.debug("Recover top", end - start);
					}	
				}else if(t === scrollRange){
					var lastRowIndex = body.start + body.count - 1;
					if(lastRowIndex < logicEnd - 1){
						start = lastRowIndex + 1;
						end = logicEnd;
						pos = "bottom";
//                        console.debug("Recover bottom", end - start);
					}
				}
			}

			if(start < end){
//                console.debug("render: ", start, end, pos, t, scrollRange);
				//Only need to render when the range is valid
				body.renderRows(start, end - start, pos);
				if(t && pos === 'top'){
					//Scroll the body to hide the newly added top rows.
					//Since it's 'top', the 'end' row node must exist!
					bn.scrollTop += dojo.query('[rowindex="' + end + '"]', bn)[0].offsetTop;
				}
			}			

			//Ensure the position when user scrolls to end points
			if(t === 0){
				bn.scrollTop = 0;
			}else if(t >= scrollRange){//Have to use >=, because with huge store, t will sometimes be > scrollRange
				bn.scrollTop = bn.scrollHeight;
			}else if(pos !== "clear"){
				bn.scrollTop += deltaT;
			}
		}
	},
	
	_doScroll: function(e, forced){
		if(this.lazyScroll){
			if(this._lazyScrollHandle){
				window.clearTimeout(this._lazyScrollHandle);
			}
			this._lazyScrollHandle = window.setTimeout(dojo.hitch(this, this._doVirtualScroll, e, forced), this.lazyScrollTimeout);
		}else{
			this._doVirtualScroll(e, forced);
		}
	},

	_onMouseWheel: function(e){
		var rolled = typeof e.wheelDelta === "number" ? e.wheelDelta / 3 : (-40 * e.detail); 
		this.domNode.scrollTop -= rolled / this._ratio;
	},

	_onBodyChange: function(start, count){
		if(count > 0){
			this._doScroll(null, true);
			this._doVirtual();
		}
	},

	_onBodyRangeChange: function(start, count){
		this.domNode.scrollTop = 0;
		this._syncHeight();
		this._doScroll(null, true);
	},

	//Private ---------------------------------------------------
	_avgRowHeight: 24,
	_rowHeight: null, 
	_ratio: 1,

	_syncHeight: function(){
		var h = this._avgRowHeight * this.grid.body.logicalCount;
		var maxHeight;
		if(dojo.isFF){
			maxHeight = 17895697;
		}else if(dojo.isWebkit){
			maxHeight = 134217726;
		}else{
			maxHeight = 1342177;
		}
		if(h > maxHeight){
			this._ratio = h / maxHeight;
			h = maxHeight;
		}
		dojo.style(this.stubNode, 'height', h + 'px');
	},

	_doVirtual: function(){
		if(this._pointerDoVirtual){
			window.clearTimeout(this._pointerDoVirtual);
			delete this._pointerDoVirtual;
		}
		var _this = this;
		this._pointerDoVirtual = window.setTimeout(function(){
			delete _this._pointerDoVirtual;
			_this._updateRowHeightAndUnrenderRows();
		}, 100);
	},

	_updateRowHeightAndUnrenderRows: function(){
		var preCount = 0, postCount = 0,
			body = this.grid.body, bn = this.grid.bodyNode,
			top = bn.scrollTop, bottom = bn.scrollTop + bn.clientHeight;

		dojo.forEach(bn.childNodes, function(node){
			this._rowHeight[dojo.attr(node, 'rowid')] = node.offsetHeight;
			if(node.offsetTop > bottom){
				++postCount;
			}else if(node.offsetTop + node.offsetHeight < top){
				++preCount;
			}
		}, this);
		body.unrenderRows(preCount);
		body.unrenderRows(postCount, 'post');

		var p, h = 0, c = 0;
		for(p in this._rowHeight){
			h += this._rowHeight[p];
			++c;
		}
		if(c){
			this._avgRowHeight = h / c;
			this._syncHeight();
		}
	}
}));
});

