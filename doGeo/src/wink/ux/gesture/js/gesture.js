/*--------------------------------------------------------
 * Copyright © 2009 – 2010* France Telecom
 * This software is distributed under the "Simplified BSD license",
 * the text of which is available at http://www.winktoolkit.org/licence.txt
 * or see the "license.txt" file for more details.
 *--------------------------------------------------------*/

/**
 * Implements a Gesture management system.
 * Determines whether some gestures (with exactly 2 fingers) are performed on the nodes and if so,
 * inform the listeners. Gestures that can be listened are referenced in the "_knownGestures" attribute below.
 * The notifications to the listeners include parameters that depends on gesture type.
 *
 * @methods:
 * 	--> listenTo: Allows to listen for a specific gesture on a dom Node.
 *  --> unlistenTo: Allows to unlisten for a specific gesture on a dom Node.
 *
 * @compatibility
 *  --> Iphone OS2, Iphone OS3
 *
 * @author:
 * 	--> Sylvain LALANDE
 */
wink.ux.gesture =
{
	_gestureElements				: [],
	_knownGestures					: [
		"two_digits_click", 	// { digit1, digit2 }
		"two_digits_press", 	// { digit1, digit2 }
		"enlargement",			// { digit1, digit2, scale }
		"narrowing",			// { digit1, digit2, scale }
		"rotation",				// { digit1, digit2, rotation }
		"instant_scale",		// { digit1, digit2, scale }
		"instant_rotation",		// { digit1, digit2, rotation }
		"gesture_end"			// { gestureDuration }
	],
	
	TWO_DIGITS_CLICK_MAX_DURATION	: 350,		// ms
	TWO_DIGITS_PRESS_MIN_DURATION	: 400,		// ms
	SCALE_MIN_VALUE					: 0.2,		// ratio
	ROTATION_MIN_VALUE				: 5, 		// degree
	
	/**
	 * Allows to listen for a specific gesture on a dom Node.
	 *
	 * @parameters:
	 * 	--> domNode: the dom node that listen
	 * 	--> gesture: the gesture name to listen
	 *  --> callback: the callback to invoke when this gesture is done
	 *  --> preventDefault: a boolean value that indicated if an automatic preventDefault must be done
	 */
	listenTo: function(domNode, gesture, callback, preventDefault)
	{
		if (!this._isGestureKnown(gesture))
		{
			wink.log('[gesture] Cannot listen to this unknown gesture: ' + gesture);
			return false;
		}
		if (!wink.isCallback(callback))
		{
			wink.log('[gesture] Invalid callback: ' + callback);
			return false;
		}
		var gestureElement = null;
		var index = this._getGestureElementIndex(domNode);
		if (index == null)
		{
			gestureElement = this._createGestureElement(domNode, preventDefault);
			this._gestureElements.push(gestureElement);
			
			wink.ux.touch.addListener(gestureElement.domNode, "start", { context: this, method: "_handleStart", arguments: [ gestureElement ] }, gestureElement.preventDefault, false);
			wink.ux.touch.addListener(gestureElement.domNode, "gesturestart", { context: this, method: "_handleGestureStart", arguments: [ gestureElement ] }, gestureElement.preventDefault);
		}
		else
		{
			gestureElement = this._gestureElements[index];
		}
		gestureElement.addCallback(gesture, callback);
	},
	/**
	 * Allows to unlisten for a specific gesture on a dom Node.
	 *
	 * @parameters:
	 * 	--> domNode: the dom node that unlisten
	 * 	--> gesture: the gesture name to unlisten
	 *  --> callback: the callback to invoke when this gesture is done
	 */
	unlistenTo: function(domNode, gesture, callback)
	{
		if (!this._isGestureKnown(gesture))
		{
			wink.log('[gesture] Cannot listen to this unknown gesture: ' + gesture);
			return false;
		}
		if (!wink.isCallback(callback))
		{
			wink.log('[gesture] Invalid callback: ' + callback);
			return false;
		}
		var gestureElement = null;
		var index = this._getGestureElementIndex(domNode);
		if (index == null)
		{
			return;
		}
		gestureElement = this._gestureElements[index];
		gestureElement.removeCallback(gesture, callback);
	},
	/**
	 * @parameters:
	 * 	--> domNode: the gesture element dom node
	 *  --> preventDefault: a boolean value that indicated if an automatic preventDefault must be done
	 */
	_createGestureElement: function(domNode, preventDefault)
	{
		var gestureElement = {
			uId: wink.getUId(),
			domNode: domNode,
			preventDefault: preventDefault,
			digits: [],
			multitouch: false,
			multitouchStartTime: null,
			multitouchEndTime: null,
			scale: 1.0,
			rotation: 0,
			gestureHandlers: [], // gesture, callbacks
			getGestureHandler: function(gesture)
			{
				for (var i = 0; i < this.gestureHandlers.length; i++)
				{
					if (this.gestureHandlers[i].gesture == gesture)
					{
						return this.gestureHandlers[i];
					}
				}
				return null;
			},
			isListening: function(gesture)
			{
				var gestureHandler = this.getGestureHandler(gesture);
				return (gestureHandler != null);
			},
			addCallback: function(gesture, callback)
			{
				if (this.isListening(gesture))
				{
					this.getGestureHandler(gesture).callbacks.push(callback);
				}
				else
				{
					this.gestureHandlers.push({ gesture: gesture, callbacks: [ callback ] });
				}
			},
			removeCallback: function(gesture, callback)
			{
				if (this.isListening(gesture))
				{
					for (var i = 0; i < this.getGestureHandler(gesture).callbacks.length; i++) {
						var callbackI = this.getGestureHandler(gesture).callbacks[i];
						if (callbackI.context == callback.context && callbackI.method == callback.method)
						{
							if (this.getGestureHandler(gesture).callbacks.length == 1)
							{
								for (var j = 0; j < this.gestureHandlers.length; j++)
								{
									if (this.gestureHandlers[j].gesture == gesture)
									{
										this.gestureHandlers.splice(j, 1);
										break;
									}
								}
							}
							else
							{
								this.getGestureHandler(gesture).callbacks.splice(i, 1);
							}
							break;
						}
					}
				}
			},
			reset: function()
			{
				this.digits = [];
				this.multitouch = false;
				this.multitouchStartTime = null;
				this.multitouchEndTime = null;
				this.scale = 1.0;
				this.rotation = 0;
			}
		};
		return gestureElement;
	},
	/**
	 * @parameters:
	 * 	--> gesture: the gesture name to check
	 */
	_isGestureKnown: function(gesture)
	{
		return (this._knownGestures.indexOf(gesture) != -1);
	},
	/**
	 * @parameters:
	 * 	--> domNode: the DOM node
	 */
	_getGestureElementIndex: function(domNode)
	{
		for (var i = 0; i < this._gestureElements.length; i++)
		{
			var gestureElementI = this._gestureElements[i];
			if (gestureElementI.domNode == domNode)
			{
				return i;
			}
		}
		return null;
	},
	/**
	 * Invoke callbacks that are concerned by the gesture on the given element.
	 *
	 * @parameters:
	 *  --> gesture: the gesture name
	 * 	--> gestureElement: the gesture element
	 */
	_notifyGesture: function(gesture, gestureElement, gestureInfos)
	{
		if (!gestureElement.isListening(gesture))
		{
			return;
		}
		
		var callbacks = gestureElement.getGestureHandler(gesture).callbacks;
		for (var j = 0; j < callbacks.length; j++)
		{
			var callbackJ = callbacks[j];
			
			var arguments = callbackJ.arguments;
			var args = [ gestureInfos ];
			
			if (wink.isset(arguments) && arguments.length > 0)
			{
				args = args.concat(arguments);
			}
			
			wink.call(callbackJ, args);
		}
	},
	/**
	 * Handle touch start
	 *
	 * @parameters:
	 * 	--> uxEvent: the wink.ux.Event associated
	 * 	--> gestureElement: the GestureElement associated
	 */
	_handleStart: function(uxEvent, gestureElement)
	{
		gestureElement.reset();
		if (gestureElement.checkTimer)
		{
			clearTimeout(gestureElement.checkTimer);
		}
		
		var nbTouches = 0;
		if (wink.isset(uxEvent.srcEvent.targetTouches))
		{
			nbTouches = uxEvent.srcEvent.targetTouches.length;
		}
		
		if (nbTouches == 2)
		{
			gestureElement.multitouch = true;
			gestureElement.multitouchStartTime = this._getTimeStamp();
			
			gestureElement.digits.push(this._getDigit(uxEvent.srcEvent.targetTouches[0], uxEvent));
			gestureElement.digits.push(this._getDigit(uxEvent.srcEvent.targetTouches[1], uxEvent));
			
			wink.ux.touch.addListener(gestureElement.domNode, "move", { context: this, method: "_handleMove", arguments: [ gestureElement ] }, gestureElement.preventDefault);
			wink.ux.touch.addListener(gestureElement.domNode, "end", { context: this, method: "_handleEnd", arguments: [ gestureElement ] });
			
			gestureElement.checkTimer = wink.setTimeout(this, "_checkTwoDigitsPressed", this.TWO_DIGITS_PRESS_MIN_DURATION, gestureElement);
		}
		else
		{
			gestureElement.multitouch = false;
			wink.ux.touch.removeListener(gestureElement.domNode, "move", { context: this, method: "_handleMove", arguments: [ gestureElement ] }, gestureElement.preventDefault);
			wink.ux.touch.removeListener(gestureElement.domNode, "end", { context: this, method: "_handleEnd", arguments: [ gestureElement ] });
		}
	},
	/**
	 * Handle touch move
	 *
	 * @parameters:
	 * 	--> uxEvent: the wink.ux.Event associated
	 * 	--> gestureElement: the GestureElement associated
	 */
	_handleMove: function(uxEvent, gestureElement)
	{
		var nbTouches = 0;
		if (wink.isset(uxEvent.srcEvent.targetTouches))
		{
			nbTouches = uxEvent.srcEvent.targetTouches.length;
		}
		
		if (nbTouches == 2)
		{
			gestureElement.digits = [];
			gestureElement.digits.push(this._getDigit(uxEvent.srcEvent.targetTouches[0], uxEvent));
			gestureElement.digits.push(this._getDigit(uxEvent.srcEvent.targetTouches[1], uxEvent));
		}
	},
	/**
	 * Handle touch end
	 *
	 * @parameters:
	 * 	--> uxEvent: the wink.ux.Event associated
	 * 	--> gestureElement: the GestureElement associated
	 */
	_handleEnd: function(uxEvent, gestureElement)
	{
		if (gestureElement.multitouch == true)
		{
			var nbTouches = 0;
			if (wink.isset(uxEvent.srcEvent.targetTouches))
			{
				nbTouches = uxEvent.srcEvent.targetTouches.length;
			}
			if (nbTouches != 2)
			{
				gestureElement.multitouch = false;
			}
			
			if (nbTouches == 0)
			{
				wink.ux.touch.removeListener(gestureElement.domNode, "move", { context: this, method: "_handleMove" });
				wink.ux.touch.removeListener(gestureElement.domNode, "end", { context: this, method: "_handleEnd" });
				
				gestureElement.multitouchEndTime = this._getTimeStamp();
				var multitouchDuration = gestureElement.multitouchEndTime - gestureElement.multitouchStartTime;
				
				if (multitouchDuration < this.TWO_DIGITS_CLICK_MAX_DURATION)
				{
					var gestureInfos = {
						digit1: gestureElement.digits[0],
						digit2: gestureElement.digits[1]
					};
					this._notifyGesture("two_digits_click", gestureElement, gestureInfos);
				}
			}
		}
	},
	/**
	 * Check if two digits are pressed on the given gesture element.
	 *
	 * @parameters:
	 * 	--> gestureElement: the GestureElement associated
	 */
	_checkTwoDigitsPressed: function(gestureElement)
	{
		if (gestureElement.multitouch == true)
		{
			var gestureInfos = {
				digit1: gestureElement.digits[0],
				digit2: gestureElement.digits[1]
			};
			this._notifyGesture("two_digits_press", gestureElement, gestureInfos);
		}
	},
	/**
	 * Handle gesture start
	 *
	 * @parameters:
	 * 	--> uxEvent: the wink.ux.Event associated
	 * 	--> gestureElement: the GestureElement associated
	 */
	_handleGestureStart: function(uxEvent, gestureElement)
	{
		wink.ux.touch.addListener(gestureElement.domNode, "gesturechange", { context: this, method: "_handleGestureChange", arguments: [ gestureElement ] }, gestureElement.preventDefault);
		wink.ux.touch.addListener(gestureElement.domNode, "gestureend", { context: this, method: "_handleGestureEnd", arguments: [ gestureElement ] });
		
		gestureElement.gestureStartTime = this._getTimeStamp();
	},
	/**
	 * Handle gesture change
	 *
	 * @parameters:
	 * 	--> uxEvent: the wink.ux.Event associated
	 * 	--> gestureElement: the GestureElement associated
	 */
	_handleGestureChange: function(uxEvent, gestureElement)
	{
		if (gestureElement.multitouch == true)
		{
			var scaleAmplitude = uxEvent.srcEvent.scale - gestureElement.scale;
			var rotationAmplitude = uxEvent.srcEvent.rotation - gestureElement.rotation;
			
			var scaleGestureInfos = {
				digit1: gestureElement.digits[0],
				digit2: gestureElement.digits[1],
				scale: wink.math.round(uxEvent.srcEvent.scale, 2)
			};
			
			var rotationGestureInfos = {
				digit1: gestureElement.digits[0],
				digit2: gestureElement.digits[1],
				rotation: wink.math.round(uxEvent.srcEvent.rotation, 2)
			};
			
			if (Math.abs(scaleAmplitude) > this.SCALE_MIN_VALUE)
			{
				gestureElement.scale = uxEvent.srcEvent.scale;

				var currentGesture = null;
				if (scaleAmplitude > 0)
				{
					currentGesture = "enlargement";
				}
				else
				{
					currentGesture = "narrowing";
				}
				this._notifyGesture(currentGesture, gestureElement, scaleGestureInfos);
			}

			if (Math.abs(rotationAmplitude) > this.ROTATION_MIN_VALUE)
			{
				gestureElement.rotation = uxEvent.srcEvent.rotation;
				this._notifyGesture("rotation", gestureElement, rotationGestureInfos);
			}
			
			this._notifyGesture("instant_scale", gestureElement, scaleGestureInfos);
			this._notifyGesture("instant_rotation", gestureElement, rotationGestureInfos);
		}
	},
	/**
	 * Handle gesture end
	 *
	 * @parameters:
	 * 	--> uxEvent: the wink.ux.Event associated
	 * 	--> gestureElement: the GestureElement associated
	 */
	_handleGestureEnd: function(uxEvent, gestureElement)
	{
		wink.ux.touch.removeListener(gestureElement.domNode, "gesturechange", { context: this, method: "_handleGestureChange" });
		wink.ux.touch.removeListener(gestureElement.domNode, "gestureend", { context: this, method: "_handleGestureEnd" });
		
		gestureElement.gestureEndTime = this._getTimeStamp();
		var gestureDuration = gestureElement.gestureEndTime - gestureElement.gestureStartTime;
		
		this._notifyGesture("gesture_end", gestureElement, { gestureDuration: gestureDuration });
	},
	/**
	 * Returns the digit information.
	 *
	 * @parameters:
	 * 	--> touch: the touch
	 * 	--> uxEvent: the wink.ux.Event
	 */
	_getDigit: function(touch, uxEvent)
	{
		var props = wink.ux.touch.getTouchProperties(touch);
		var digit = {
			x: props.x,
			y: props.y,
			timestamp: uxEvent.timestamp,
			target: props.target
		};
		return digit;
	},
	/**
	 * Returns the current timestamp.
	 */
	_getTimeStamp: function()
	{
		return new Date().getTime();
	}
};
