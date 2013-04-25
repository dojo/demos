/*--------------------------------------------------------
 * Copyright © 2009 – 2010* France Telecom
 * This software is distributed under the "Simplified BSD license",
 * the text of which is available at http://www.winktoolkit.org/licence.txt
 * or see the "license.txt" file for more details.
 *--------------------------------------------------------*/

/**
 * Implements a Movement Tracker. The Movement Tracker follows the touch movement performed on a node.
 * It listens to touch events and elaborates a movement which consists of points statements sequence.
 * Each point statement includes these informations : a position, a direction, a distance and a duration.
 *
 * @properties:
 * 	data =
 * 	{
 * 		target: 	 	the target DOM node which must be tracked
 * 		captureFlow:	indicates whether the capture event flow is used
 * 	}
 *
 * @attributes:
 *  --> uId: unique identifier of the component
 *
 * @events
 * 	--> /movementtracker/events/mvtbegin: the movement begins { publisher, movement, uxEvent, target }
 * 	--> /movementtracker/events/mvtchanged: the movement changes { publisher, movement, uxEvent, target }
 * 	--> /movementtracker/events/mvtstored: the movement stops { publisher, movement, uxEvent, target }
 *
 * @compatibility
 *  --> Iphone OS2, Iphone OS3, Android 1.5, Android 2.1
 *
 * @author:
 * 	--> Sylvain LALANDE
 */
wink.ux.MovementTracker = function(properties) {
	this.uId			= wink.getUId();
	this._properties 	= properties;
	
	this._target 		= null;
	this._captureFlow 	= true;
	
	this._DIRECTION_CHANGE_THRESHOLD 	= 0; // pixel

	this.EVENTS_REGISTERED = {
		MOVEMENT_BEGIN: 	'/movementtracker/events/mvtbegin',
		MOVEMENT_CHANGED: 	'/movementtracker/events/mvtchanged',
		MOVEMENT_STORED: 	'/movementtracker/events/mvtstored'
	};
	
	this._pointStatement			= null;
	this._previousPointStatement	= null;
	this._acceptEvents				= true;
	this._multitouch				= false;
	
	if (this._validateProperties() === false) return;
	
	this._initProperties();
	this._initListeners();
};

