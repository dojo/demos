require([
	"dojo/ready",
	"dojo/dom",
	"dojo/dom-geometry",
	"dojo/date/locale",
	"dojo/_base/event",
	"dojo/on",
	"dojox/gfx"
	],
	function(ready, dom, domgeom, locale, event, on, gfx){
		
	var current_time = new Date(),
		hour_hand = null,
		minute_hand = null,
		second_hand = null,
		hour_shadow   = null,
		minute_shadow = null,
		second_shadow = null,
		center = {x: 385 / 2, y: 385 / 2},
		hour_shadow_shift   = {dx: 2, dy: 2},
		minute_shadow_shift = {dx: 3, dy: 3},
		second_shadow_shift = {dx: 4, dy: 4},
		selected_hand = null,
		container = null,
		container_position = null,
		text_time = null,
		diff_time = new Date();

	var placeHand = function(shape, angle, shift){
		var move = {dx: center.x + (shift ? shift.dx : 0), dy: center.y + (shift ? shift.dy : 0)};
		return shape.setTransform([move, gfx.matrix.rotateg(angle)]);
	};

	var placeHourHand = function(h, m, s){
		var angle = 30 * (h % 12 + m / 60 + s / 3600);
		placeHand(hour_hand, angle);
		placeHand(hour_shadow, angle, hour_shadow_shift);
	};

	var placeMinuteHand = function(m, s){
		var angle = 6 * (m + s / 60);
		placeHand(minute_hand, angle);
		placeHand(minute_shadow, angle, minute_shadow_shift);
	};

	var placeSecondHand = function(s){
		var angle = 6 * s;
		placeHand(second_hand, angle);
		placeHand(second_shadow, angle, second_shadow_shift);
	};

	var reflectTime = function(time, hold_second_hand, hold_minute_hand, hold_hour_hand){
		if(!time) time = current_time;
		var h = time.getHours();
		var m = time.getMinutes();
		var s = time.getSeconds();
		if(!hold_hour_hand) placeHourHand(h, m, s);
		if(!hold_minute_hand) placeMinuteHand(m, s);
		if(!hold_second_hand) placeSecondHand(s);
		text_time.innerHTML = locale.format(time, {selector: "time", timePattern: "h:mm:ss a"});
	};

	var resetTime = function(){
		current_time = new Date();
		reflectTime();
	};

	var tick = function(){
		current_time.setSeconds(current_time.getSeconds() + 1);
		reflectTime();
	};

	var advanceTime = function(){
		if(!selected_hand){
			tick();
		}
	};

	var normalizeAngle = function(angle){
		if(angle > Math.PI){
			angle -= 2 * Math.PI;
		}else if(angle < -Math.PI){
			angle += 2 * Math.PI;
		}
		return angle;
	};

	var calculateAngle = function(x, y, handAngle){
		try{
			return normalizeAngle(Math.atan2(y - center.y, x - center.x) - handAngle);
		}catch(e){
			// supress
		}
		return 0;
	};

	var getSecondAngle = function(time){
		if(!time) time = current_time;
		return (6 * time.getSeconds() - 90) / 180 * Math.PI;
	};

	var getMinuteAngle = function(time){
		if(!time) time = current_time;
		return (6 * (time.getMinutes() + time.getSeconds() / 60) - 90) / 180 * Math.PI;
	};

	var getHourAngle = function(time){
		if(!time) time = current_time;
		return (30 * (time.getHours() + (time.getMinutes() + time.getSeconds() / 60) / 60) - 90) / 180 * Math.PI;
	};

	var onMouseDown = function(evt){
		selected_hand = evt.target;
		diff_time.setTime(current_time.getTime());
		event.stop(evt);
	};

	var onMouseMove = function(evt){
		var angle, diff;
		if(!selected_hand) return;
		if(evt.target == second_hand.getEventSource() || 
			evt.target == minute_hand.getEventSource() || 
			evt.target == hour_hand.getEventSource()){
			event.stop(evt);
			return;
		}
		if(gfx.equalSources(selected_hand, second_hand.getEventSource())){
			angle = calculateAngle(
				evt.clientX - container_position.x, 
				evt.clientY - container_position.y, 
				normalizeAngle(getSecondAngle())
			);
			diff = Math.round(angle / Math.PI * 180 / 6); // in whole seconds
			current_time.setSeconds(current_time.getSeconds() + Math.round(diff));
			reflectTime();
		}else if(gfx.equalSources(selected_hand, minute_hand.getEventSource())){
			angle = calculateAngle(
				evt.clientX - container_position.x, 
				evt.clientY - container_position.y, 
				normalizeAngle(getMinuteAngle(diff_time))
			);
			diff = Math.round(angle / Math.PI * 180 / 6 * 60); // in whole seconds
			diff_time.setTime(diff_time.getTime() + 1000 * diff);
			reflectTime(diff_time, true);
			
		}else if(gfx.equalSources(selected_hand, hour_hand.getEventSource())){
			angle = calculateAngle(
				evt.clientX - container_position.x, 
				evt.clientY - container_position.y, 
				normalizeAngle(getHourAngle(diff_time))
			);
			diff = Math.round(angle / Math.PI * 180 / 30 * 60 * 60); // in whole seconds
			diff_time.setTime(diff_time.getTime() + 1000 * diff);
			reflectTime(diff_time, true, true);
		}else{
			return;
		}
		event.stop(evt);
	};

	var onMouseUp = function(evt){
		if(selected_hand && !gfx.equalSources(selected_hand, second_hand.getEventSource())){
			current_time.setTime(diff_time.getTime());
			reflectTime();
		}
		selected_hand = null;
		event.stop(evt);
	};

	var makeShapes = function(){
		// prerequisites
		container = dom.byId("gfx_holder");
		container_position = domgeom.position(container, true);
		text_time = dom.byId("time");
		var surface = gfx.createSurface(container, 385, 385);
	    surface.createImage({width: 385, height: 385, src: "resources/clock_face.jpg"});
	    
	    // hand shapes
	    var hour_hand_points = [{x: -7, y: 15}, {x: 7, y: 15}, {x: 0, y: -60}, {x: -7, y: 15}];
	    var minute_hand_points = [{x: -5, y: 15}, {x: 5, y: 15}, {x: 0, y: -100}, {x: -5, y: 15}];
	    var second_hand_points = [{x: -2, y: 15}, {x: 2, y: 15}, {x: 2, y: -105}, {x: 6, y: -105}, {x: 0, y: -116}, {x: -6, y: -105}, {x: -2, y: -105}, {x: -2, y: 15}];
	    
	    // create shapes
	    hour_shadow = surface.createPolyline(hour_hand_points)
			.setFill([0, 0, 0, 0.1])
			;
	    hour_hand = surface.createPolyline(hour_hand_points)
			.setStroke({color: "black", width: 2})
			.setFill("#889")
			;
	    minute_shadow = surface.createPolyline(minute_hand_points)
			.setFill([0, 0, 0, 0.1])
			;
	    minute_hand = surface.createPolyline(minute_hand_points)
			.setStroke({color: "black", width: 2})
			.setFill("#ccd")
			;
	    second_shadow = surface.createPolyline(second_hand_points)
			.setFill([0, 0, 0, 0.1])
			;
	    second_hand = surface.createPolyline(second_hand_points)
			.setStroke({color: "#800", width: 1})
			.setFill("#d00")
			;
		surface.createCircle({r: 1}).setFill("black").setTransform({dx: 192.5, dy: 192.5});
		
		// attach events
		hour_hand  .connect("onmousedown", onMouseDown);
		minute_hand.connect("onmousedown", onMouseDown);
		second_hand.connect("onmousedown", onMouseDown);
		on(container, "mousemove", onMouseMove);
		on(container, "mouseup",   onMouseUp);
		on(dom.byId("reset"), "click", resetTime);
	
		// start the clock		
		resetTime();
		window.setInterval(advanceTime, 1000);
	};

	ready(makeShapes);		
	}
);
