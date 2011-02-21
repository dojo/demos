/*--------------------------------------------------------
 * Copyright © 2009 – 2010* France Telecom
 * This software is distributed under the "Simplified BSD license",
 * the text of which is available at http://www.winktoolkit.org/licence.txt
 * or see the "license.txt" file for more details.
 *--------------------------------------------------------*/

/**
 * Implements a Cover Flow. Developed to be as flexible and configurable as possible.
 * The user must pay attention to the fact that the parameters significantly affect performance (reflected and displayTitle especially)
 *
 * @properties:
 * 	data =
 * 	{
 * 		covers: 					An array of covers ( cover: { image, title, backFaceId, action } )
 * 			--> A cover is composed of :
 * 				- image: 			URL of the cover image
 * 				- [title]: 			the id of the title node that will appear below image (mandatory if "displayTitle" is set to true)
 * 				- [backFaceId]: 	the id of the backface node that will appear when selecting a cover (if no action is specified)
 * 				- [action]:			the callback action that will be invoked when selecting a cover
 *
 * 		size: 						the Cover Flow size
 * 		viewportWidth: 				the width of the viewport
 * 		reflected: 					boolean that indicates if reflection must be displayed
 * 		displayTitle: 				boolean that indicates if title must be displayed
 * 		fadeEdges: 					boolean that indicates if fade along Cover Flow edges must be displayed
 * 		handleOrientationChange: 	boolean that indicates if the component must resized itself automatically if orientation has changed
 * 		handleGesture: 				boolean that indicates if gestures must be handled to rotate the Cover Flow on x-axis
 * 		backgroundColor: 			the background color value as { r: redValue, g: greenValue, b: blueValue }
 * 		coverSpacing: 				[optional] the spacing between covers
 * 		displayTitleDuration: 		[optional] the duration in millisecond of the title display
 * 		borderSize:					[optional] the cover shaded border size
 * 	}
 *
 * @methods:
 * 	--> getDomNode: 				Returns the Cover Flow dom node
 *  --> updateSize: 				Update the Cover Flow size and the viewportWidth
 *  --> setBackgroundColor: 		Set the Cover Flow background color
 *
 * @attributes:
 *  --> uId: unique identifier of the component
 *
 * @dependencies:
 *  --> wink.ux.MovementTracker
 * 	--> wink.math._geometric
 * 	--> wink.math._matrix
 *  --> wink.fx._xyz
 *  --> wink.ux.gesture
 *
 * @compatibility:
 * 	--> Iphone OS2 (slow), Iphone OS3
 *
 * @author:
 * 	--> Sylvain LALANDE
 */
wink.ui.xyz.CoverFlow = function(properties) {
	this.uId				= wink.getUId();
	this._properties 		= properties;
	
	this._covers			= null;
	this._backgroundColor	= null;
	this._reflected			= null;
	this._displayTitle		= null;
	this._fadeEdges			= null;
	this._size				= null;
	this._viewportWidth		= null;
	this._handleGesture		= null;
	this._handleOrientationChange = null;
	this._coverSpacing		= null;
	this._displayTitleDuration = null;
	this._borderSize		= null;
	
	this._domNode			= null;
	this._trayNode			= null;
	this._gestureNode		= null;
	this._faderLeft			= null;
	this._faderRight		= null;
	this._movementtracker 	= null;
	this._positions			= null;
	this._transformations	= null;
	this._transformsQueue	= null;
	this._renderer			= null;
	this._middleViewIndex	= null;
	this._lastRenderedIndex = null;
	this._timerTitle		= null;
	
	this._dragging			= false;
	this._displayMode		= false;
	this._flipping			= false;
	
	this._view 				= {
		x: 0,
		sizeX: 0,
		shiftX: 25,
		shiftFromMiddle: 200,
		coverRotation: 55,
		coverScale: 0.28,
		zMiddleCover: 175,
		zAroundCover: 0,
		numberOfCoverToRender: 5,
		distanceToCenter: 0,
		distanceFromTop: 0,
		zGestureNode: 1000,
		observerRotation: 0,
		currentObserverRotation: 0
	};
	
	if (this._validateProperties() === false) return;
	
	this._initProperties();
	this._initDom();
	this._initListeners();
};