wink.ux.MovementTracker.prototype = {
	/**
	 * Check if the properties are correct
	 */
	_validateProperties : function()
	{
		if (wink.isUndefined(this._properties.target)) {
			wink.log('[MovementTracker] Error: target property must be specified');
			return false;
		}
		if (wink.isUndefined($(this._properties.target))) {
			wink.log('[MovementTracker] Error: target property must refer to a valid DOM Node');
			return false;
		}
		return true;
	},
	/**
	 * Initialize datas with given properties
	 */
	_initProperties : function()
	{
		this._target = $(this._properties.target);
		if (this._properties.captureFlow === false) {
			this._captureFlow = false;
		}
	},
	/**
	 * Initialize listeners
	 */
	_initListeners : function()
	{
		wink.ux.touch.addListener(this._target, "start", { context: this, method: "_handleTouchStart" }, true, true, this._captureFlow);
		wink.ux.touch.addListener(this._target, "move", { context: this, method: "_handleTouchMove" });
		wink.ux.touch.addListener(this._target, "end", { context: this, method: "_handleTouchEnd" });
	},
	/**
	 * Handle touch start
	 *
	 * @parameters:
	 * 	--> uxEvent: the wink.ux.Event associated
	 */
	_handleTouchStart: function(uxEvent)
	{
		if (this._acceptEvents == false) {
			return;
		}
		this._multitouch = false;
		if (uxEvent.multitouch == true)
		{
			this._multitouch = true;
			return;
		}
		this._pointStatement = [];
		this._previousPointStatement = null;
		this._addTouch(uxEvent);

		this._acceptEvents = false;
		var movement = this._getCurrentMovement();
		wink.publish(this.EVENTS_REGISTERED.MOVEMENT_BEGIN, {
			publisher: this,
			movement : movement,
			uxEvent : uxEvent,
			target: this._target
		});
		this._acceptEvents = true;
	},
	/**
	 * Handle touch move
	 *
	 * @parameters:
	 * 	--> uxEvent: the wink.ux.Event associated
	 */
	_handleTouchMove: function(uxEvent)
	{
		if (this._acceptEvents == false) {
			return;
		}
		if (this._multitouch)
		{
			return;
		}
		this._addTouch(uxEvent);

		this._acceptEvents = false;
		var movement = this._getCurrentMovement();
		wink.publish(this.EVENTS_REGISTERED.MOVEMENT_CHANGED, {
			publisher: this,
			movement : movement,
			uxEvent : uxEvent,
			target: this._target
		});
		this._acceptEvents = true;
	},
	/**
	 * Handle touch end
	 *
	 * @parameters:
	 * 	--> uxEvent: the wink.ux.Event associated
	 */
	_handleTouchEnd: function(uxEvent)
	{
		if (this._acceptEvents == false) {
			return;
		}
		if (this._multitouch)
		{
			return;
		}
		this._addTouch(uxEvent);

		this._acceptEvents = false;
		var movement = this._getCurrentMovement();
		wink.publish(this.EVENTS_REGISTERED.MOVEMENT_STORED, {
			publisher: this,
			movement : movement,
			uxEvent : uxEvent,
			target: this._target
		});
		this._acceptEvents = true;
	},
	/**
	 * Add a point statement to the movement
	 *
	 * @parameters:
	 * 	--> uxEvent: the wink.ux.Event associated to the touch
	 */
	_addTouch : function(uxEvent)
	{
		var pointStatement = {
			x: uxEvent.x,
			y: uxEvent.y,
			timestamp : uxEvent.timestamp
		};

		var previousX = 0;
		var previousY = 0;
		var previousDx = 0;
		var previousDy = 0;
		var previousDirectionX = 0;
		var previousDirectionY = 0;

		if (this._previousPointStatement == null) {
			// duration
			pointStatement.duration = 0;
			pointStatement.globalDuration = 0;
			previousX = pointStatement.x;
			previousY = pointStatement.y;
		} else {
			previousX = this._previousPointStatement.x;
			previousY = this._previousPointStatement.y;
			previousDx = this._previousPointStatement.globalDx;
			previousDy = this._previousPointStatement.globalDy;
			previousDirectionX = this._previousPointStatement.directionX;
			previousDirectionY = this._previousPointStatement.directionY;
		
			// duration
			pointStatement.duration = (pointStatement.timestamp - this._previousPointStatement.timestamp);
			pointStatement.globalDuration = pointStatement.duration + this._previousPointStatement.globalDuration;
		}
	
		// distance
		pointStatement.dx = Math.abs(pointStatement.x - previousX);
		pointStatement.dy = Math.abs(pointStatement.y - previousY);
		pointStatement.globalDx = pointStatement.dx + previousDx;
		pointStatement.globalDy = pointStatement.dy + previousDy;
	
		// direction
		pointStatement.directionX = previousDirectionX;
		pointStatement.directionY = previousDirectionY;
	
		if (previousDirectionX == 0 && this._previousPointStatement != null) {
			if (pointStatement.x < previousX) {
				pointStatement.directionX = -1;
			} else if (pointStatement.x > previousX) {
				pointStatement.directionX = 1;
			}
			this._previousPointStatement.directionX = pointStatement.directionX;
		}
		if (previousDirectionY == 0 && this._previousPointStatement != null) {
			if (pointStatement.y < previousY) {
				pointStatement.directionY = -1;
			} else if (pointStatement.y > previousY) {
				pointStatement.directionY = 1;
			}
			this._previousPointStatement.directionY = pointStatement.directionY;
		}
	
		if (previousDirectionX > 0 && (pointStatement.x + this._DIRECTION_CHANGE_THRESHOLD) < previousX) {
			pointStatement.directionX = -1;
		} else if (previousDirectionX < 0 && (pointStatement.x - this._DIRECTION_CHANGE_THRESHOLD) > previousX) {
			pointStatement.directionX = 1;
		}
		if (previousDirectionY > 0 && (pointStatement.y + this._DIRECTION_CHANGE_THRESHOLD) < previousY) {
			pointStatement.directionY = -1;
		} else if (previousDirectionY < 0 && (pointStatement.y - this._DIRECTION_CHANGE_THRESHOLD) > previousY) {
			pointStatement.directionY = 1;
		}
	
		this._pointStatement.push(pointStatement);
		this._previousPointStatement = pointStatement;
	},
	/**
	 * Build the current movement
	 */
	_getCurrentMovement : function()
	{
		var lastPoint = this._pointStatement[(this._pointStatement.length - 1)];
		var movement = {
			pointStatement : this._pointStatement,
			duration : lastPoint.globalDuration,
			dx : lastPoint.globalDx,
			dy : lastPoint.globalDy
		};
		return movement;
	}
};
