require([
	"dojo/ready", 
	"dojo/on", 
	"dojo/dom", 
	"dojo/dom-geometry", 
	"dojo/mouse", 
	"dojo/_base/array", 
	"dojo/_base/event", 
	"dojox/gfx", 
	"dojox/gfx/matrix", 
	"dojox/gfx/utils", 
	"dojox/gfx/Moveable"], 
	function(ready, on, dom, domgeom, mouse, array, event, gfx, matrix, gutils, Moveable){

	var surface, surfacePos, _dragging, _size, _points, _ptMarker, _ctrl1, _ctrl2, _lastX, _lastY, _ghost;

	function _addPoint(p){
		if(_size > 1){
			_points[(++_size) - 1] = p;
			_points[(++_size) - 1] = p;
			_points[(++_size) - 1] = p;
		}else{
			_points[(++_size) - 1] = p; // start point
			_points[(++_size) - 1] = p; // start point
		}
	};
	function _react(p){
		if(_size > 3){
			// Updates the position of the control point.
			var prevp = _size - 3; // previous left handle
			var pivot = _size - 2; // previous end point
			_points[prevp] = _symmetric(_points[pivot], p);
		}
	};
	function toPos(e){
		return{
			x: e.pageX - surfacePos.x,
			y: e.pageY - surfacePos.y
		}
	};
	function onMouseDown(e){
		if(mouse.isLeft(e) && (_lastX !== e.clientX || _lastY !== e.clientY)){
			_dragging = true;
			_lastX = e.clientX;
			_lastY = e.clientY;
			if(!_points){
				_points = [];
				_size = 0;
			}
			var p = toPos(e);
			// Add the new point
			_addPoint(p);
			// ... and compute the control points
			_react(p);
			// update ghost
			_points[_size - 1] = p;
			addNewCurve();
			updateMarkerPos(p);
			event.stop(e);
		}
	};
	function onMouseMove(e){
		if(_size > 0 && _dragging){
			var p = toPos(e);
			if(_size == 1){
				// If user is dragging the starting point, add the second point.
				_addPoint(p);
				// and compute the control points
				_react(p);
			}else{
				// computes the control points position
				_react(p);
				_points[_size - 1] = p;
			}
			// update ghost
			updateCurveGhostPoints();
			event.stop(e);
		}
	};
	function onMouseUp(e){
		_dragging = false;
	};
	function onDoubleClick(e){
		if(_points != null){
			// Commit the action.
			commit(true);
			reset();
			event.stop(e);
		}
	};
	function _symmetric(pivot, p){
		return{
			"x": pivot.x - (p.x - pivot.x),
			"y": pivot.y - (p.y - pivot.y)
		};
	};
	
	function reset(){
		_points = null;
		_size = 0;
		_dragging = false;
		_clearGhosts();
		_curveCount = 0;
	};
	function _clearGhosts(){
		_ctrl1.removeShape();
		_ctrl2.removeShape();
		_ptMarker.removeShape();
		_ctrlLine.removeShape();
	};
	function commit(slice){
		_ghost.setStroke({width:2, color: "black"});
		// remove last point added by dbl click
		if(slice){
			var val = _ghost.getShape().path;
			val = val.slice(0, val.lastIndexOf("C"));
			_ghost.setShape(val);
		}
		createGhost();
	};
	function createGhost(){
		_ghost = surface.createPath().setStroke({width: 2, color: "red"});
	};
	function initSurface(){
		surfacePos = domgeom.position(surface.rawNode, true);
		
		on(dom.byId("surface"), "mousedown", onMouseDown);
		on(dom.byId("surface"), "mousemove", onMouseMove);
		on(dom.byId("surface"), "mouseup", onMouseUp);
		on(dom.byId("surface"), "dblclick", onDoubleClick);
		_ptMarker = surface.createCircle({
			r: 3
		}).setFill("black").removeShape();
		_ctrl1 = createControlPt().removeShape();
		_ctrl2 = createControlPt().removeShape();
		_ctrlLine = surface.createLine().setStroke({
			style: "dash",
			color: "black"
		}).removeShape();
		createGhost();
	};
	function createControlPt(){
		var ctrl = surface.createRect({
			width: 11,
			height: 11
		}).setStroke({
			width: 1,
			color: "black"
		});
		return ctrl;
	};
	function updateMarkerPos(p){
		surface.add(_ptMarker);
		_ptMarker.setShape({
			cx: p.x,
			cy: p.y
		});
	};
	function updateCurveGhostPoints(){
		var p;
		if(_curveCount > 0){
			var val, curveElt = _ghost.segments[2 * _curveCount - 1],
				i = (_curveCount - 1) * 3,
				x1 = _points[i].x,
				y1 = _points[i].y,
				x2 = _points[i + 3].x,
				y2 = _points[i + 3].y,
				c1x = _points[i + 1].x,
				c1y = _points[i + 1].y,
				c2x = _points[i + 2].x,
				c2y = _points[i + 2].y,
				cPt = {'x': c2x, 'y': c2y},
				to = {'x': x2, 'y': y2},
				s = ['C'];
			s.push(c1x);
			s.push(',');
			s.push(c1y);
			s.push(' ');
			s.push(c2x);
			s.push(',');
			s.push(c2y);
			s.push(' ');
			s.push(x2);
			s.push(',');
			s.push(y2);
			// remove the current curve (the last one in the path def)
			val = _ghost.getShape().path;
			// and add the updated curve
			val = val.slice(0, val.lastIndexOf("C")) + s.join("");
			_ghost.setShape(val);
			// ensure they are visible
			checkParented(_ctrl1, _ctrl2, _ctrlLine);
			// update control points markers
			p = _symmetric(to, cPt);
			x1 = cPt.x - 6;
			y1 = cPt.y - 6;
			x2 = p.x - 6;
			y2 = p.y - 6;
			_ctrl2.setShape({
				x: x1,
				y: y1
			});
			_ctrl1.setShape({
				x: x2,
				y: y2
			});
			_ctrlLine.setShape({
				x1: x1 + 5,
				y1: y1 + 5,
				x2: x2 + 5,
				y2: y2 + 5
			})
		} else if (_size > 1) {
			checkParented(_ctrl1, _ctrl2, _ctrlLine);
			p = {
				x: _points[1].x,
				y: _points[1].y
			};
			var p2 = _symmetric(_points[0], p);
			p.x -= 6;
			p.y -= 6;
			p2.x -= 6;
			p2.y -= 6;
			_ctrl1.setShape(p);
			_ctrl2.setShape(p2);
			_ctrlLine.setShape({
				x1: p.x + 5,
				y1: p.y + 5,
				x2: p2.x + 5,
				y2: p2.y + 5
			})
		}
	};	
	function checkParented(){
		array.forEach(arguments, function(s){
			if(!s.getParent()){
				surface.add(s);
			}});
	};	
	function addNewCurve(){
		if (_size > 4) {
			var i = _size - 4 - 1;
			var x1 = _points[i].x;
			var y1 = _points[i].y;
			var x2 = _points[i + 3].x;
			var y2 = _points[i + 3].y;
			var c1x = _points[i + 1].x;
			var c1y = _points[i + 1].y;
			var c2x = _points[i + 2].x;
			var c2y = _points[i + 2].y;
			if (_curveCount++ === 0) {
				_ghost.moveTo(x1, y1);
			}
			_ghost.curveTo(c1x, c1y, c2x, c2y, x2, y2);
		}
	};
	
	ready(function(){
		var box = domgeom.getContentBox(dom.byId("surface"));
		surface = gfx.createSurface("surface", box.w, box.h);
		initSurface();
		reset();
		
		on(dom.byId("clear"), "click", function(){
			surface.clear();
			reset();
			createGhost();
		});
	});
});
