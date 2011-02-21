/*--------------------------------------------------------
 * Copyright © 2009 – 2010* France Telecom
 * This software is distributed under the "Simplified BSD license",
 * the text of which is available at http://www.winktoolkit.org/licence.txt
 * or see the "license.txt" file for more details.
 *--------------------------------------------------------*/

/**
 * The 3d fx object is an extension of wink.fx (2d fx) that allows more advanced transformations (e.g.: simple or composed 3d transformations).
 * Because a change of scale followed by a translation does not give the same result if you reverse the two transformations,
 * the main role is to simplify the implementation of composed transformations, it is made by using a user-defined order.
 *
 * A 3d fx transformation is defined as :
 * 		transformation: {
 * 			type: value in { "translate", "scale", "rotate" }
 * 			x: x transformation component
 * 			y: y transformation component
 * 			z: z transformation component
 * 			[angle: rotation angle ]
 * 		}
 *
 * @methods:
 * 	--> set3dTransform:				Apply to the given node a xyz transformation
 * 	--> initComposedTransform:		Initialize a composed transformation to the given node
 * 	--> setTransformPart:			Set a composed transformation part at the given index (order of transformations is important)
 * 	--> applyComposedTransform:		Apply a composed transformation to the node
 *  --> storeComposedTransform:		Store all the composed transformation parts in one to optimize
 *  --> removeComposedTransform:	Close the composed transformation associated to the given node
 *
 * @dependencies:
 * 	--> wink.math._matrix
 *
 * @compatibility:
 * 	--> Iphone OS2, Iphone OS3
 *
 * @author:
 * 	--> Sylvain LALANDE
 */
wink.json.concat(wink.fx,
{
	_nodeTransforms: [],
	
	/**
	 * Apply to the given node a 3dfx transformation
	 *
	 * @parameters:
	 *	--> node: the node that hosts the transformation
	 *	--> transformation: the 3dfx transformation
	 *	--> keepCurrent: true if the previous node transformation must be kept
	 */
	set3dTransform: function(node, transformation, keepCurrent)
	{
		if (!this._is3dfxTransformation(transformation))
		{
			wink.log('[3dfx] Invalid transformation : check type, x, y, z, angle parameters');
			return false;
		}
		var cssTransform;
		if (keepCurrent === true)
		{
			cssTransform = wink.fx.getTransform(node);
		}
		var referenceMatrix = wink.math.createTransformMatrix(cssTransform);
		var matrixTransform = this._getTransformMatrix(transformation);
		referenceMatrix.multiply(matrixTransform);
		
		wink.fx.setTransform(node, referenceMatrix.getCssMatrix());
	},
	/**
	 * Initialize a composed transformation to the given node
	 *
	 * @parameters:
	 *	--> node: the node that hosts the composed transformation
	 *	--> keepCurrent: true if the previous node transformation must be kept
	 */
	initComposedTransform: function(node, keepCurrent)
	{
		var cssTransform;
		if (keepCurrent === true)
		{
			cssTransform = wink.fx.getTransform(node);
		}
		var referenceMatrix = wink.math.createTransformMatrix(cssTransform);
		this.removeComposedTransform(node); // to ensure unicity
		this._nodeTransforms.push({ node: node, transforms: [ referenceMatrix ] });
	},
	/**
	 * Set a composed transformation part at the given index
	 *
	 * @parameters:
	 *	--> node: the node that hosts the composed transformation
	 *	--> index: the index of the given transformation part
	 *	--> transformation: the 3dfx transformation
	 */
	setTransformPart: function(node, index, transformation)
	{
		if (!this._is3dfxTransformation(transformation))
		{
			wink.log('[3dfx] Invalid transformation : check type, x, y, z, angle parameters');
			return false;
		}
		if (index < 1 || index > 10)
		{
			wink.log('[3dfx] Invalid transformation index : 0 is reserved, 10 is the max');
			return false;
		}
		for (var i = 0; i < this._nodeTransforms.length; i++)
		{
			if (this._nodeTransforms[i].node == node)
			{
				var toSet = null;
				if (wink.isset(transformation))
				{
					toSet = this._getTransformMatrix(transformation);
				}
				this._nodeTransforms[i].transforms[index] = toSet;
				break;
			}
		}
	},
	/**
	 * Apply a composed transformation to the node
	 *
	 * @parameters:
	 *	--> node: the node that hosts the composed transformation
	 *	--> store: indicates if transformation parts must be stored in only one
	 */
	applyComposedTransform: function(node, store)
	{
		for (var i = 0; i < this._nodeTransforms.length; i++)
		{
			if (this._nodeTransforms[i].node == node)
			{
				var transforms = this._nodeTransforms[i].transforms;
				var finalMatrix = transforms[0].clone();
				for (var j = 1; j < transforms.length; j++)
				{
					if (wink.isset(transforms[j]))
					{
						finalMatrix.multiply(transforms[j]);
					}
				}
				if (store === true)
				{
					this._nodeTransforms[i].transforms = [ finalMatrix ];
				}
				wink.fx.setTransform(node, finalMatrix.getCssMatrix());
				break;
			}
		}
	},
	/**
	 * Store all the composed transformation parts in one to enhance performance
	 *
	 * @parameters:
	 *	--> node: the node that hosts the composed transformation
	 */
	storeComposedTransform: function(node)
	{
		this.applyComposedTransform(node, true);
	},
	/**
	 * Close the composed transformation associated to the given node
	 *
	 * @parameters:
	 *	--> node: the node that hosts the composed transformation
	 */
	removeComposedTransform: function(node)
	{
		for (var i = 0; i < this._nodeTransforms.length; i++)
		{
			if (this._nodeTransforms[i].node == node)
			{
				this._nodeTransforms.splice(i, 1);
				break;
			}
		}
	},
	/**
	 * Check the validity of the given 3dfx transformation
	 *
	 * @parameters:
	 *	--> transformation: the transformation to check
	 */
	_is3dfxTransformation: function(transformation)
	{
		var validTransformation = true;
		
		if (wink.isset(transformation))
		{
			var knownTypes = [ "translate", "scale", "rotate" ];
			validTransformation = validTransformation && wink.isset(transformation.type);
			validTransformation = validTransformation && (knownTypes.indexOf(transformation.type) != -1);
			validTransformation = validTransformation && wink.isset(transformation.x);
			validTransformation = validTransformation && wink.isset(transformation.y);
			validTransformation = validTransformation && wink.isset(transformation.z);
			if (validTransformation && transformation.type == "rotate")
			{
				validTransformation = validTransformation && wink.isset(transformation.angle);
			}
		}
		return validTransformation;
	},
	/**
	 * Returns the associated matrix of the given 3dfx transformation
	 *
	 * @parameters:
	 *	--> transformation: the 3dfx transformation
	 */
	_getTransformMatrix: function(transformation)
	{
		var matrix = wink.math.createTransformMatrix();
		
		switch (transformation.type)
		{
			case "translate":
				matrix.translate(transformation.x, transformation.y, transformation.z);
				break;
			case "scale":
				matrix.scale(transformation.x, transformation.y, transformation.z);
				break;
			case "rotate":
				matrix.rotateAxisAngle(transformation.x, transformation.y, transformation.z, transformation.angle);
				break;
		}
		return matrix;
	}
});