wink.ui.xyz.CoverFlow.prototype = {
	_Z_INDEX_BACKGROUND: 5,
	_DURATION_BACKTO_BOUND: 200,
	_DURATION_MIDDLE: 600,
	_DURATION_AROUND: 300,
	_DURATION_FLIP: 1000,
	_TRANSITION_FUNC: 'default',
	_OUTOFBOUND_FRICTIONAL_FORCES: 4,
	_RENDERER_INTERVAL: 15,
	_DELAY_BEFORE_IMAGE_LOADING: 50,
	_PERSPECTIVE: 500,
	_REFLECTION_ATTENUATION: 0.6,
	_DELAY_FOR_TITLE_DISPLAY: 400,
		
	/**
	 * Returns the Cover Flow dom node
	 */
	getDomNode: function()
	{
		return this._domNode;
	},
	/**
	 * Update the Cover Flow size and the viewportWidth
	 *
	 * @parameters:
	 *	--> size: the component size
	 *	--> viewportWidth: the viewport width
	 */
	updateSize: function(size, viewportWidth)
	{
		this._size = size;
		this._viewportWidth = viewportWidth;
		
		// View
		var ratioShift 			= 0.07;
		if (wink.isset(this._coverSpacing))
		{
			ratioShift = (this._coverSpacing * 0.003);
		}
		this._view.shiftX		= ratioShift * size;
		this._positions 		= [];
		for ( var i = 0; i < this._covers.length; i++)
		{
			this._positions[i] = (this._view.shiftX * i);
		}
		this._view.sizeX			= this._positions[this._covers.length - 1];
		this._view.shiftFromMiddle 	= 0.7 * size;
		
		var ratioTraySize 			= Math.max((viewportWidth / size) - 1, 0);
		this._view.distanceToCenter = ratioTraySize * (size / 2);
		this._view.distanceFromTop	= size * (this._view.coverScale / 1.5);
		
		// DOM
		var viewWidth 				= size * (1 + ratioTraySize);
		this._domNode.style.width 	= viewWidth + "px";
		this._domNode.style.height 	= size + "px";
		
		this._trayNode.style.width 	= viewWidth + "px";
		this._trayNode.style.height = size + "px";
		
		this._gestureNode.style.width  = viewWidth + "px";
		this._gestureNode.style.height = size + "px";
		
		for ( var i = 0; i < this._covers.length; i++)
		{
			this._covers[i].coverNode.style.width 		= size + "px";
			this._covers[i].coverNode.style.height 		= size + "px";
			
			this._covers[i].coverInnerNode.style.width 	= size + "px";
			this._covers[i].coverInnerNode.style.height = size + "px";
			
			this._covers[i].imageNode.style.width 		= size + "px";
			this._covers[i].imageNode.style.height 		= size + "px";
			
			this._covers[i].coverReflection.style.width = size + "px";
			
			if (this._reflected)
			{
				this._covers[i].coverReflectionBack.style.width 	= size + "px";
				this._covers[i].coverReflectionBack.style.height 	= this._REFLECTION_ATTENUATION * size + "px";
			}
			if (this._displayTitle)
			{
				this._covers[i].titleNode.style.width				= size + "px";
			}
		}
		
		if (this._fadeEdges)
		{
			var faderWidth					= viewportWidth / 15;
			this._faderLeft.width 			= faderWidth;
			this._faderLeft.height 			= size;
			this._faderRight.width 			= faderWidth;
			this._faderRight.height 		= size;

			this._faderRight.style.left		= 0 + "px";
			this._faderRight.style.left		= viewWidth - faderWidth + 1 + "px";
			this._updateEdgeFaders();
		}

		// Transform
		this._createTransformations();
		this._initTransformations();
		this._slideTo(this._positions[this._currentPosition], true);
	},
	/**
	 * Set the Cover Flow background color
	 */
	setBackgroundColor: function(color)
	{
		this._backgroundColor = color;

		var inverseColor = {
			r: (255 - this._backgroundColor.r),
			g: (255 - this._backgroundColor.g),
			b: (255 - this._backgroundColor.b)
		};
		var rgbaBg = "rgba(" + this._backgroundColor.r + ", " + this._backgroundColor.g + ", " + this._backgroundColor.b + ", 1.0)";
		
		this._domNode.style.backgroundColor = rgbaBg;
		//this._gestureNode.style.opacity = 0.0;
		
		var coverShadow = this._borderSize + "px -" + this._borderSize + "px 6px rgba(" + inverseColor.r + ", " + inverseColor.g + ", " + inverseColor.b + ", 0.5)";
		
		for ( var i = 0; i < this._covers.length; i++)
		{
			if (this._reflected)
			{
				this._covers[i].coverReflectionBack.style.backgroundColor = rgbaBg;
			}
			if (wink.isset(this._borderSize) && this._borderSize > 0)
			{
				this._covers[i].imageNode.style["-webkit-box-shadow"] = coverShadow;
			}
		}
		
		if (this._fadeEdges)
		{
			this._updateEdgeFaders();
		}
	},
	/**
	 * Check if the properties are correct
	 */
	_validateProperties: function()
	{
		if (!wink.isset(this._properties.covers) || this._properties.covers.length == 0)
		{
			wink.log('[CoverFlow] Error: covers property must be specified with at least one cover');
			return false;
		}
		if (!wink.isset(this._properties.size))
		{
			wink.log('[CoverFlow] Error: size property must be specified');
			return false;
		}
		if (!wink.isset(this._properties.viewportWidth))
		{
			wink.log('[CoverFlow] Error: viewportWidth property must be specified');
			return false;
		}
		if (!wink.isset(this._properties.backgroundColor))
		{
			wink.log('[CoverFlow] Error: backgroundColor property must be specified');
			return false;
		}
		if (!wink.isset(this._properties.backgroundColor.r)
			|| !wink.isset(this._properties.backgroundColor.g)
			|| !wink.isset(this._properties.backgroundColor.b)) {
			wink.log('[CoverFlow] Error: backgroundColor property must be specified with "r, g, b" values');
			return false;
		}
		if (!wink.isset(this._properties.reflected))
		{
			wink.log('[CoverFlow] Error: reflected property must be specified');
			return false;
		}
		if (!wink.isset(this._properties.displayTitle))
		{
			wink.log('[CoverFlow] Error: displayTitle property must be specified');
			return false;
		}
		if (!wink.isset(this._properties.handleOrientationChange))
		{
			wink.log('[CoverFlow] Error: handleOrientationChange property must be specified');
			return false;
		}
		if (!wink.isset(this._properties.handleGesture))
		{
			wink.log('[CoverFlow] Error: handleGesture property must be specified');
			return false;
		}
		
		for ( var i = 0; i < this._properties.covers.length; i++)
		{
			if (!this._isValidCover(this._properties.covers[i]))
			{
				wink.log('[CoverFlow] Error: bad cover structure');
				return false;
			}
		}
		return true;
	},
	/**
	 * Check if the given cover is valid.
	 *
	 * @parameters:
	 * 	--> cover: the cover to check
	 */
	_isValidCover: function(cover)
	{
		var isValid = true;
		isValid = isValid && wink.isset(cover);
		isValid = isValid && wink.isset(cover.image);
		isValid = isValid && wink.isset(cover.title);
		return isValid;
	},
	/**
	 * Initialize datas with given properties
	 */
	_initProperties: function()
	{
		this._covers 					= new Array().concat(this._properties.covers);
		this._currentPosition 			= Math.floor(this._covers.length / 2);
		this._view.x					= 0;
		this._middleViewIndex 			= Math.floor(this._view.numberOfCoverToRender / 2);
		this._lastRenderedIndex			= this._currentPosition;
		this._transformsQueue			= [];
		this._backgroundColor			= this._properties.backgroundColor;
		this._size						= this._properties.size;
		this._viewportWidth				= this._properties.viewportWidth;
		this._coverSpacing 				= this._properties.coverSpacing;
		this._borderSize				= this._properties.borderSize;

		this._handleOrientationChange 	= false;
		if (this._properties.handleOrientationChange === true)
		{
			this._handleOrientationChange = true;
			var wm = new wink.ux.Window();
			wink.subscribe('/window/events/resize', { context: this, method: '_onOrientationChange' });
		}
		
		this._reflected					= false;
		if (this._properties.reflected === true)
		{
			this._reflected = true;
		}
		this._displayTitle				= false;
		if (this._properties.displayTitle === true)
		{
			this._displayTitle = true;
		}
		this._fadeEdges					= false;
		if (this._properties.fadeEdges === true)
		{
			this._fadeEdges = true;
		}
		this._handleGesture				= false;
		if (this._properties.handleGesture === true)
		{
			this._handleGesture = true;
		}
		this._displayTitleDuration		= 0;
		if (wink.isset(this._properties.displayTitleDuration))
		{
			this._displayTitleDuration = this._properties.displayTitleDuration;
		}
	},
	/**
	 * Initialize the DOM nodes
	 */
	_initDom: function()
	{
		this._domNode = document.createElement('div');
		this._domNode.style.webkitUserSelect = "none";
		
		this._trayNode = document.createElement('div');
		this._trayNode.style.position = "absolute";
		this._domNode.appendChild(this._trayNode);
		
		this._gestureNode = document.createElement('div');
		this._gestureNode.style.position = "absolute";
		this._domNode.appendChild(this._gestureNode);
		
		for ( var i = 0; i < this._covers.length; i++)
		{
			var coverNode = document.createElement('div');
			var coverOutlineNode = document.createElement('div');
			var coverInnerNode = document.createElement('div');
			var imageNode = document.createElement('img');
			var coverReflection = document.createElement('div');
			
			coverInnerNode.appendChild(imageNode);
			coverInnerNode.appendChild(coverReflection);
			coverOutlineNode.appendChild(coverInnerNode);
			coverNode.appendChild(coverOutlineNode);
			this._trayNode.appendChild(coverNode);
			
			coverNode.style.position = "absolute";
			coverInnerNode.style.position = "absolute";
			
			this._covers[i].coverNode 			= coverNode;
			this._covers[i].coverOutlineNode 	= coverOutlineNode;
			this._covers[i].coverInnerNode 		= coverInnerNode;
			this._covers[i].imageNode 			= imageNode;
			this._covers[i].coverReflection 	= coverReflection;
			
			this._covers[i].transformation 		= null;
			this._covers[i].diffTransform		= true;
			this._covers[i].displayed 			= false;
			this._covers[i].handleEnd			= null;
			
			if (this._reflected)
			{
				var coverReflectionFront = document.createElement('canvas');
				var coverReflectionBack = document.createElement('div');
				coverReflection.appendChild(coverReflectionFront);
				coverReflection.appendChild(coverReflectionBack);
				coverReflectionFront.style.position = "absolute";
				coverReflectionBack.style.position = "absolute";
				
				this._covers[i].coverReflectionFront = coverReflectionFront;
				this._covers[i].coverReflectionBack	= coverReflectionBack;
			}
			if (this._displayTitle)
			{
				var titleNode = document.createElement('div');
				coverReflection.appendChild(titleNode);
				titleNode.style.position = "absolute";
				//titleNode.style.textAlign = "center";
				var titleInnerNode = $(this._covers[i].title);
				titleNode.appendChild(titleInnerNode);
				
				this._covers[i].titleNode = titleNode;
				this._covers[i].titleInnerNode = titleInnerNode;
			}

			this._covers[i].coverNode.style["-webkit-perspective"] = this._PERSPECTIVE;
			this._covers[i].coverNode.style["-webkit-transform-style"] = "preserve-3d";
			this._covers[i].coverOutlineNode.style["-webkit-transform-style"] = "preserve-3d";
		}
		
		if (this._fadeEdges)
		{
			this._faderLeft = document.createElement('canvas');
			this._faderRight = document.createElement('canvas');
			this._domNode.appendChild(this._faderLeft);
			this._domNode.appendChild(this._faderRight);
			this._faderLeft.style.position = "absolute";
			this._faderRight.style.position = "absolute";
		}
		
		this._hideBackFaces();
		this._organizeDepth();
		this.updateSize(this._size, this._viewportWidth);
		this.setBackgroundColor(this._backgroundColor);
		wink.setTimeout(this, "_setImages", this._DELAY_BEFORE_IMAGE_LOADING);
	},
	/**
	 * Initialize listeners
	 */
	_initListeners: function()
	{
		this._movementtracker = new wink.ux.MovementTracker({ target: this._gestureNode });
		wink.subscribe('/movementtracker/events/mvtbegin', { context: this, method: '_handleMovementBegin' });
		wink.subscribe('/movementtracker/events/mvtchanged', { context: this, method: '_handleMovementChanged' });
		wink.subscribe('/movementtracker/events/mvtstored', { context: this, method: '_handleMovementStored' });
		
		if (this._handleGesture)
		{
			this._gestureNode.listenToGesture(
				"instant_rotation",
				{ context: this, method: "_handleRotation", arguments: null },
				true
			);
			this._gestureNode.listenToGesture(
				"gesture_end",
				{ context: this, method: "_handleGestureEnd", arguments: null },
				true
			);
		}
	},
	/**
	 * Handle the rotation Gesture that impacts the Cover Flow rotation on x-axis
	 *
	 * @parameters:
	 *	--> gestureInfos: see wink.ux.gesture Events
	 */
	_handleRotation: function(gestureInfos)
	{
		if (this._displayMode == false)
		{
			var targetedRotation = this._view.observerRotation + gestureInfos.rotation;
			if (targetedRotation > 17 || targetedRotation < -70)
			{
				return;
			}
			this._view.currentObserverRotation = targetedRotation;
			for ( var i = 0; i < this._covers.length; i++)
			{
				wink.fx.setTransformPart(this._covers[i].coverOutlineNode, 3, { type: "rotate", x: 1, y: 0, z: 0, angle: this._view.currentObserverRotation });
				wink.fx.applyComposedTransform(this._covers[i].coverOutlineNode);
			}
		}
	},
	/**
	 * Handle the end of the Gesture
	 *
	 * @parameters:
	 *	--> gestureInfos: see wink.ux.gesture Events
	 */
	_handleGestureEnd: function(gestureInfos)
	{
		if (this._displayMode == false)
		{
			this._view.observerRotation = this._view.currentObserverRotation;
		}
	},
	/**
	 * Handles the movement start
	 *
	 * @parameters:
	 * 	--> publishedInfos: see wink.ux.MovementTracker Events
	 */
	_handleMovementBegin: function(publishedInfos)
	{
		var publisher = publishedInfos.publisher;
		if (publisher.uId != this._movementtracker.uId)
		{
			return;
		}
		this._dragging = false;
	},
	/**
	 * Handles the movement updates.
	 *
	 * @parameters:
	 * 	--> publishedInfos: see wink.ux.MovementTracker Events
	 */
	_handleMovementChanged: function(publishedInfos)
	{
		var publisher = publishedInfos.publisher;
		if (publisher.uId != this._movementtracker.uId)
		{
			return;
		}
		if (this._displayMode)
		{
			return;
		}
		
		var movement = publishedInfos.movement;
		
		var beforeLastPoint = movement.pointStatement[movement.pointStatement.length - 2];
		var lastPoint = movement.pointStatement[movement.pointStatement.length - 1];
		
		var dx = lastPoint.x - beforeLastPoint.x;
		dx /= 2;
		
		var boundsInfos = this._getBoundsInfos(this._view.x);
		if (boundsInfos.outsideOfBounds) {
			if ( (boundsInfos.direction > 0 && lastPoint.directionX > 0)
				|| (boundsInfos.direction < 0 && lastPoint.directionX < 0) ) {
				dx /= this._OUTOFBOUND_FRICTIONAL_FORCES;
			}
		}
		
		this._dragging = true;
		this._slideTo(this._view.x - dx);
	},
	/**
	 * Handles the movement end : flip, unflip or invoke action
	 *
	 * @parameters:
	 * 	--> publishedInfos: see wink.ux.MovementTracker Events
	 */
	_handleMovementStored: function(publishedInfos)
	{
		var publisher = publishedInfos.publisher;
		if (publisher.uId != this._movementtracker.uId)
		{
			return;
		}
		
		if (this._dragging == false)
		{
			if (this._flipping)
			{
				return;
			}
			
			var position = this._currentPosition;
			var lastPoint = publishedInfos.movement.pointStatement[publishedInfos.movement.pointStatement.length - 1];
			
			if (this._displayMode)
			{
				if (!this._onMiddleCover(lastPoint.x, lastPoint.y))
				{
					this._flipping = true;
					this._unflipCover(position);
				}
				else
				{
					var uxEvent = publishedInfos.uxEvent;
					uxEvent.dispatch(uxEvent.target, "click");
				}
			}
			else
			{
				if (this._onMiddleCover(lastPoint.x, lastPoint.y))
				{
					var coverClicked = this._covers[position];
					if (wink.isset(coverClicked.action))
					{
						if (!wink.isCallback(coverClicked.action))
						{
							wink.log('[CoverFlow] Invalid action for cover : ' + position);
							return;
						}
						wink.call(coverClicked.action, coverClicked);
					}
					else if (wink.isset(coverClicked.backFaceId))
					{
						this._flipping = true;
						this._prepareCoverBackFace(position);
						wink.setTimeout(this, "_flipCover", 1, position);
					}
				}
			}
			return;
		}
		if (this._backToBounds()) {
			return;
		}
	},
	/**
	 * Prepare the backface of the selected cover in order to flip
	 *
	 * @parameters:
	 * 	--> position: the position of the cover to prepare
	 */
	_prepareCoverBackFace: function(position)
	{
		var backFaceNode = $(this._covers[position].backFaceId);
		backFaceNode.style.display = "block";
		backFaceNode.style.position = "absolute";
		backFaceNode.style.width = this._size + "px";
		backFaceNode.style.height = this._size + "px";

		wink.fx.set3dTransform(backFaceNode, { type: "rotate", x: 0, y: 1, z: 0, angle: 180 });

		backFaceNode.style["-webkit-backface-visibility"] = "hidden";
		this._covers[position].coverInnerNode.style["-webkit-backface-visibility"] = "hidden";
		
		wink.fx.applyTransformTransition(this._covers[position].coverOutlineNode, '0ms', '0ms', this._TRANSITION_FUNC);
		wink.fx.setTransformPart(this._covers[position].coverOutlineNode, 2, { type: "translate", x: 0, y: 0, z: this._view.zMiddleCover });
		wink.fx.applyComposedTransform(this._covers[position].coverOutlineNode);
		
		this._covers[position].coverInnerNode.style.webkitTransformOriginZ = this._view.zMiddleCover + "px";
		this._covers[position].coverOutlineNode.appendChild(backFaceNode);
	},
	/**
	 * Flip the selected cover in order to display the back face
	 *
	 * @parameters:
	 * 	--> position: the position of the cover to flip
	 */
	_flipCover: function(position)
	{
		var _this = this;
		this._covers[position].handleFlipEnd = function(e) {
			_this._postFlipCover(position);
		};
		this._covers[position].coverOutlineNode.addEventListener('webkitTransitionEnd', this._covers[position].handleFlipEnd, false);
		
		wink.fx.applyTransformTransition(this._covers[position].coverOutlineNode, this._DURATION_FLIP + 'ms', '0ms', this._TRANSITION_FUNC);
		wink.fx.setTransformPart(this._covers[position].coverOutlineNode, 1, { type: "rotate", x: 0, y: 1, z: 0, angle: 180 });
		wink.fx.setTransformPart(this._covers[position].coverOutlineNode, 2, { type: "translate", x: 0, y: this._view.distanceFromTop, z: this._view.zMiddleCover * 1.5 });
		wink.fx.setTransformPart(this._covers[position].coverOutlineNode, 3, { type: "rotate", x: 1, y: 0, z: 0, angle: 0 });
		wink.fx.applyComposedTransform(this._covers[position].coverOutlineNode);
		this._displayMode = true;
	},
	/**
	 * Handles the end of the flip process
	 *
	 * @parameters:
	 * 	--> position: the position of the cover flipped
	 */
	_postFlipCover: function(position)
	{
		this._flipping = false;
		this._covers[position].coverOutlineNode.removeEventListener('webkitTransitionEnd', this._covers[position].handleFlipEnd, false);
		
		this._gestureNode.style.zIndex = this._Z_INDEX_BACKGROUND;
		wink.fx.set3dTransform(this._gestureNode, { type: "translate", x: 0, y: 0, z: this._view.zMiddleCover / 2 });
	},
	/**
	 * Unflip the selected cover in order to display the front face
	 *
	 * @parameters:
	 * 	--> position: the position of the cover to unflip
	 */
	_unflipCover: function(position)
	{
		wink.fx.setTransformPart(this._covers[position].coverOutlineNode, 1, { type: "rotate", x: 0, y: 1, z: 0, angle: 0 });
		wink.fx.setTransformPart(this._covers[position].coverOutlineNode, 2, { type: "translate", x: 0, y: 0, z: 0 });
		wink.fx.setTransformPart(this._covers[position].coverOutlineNode, 3, { type: "rotate", x: 1, y: 0, z: 0, angle: this._view.currentObserverRotation });
		wink.fx.applyComposedTransform(this._covers[position].coverOutlineNode);
		this._covers[position].coverInnerNode.style.webkitTransformOriginZ = 0 + "px";
		
		var _this = this;
		this._covers[position].handleFlipEnd = function(e) {
			_this._postUnflipCover(position);
		};
		this._covers[position].coverOutlineNode.addEventListener('webkitTransitionEnd', this._covers[position].handleFlipEnd, false);
	},
	/**
	 * Handles the end of the unflip process
	 *
	 * @parameters:
	 * 	--> position: the position of the cover unflipped
	 */
	_postUnflipCover: function(position)
	{
		wink.fx.applyTransformTransition(this._covers[position].coverOutlineNode, '0ms', '0ms', this._TRANSITION_FUNC);
		var backFaceNode = $(this._covers[position].backFaceId);
		backFaceNode.style.display = "none";
		this._displayMode = false;
		this._flipping = false;
		this._covers[position].coverOutlineNode.removeEventListener('webkitTransitionEnd', this._covers[position].handleFlipEnd, false);
		
		this._gestureNode.style.zIndex = this._Z_INDEX_BACKGROUND + 4;
		wink.fx.set3dTransform(this._gestureNode, { type: "translate", x: 0, y: 0, z: this._view.zGestureNode });
	},
	/**
	 * Handles an orientation change
	 *
	 * @parameters:
	 * 	--> properties: see wink.ux.Window Events
	 */
	_onOrientationChange: function(properties)
	{
		var viewportWidth = properties.width;
		this.updateSize(this._size, viewportWidth);
	},
	/**
	 * Returns the current position (the middle Cover) that depends on covers positions
	 *
	 * @parameters:
	 * 	--> x: the current coordinate
	 */
	_getPosition: function(x)
	{
		var currentPosition = null;
		for ( var i = 0; i < this._positions.length; i++)
		{
			currentPosition = i;
			if (x < (this._positions[i] + (this._view.shiftX / 2)))
			{
				break;
			}
		}
		return currentPosition;
	},
	/**
	 * Slide to the given position.
	 *
	 * @parameters:
	 * 	--> x: the targeted position
	 * 	--> force: true only if view must be slided even if there is no position difference
	 */
	_slideTo: function(x, force)
	{
		var newX = wink.math.round(x, 2);
		if (newX != this._view.x || force === true)
		{
			this._view.x = newX;
			wink.fx.set3dTransform(this._trayNode, { type: "translate", x: -this._view.x + this._view.distanceToCenter, y: -this._view.distanceFromTop, z: 0 });
			this._updateView();
		}
	},
	/**
	 * Updates the view if the current displayed cover has changed.
	 */
	_updateView: function()
	{
		var newPosition = this._getPosition(this._view.x);
		if (newPosition != this._currentPosition)
		{
			this._currentPosition = newPosition;
			this._addToQueue(this._currentPosition);
		}
	},
	/**
	 * Starts the renderer process
	 */
	_startRenderer: function()
	{
		if (this._renderer == null)
		{
			this._renderer = wink.setTimeout(this, '_rendererProcess', 1);
		}
	},
	/**
	 * Stops the renderer process
	 */
	_stopRenderer: function()
	{
		if (this._renderer != null)
		{
			clearTimeout(this._renderer);
			this._renderer = null;
		}
	},
	/**
	 * Execute the renderer process : compute and apply transformations successively on the different positions requested by the user
	 */
	_rendererProcess: function()
	{
		if (this._transformsQueue[0].rendering == false)
		{
			this._transformsQueue[0].rendering = true;
			var position = this._transformsQueue[0].position;
			
			var _this = this;
			this._covers[position].handleEnd = function(e) {
				_this._handleCoverRendered(position);
			};
			this._covers[position].coverInnerNode.addEventListener('webkitTransitionEnd', this._covers[position].handleEnd, false);
			
			this._updateTransformations(position);
			var durationForMiddle = wink.math.round(this._DURATION_MIDDLE / (this._transformsQueue.length * 2), 0);
			var durationForAround = wink.math.round(this._DURATION_AROUND / (this._transformsQueue.length * 2), 0);
			this._updateTransitions(position, durationForMiddle, durationForAround);
			this._applyTransformations();
		}
		else if (this._transformsQueue[0].rendered == true)
		{
			this._transformsQueue.shift();
			if (this._transformsQueue.length == 0)
			{
				this._stopRenderer();
				return;
			}
		}
		else
		{
			if (this._transformsQueue.length > 1)
			{
				this._handleCoverRendered(this._transformsQueue[0].position);
			}
		}
		
		this._renderer = wink.setTimeout(this, '_rendererProcess', this._RENDERER_INTERVAL);
	},
	/**
	 * Handles a rendered cover
	 *
	 * @parameters:
	 * 	--> index: the index of the rendered cover
	 */
	_handleCoverRendered: function(index)
	{
		this._lastRenderedIndex = index;
		if (this._covers[index].handleEnd != null)
		{
			this._covers[index].coverInnerNode.removeEventListener('webkitTransitionEnd', this._covers[index].handleEnd, false);
			this._covers[index].handleEnd = null;
		}
		if (this._transformsQueue.length == 0)
		{
			return;
		}
		this._transformsQueue[0].rendered = true;
	},
	/**
	 * Add to the renderer process queue the given position
	 *
	 * @parameters:
	 * 	--> position: the position to render
	 */
	_addToQueue: function(position)
	{
		this._transformsQueue.push({
			timestamp: new Date().getTime(),
			position: position,
			rendered: false,
			rendering: false
		});
		this._startRenderer();
	},
	/**
	 * Update transformation of the covers
	 *
	 * @parameters:
	 * 	--> middlePosition: the middle position
	 */
	_updateTransformations: function(middlePosition)
	{
		var shift = Math.abs(this._lastRenderedIndex - middlePosition) - 1;
		var half = this._middleViewIndex + shift;
		
		var start = middlePosition - half;
		var end = middlePosition + (half + 1);
		
		if (middlePosition < half)
		{
			start = 0;
		}
		if (end > this._covers.length)
		{
			end = this._covers.length;
		}
		
		for (var i = 0; i < this._covers.length; i++)
		{
			this._covers[i].diffTransform = false;
		}
		
		for (var i = start; i < end; i++)
		{
			this._covers[i].oldTransformation 	= this._covers[i].transformation;
			this._covers[i].transformation	= this._getTargetedTransformation(i, middlePosition);
			this._covers[i].diffTransform  	= this._transformationsDifferent(this._covers[i].oldTransformation, this._covers[i].transformation);
		}
	},
	/**
	 * Update transitions of the covers
	 *
	 * @parameters:
	 * 	--> middlePosition: the middle position
	 * 	--> durationForMiddle: the transition duration for the cover at the middle
	 * 	--> durationForAround: the transition duration for the covers around
	 */
	_updateTransitions: function(middlePosition, durationForMiddle, durationForAround)
	{
		for (var i = 0; i < this._covers.length; i++)
		{
			if (this._covers[i].diffTransform)
			{
				if (i == middlePosition)
				{
					wink.fx.applyTransformTransition(this._covers[i].coverInnerNode, durationForMiddle + 'ms', '0ms', this._TRANSITION_FUNC);
				}
				else
				{
					wink.fx.applyTransformTransition(this._covers[i].coverInnerNode, durationForAround + 'ms', '0ms', this._TRANSITION_FUNC);
				}
			}
		}
	},
	/**
	 * Apply transformation to the covers
	 */
	_applyTransformations: function()
	{
		for (var i = 0; i < this._covers.length; i++)
		{
			if (this._covers[i].diffTransform)
			{
				wink.fx.setTransformPart(this._covers[i].coverInnerNode, 1, this._covers[i].transformation.rotation);
				wink.fx.setTransformPart(this._covers[i].coverInnerNode, 2, this._covers[i].transformation.translation);
				wink.fx.applyComposedTransform(this._covers[i].coverInnerNode);
					
				if (this._displayTitle)
				{
					if (i == this._currentPosition)
					{
						if (this._displayTitleDuration > 0)
						{
							if (wink.isset(this._timerTitle))
							{
								clearTimeout(this._timerTitle);
								this._timerTitle = null;
							}
							this._timerTitle = wink.setTimeout(this, "_showTitle", this._DELAY_FOR_TITLE_DISPLAY, i);
						}
						else
						{
							this._showTitle(i);
						}
					}
					else
					{
						if (this._displayTitleDuration > 0)
						{
							wink.fx.applyTransition(this._covers[i].titleNode, "opacity", '0ms', '0ms', this._TRANSITION_FUNC);
						}
						this._setTitleOpacity(i, 0.0);
					}
				}
			}
		}
	},
	/**
	 * Returns true if the givens transformations are considered different
	 *
	 * @parameters:
	 * 	--> t1: the first transformation
	 * 	--> t2: the second transformation
	 */
	_transformationsDifferent: function(t1, t2)
	{
		return (t1.rotation.angle != t2.rotation.angle);
	},
	/**
	 * Initialize transformations of the covers
	 */
	_initTransformations: function()
	{
		for ( var i = 0; i < this._covers.length; i++)
		{
			wink.fx.initComposedTransform(this._covers[i].coverNode);
			wink.fx.setTransformPart(this._covers[i].coverNode, 1, { type: "scale", x: this._view.coverScale, y: this._view.coverScale, z: 1 });
			wink.fx.setTransformPart(this._covers[i].coverNode, 2, { type: "translate", x: this._positions[i], y: 0, z: 0 });
			wink.fx.storeComposedTransform(this._covers[i].coverNode);
			wink.fx.removeComposedTransform(this._covers[i].coverNode);
			
			wink.fx.initComposedTransform(this._covers[i].coverOutlineNode);
			
			wink.fx.initComposedTransform(this._covers[i].coverInnerNode);
			this._covers[i].transformation = this._getTargetedTransformation(i, this._currentPosition);
		}
		this._applyTransformations();
		wink.fx.set3dTransform(this._gestureNode, { type: "translate", x: 0, y: 0, z: this._view.zGestureNode });
	},
	/**
	 * Create transformations to load later
	 */
	_createTransformations: function()
	{
		this._transformations = {
			left: {
				rotation: 		{ type: "rotate", x: 0, y: 1, z: 0, angle: this._view.coverRotation },
				translation: 	{ type: "translate", x: -this._view.shiftFromMiddle, y: 0, z: this._view.zAroundCover }
			},
			middle: {
				rotation: 		{ type: "rotate", x: 0, y: 1, z: 0, angle: 0 },
				translation: 	{ type: "translate", x: 0, y: 0, z: this._view.zMiddleCover }
			},
			right: {
				rotation: 		{ type: "rotate", x: 0, y: 1, z: 0, angle: -this._view.coverRotation },
				translation: 	{ type: "translate", x: this._view.shiftFromMiddle, y: 0, z: this._view.zAroundCover }
			}
		};
	},
	/**
	 * Returns the transformation to apply to the given index
	 *
	 * @parameters:
	 * 	--> index: the current index
	 * 	--> middle: the middle index
	 */
	_getTargetedTransformation: function(index, middle)
	{
		if (index < middle)
		{
			return this._transformations.left;
		}
		else if (index > middle)
		{
			return this._transformations.right;
		}
		else
		{
			return this._transformations.middle;
		}
	},
	/**
	 * Show the title
	 *
	 * @parameters:
	 * 	--> index: the index of the associated cover
	 */
	_showTitle: function(index)
	{
		if (wink.isset(this._timerTitle))
		{
			clearTimeout(this._timerTitle);
			this._timerTitle = null;
		}
		if (index == this._currentPosition)
		{
			if (this._displayTitleDuration > 0)
			{
				wink.fx.applyTransition(this._covers[index].titleNode, "opacity", this._displayTitleDuration + 'ms', '0ms', this._TRANSITION_FUNC);
			}
			this._setTitleOpacity(index, 1.0);
		}
	},
	/**
	 * Updates sur title opacity
	 *
	 * @parameters:
	 * 	--> index: the index of the associated cover
	 * 	--> opacity: the opacity value
	 */
	_setTitleOpacity: function(index, opacity)
	{
		this._covers[index].titleNode.style.opacity = opacity;
	},
	/**
	 * Hides all back faces
	 */
	_hideBackFaces: function()
	{
		for ( var i = 0; i < this._covers.length; i++)
		{
			if (wink.isset(this._covers[i].backFaceId))
			{
				var backFaceNode = $(this._covers[i].backFaceId);
				backFaceNode.style.display = "none";
			}
		}
	},
	/**
	 * Set all cover images
	 */
	_setImages: function()
	{
		for ( var i = 0; i < this._covers.length; i++)
		{
			if (this._reflected)
			{
				this._applyReflection(i);
			}
			this._covers[i].imageNode.src = this._covers[i].image;
		}
	},
	/**
	 * Organize the Cover Flow depth
	 */
	_organizeDepth: function()
	{
		this._domNode.style.zIndex = this._Z_INDEX_BACKGROUND;
		this._trayNode.style.zIndex = this._Z_INDEX_BACKGROUND + 1;
		this._gestureNode.style.zIndex = this._Z_INDEX_BACKGROUND + 4;
		
		if (this._reflected)
		{
			for ( var i = 0; i < this._covers.length; i++)
			{
				if (this._displayTitle)
				{
					this._covers[i].titleNode.style.zIndex 			= this._Z_INDEX_BACKGROUND + 4;
				}
				this._covers[i].coverReflectionFront.style.zIndex 	= this._Z_INDEX_BACKGROUND + 3;
				this._covers[i].coverReflectionBack.style.zIndex 	= this._Z_INDEX_BACKGROUND + 2;
			}
		}
		if (this._fadeEdges)
		{
			this._faderLeft.style.zIndex 	= this._Z_INDEX_BACKGROUND + 4;
			this._faderRight.style.zIndex 	= this._Z_INDEX_BACKGROUND + 4;
		}
	},
	/**
	 * Apply Reflection on a cover
	 *
	 * @parameters:
	 * 	--> index: the index of the cover to reflect
	 */
	_applyReflection: function(index)
	{
		var img = this._covers[index].imageNode;
		var canvas = this._covers[index].coverReflectionFront;
		var _this = this;
		this._covers[index].imageLoadingHandler = function () {
			_this._reflect(index, img, canvas, img.width, img.height);
		};
		img.addEventListener("load", this._covers[index].imageLoadingHandler);
	},
	/**
	 * Reflection process
	 *
	 * @parameters:
	 * 	--> index: the index of the cover to reflect
	 * 	--> image: the image to reflect
	 * 	--> canvas: the target canvas
	 * 	--> width: the width of the canvas
	 * 	--> height: the height of the canvas
	 */
	_reflect: function(index, image, canvas, width, height)
	{
	    canvas.width = width;
	    canvas.height = height;

	    var ctx = canvas.getContext("2d");

	    ctx.save();

	    ctx.translate(0, (height / 1.5));
	    ctx.scale(1, -1);
	    ctx.drawImage(image, 0, 0, width, height / 1.5);

	    ctx.restore();

	    ctx.globalCompositeOperation = "destination-out";

	    var gradient = ctx.createLinearGradient(0, 0, 0, height);
	    gradient.addColorStop(0, "rgba(255, 255, 255, " + this._REFLECTION_ATTENUATION + ")");
	    gradient.addColorStop(0.6, "rgba(255, 255, 255, 1.0)");
	    
	    ctx.fillStyle = gradient;
	    ctx.fillRect(0, 0, width, height);
	    image.removeEventListener("load", this._covers[index].imageLoadingHandler);
	},
	/**
	 * Update the edge faders
	 */
	_updateEdgeFaders: function()
	{
		var ctx = this._faderLeft.getContext("2d");

	    var gradient = ctx.createLinearGradient(0, 0, this._faderLeft.width, 0);
	    gradient.addColorStop(0.0, "rgba(" + this._backgroundColor.r + ", " + this._backgroundColor.g + ", " + this._backgroundColor.b + ", 1.0)");
	    gradient.addColorStop(1.0, "rgba(" + this._backgroundColor.r + ", " + this._backgroundColor.g + ", " + this._backgroundColor.b + ", 0.0)");
	    
	    ctx.fillStyle = gradient;
	    ctx.fillRect(0, 0, this._faderLeft.width, this._faderLeft.height);
	    
	    ctx = this._faderRight.getContext("2d");

	    gradient = ctx.createLinearGradient(0, 0, this._faderRight.width, 0);
	    gradient.addColorStop(0.0, "rgba(" + this._backgroundColor.r + ", " + this._backgroundColor.g + ", " + this._backgroundColor.b + ", 0.0)");
	    gradient.addColorStop(1.0, "rgba(" + this._backgroundColor.r + ", " + this._backgroundColor.g + ", " + this._backgroundColor.b + ", 1.0)");
	    
	    ctx.fillStyle = gradient;
	    ctx.fillRect(0, 0, this._faderRight.width, this._faderRight.height);
	},
	/**
	 * Go back to bound if necessary.
	 */
	_backToBounds: function()
	{
		var boundsInfos = this._getBoundsInfos(this._view.x);
		if (boundsInfos.outsideOfBounds) {
			this._slideTo(boundsInfos.positionOfBound, this._DURATION_BACKTO_BOUND);
			return true;
		}
		return false;
	},
	/**
	 * Get bounds informations that allows caller to determine if the target is out of bounds,
	 * the direction associated, the distance to the bound and the position to reach.
	 *
	 * @parameters:
	 * 	--> nextX: the next position on x
	 */
	_getBoundsInfos: function(nextX)
	{
		var boundsInfos = {};
		boundsInfos.outsideOfBounds = false;
		
		if (nextX < 0 || nextX > this._view.sizeX) {
			boundsInfos.outsideOfBounds = true;
			if (nextX < 0) {
				boundsInfos.distanceToBound = Math.abs(nextX);
				boundsInfos.direction = 1;
				boundsInfos.positionOfBound = 0;
			} else {
				boundsInfos.distanceToBound = Math.abs(nextX - this._view.sizeX);
				boundsInfos.direction = -1;
				boundsInfos.positionOfBound = this._view.sizeX;
			}
		}
		return boundsInfos;
	},
	/**
	 * This method allows to determine if the digit selection refers to the middle cover
	 */
	_onMiddleCover: function(x, y)
	{
		var coverSize = wink.math.round((this._size * this._view.coverScale) * 1.5, 0); // depends on perspective
		var ymin = wink.math.round((this._size / 2) - (coverSize / 2) - this._view.distanceFromTop, 0);
		var xmin = wink.math.round((this._size / 2) - (coverSize / 2) + this._view.distanceToCenter, 0);
		var ymax = ymin + coverSize;
		var xmax = xmin + coverSize;
		
		if (this._displayMode)
		{
			coverSize = wink.math.round((this._size * this._view.coverScale) * 2, 0); // depends on perspective
			ymin = wink.math.round((this._size / 2) - (coverSize / 2) - (this._view.distanceFromTop / 2), 0);
			xmin = wink.math.round((this._size / 2) - (coverSize / 2) + this._view.distanceToCenter, 0);
			ymax = ymin + coverSize;
			xmax = xmin + coverSize;
		}
		
		//console.log("("+x+","+y+") on [X["+xmin+", "+xmax+"], Y["+ymin+", "+ymax+"]] ?");
		/*this.tmpNode = document.createElement('div');
		this.tmpNode.style.position = "absolute";
		this._domNode.appendChild(this.tmpNode);
		this.tmpNode.style.top = ymin + "px";
		this.tmpNode.style.left = xmin + "px";
		this.tmpNode.style.width = coverSize + "px";
		this.tmpNode.style.height = coverSize + "px";
		this.tmpNode.style.backgroundColor = "#E33";
		this.tmpNode.style.zIndex = 10;*/
		
		if (x >= xmin && x <= xmax && y >= ymin && y <= ymax)
		{
			return true;
		}
		return false;
	}
};
