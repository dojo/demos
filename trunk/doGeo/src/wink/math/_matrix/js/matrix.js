/*--------------------------------------------------------
 * Copyright © 2009 – 2010* France Telecom
 * This software is distributed under the "Simplified BSD license",
 * the text of which is available at http://www.winktoolkit.org/licence.txt
 * or see the "license.txt" file for more details.
 *--------------------------------------------------------*/

/**
 * math matrix library - a wink.math extension.
 *
 * @methods:
 * 	--> createTransformMatrix: 	Create a transformation matrix with the given css transform
 *
 * @compatibility
 *  --> Iphone OS2, Iphone OS3, Android 2.1
 *
 * @author:
 * 	--> Sylvain LALANDE
 */
wink.json.concat(wink.math,
{
	/**
	 * Creates a transformation matrix with the given css transform
	 *
	 * @parameters:
	 *	--> cssTransform: the css transform as string or WebKitCSSMatrix
	 */
	createTransformMatrix: function(cssTransform)
	{
		var matrix = new wink.math.Matrix({});
		if (wink.isset(cssTransform))
		{
			matrix.loadCssTransform(cssTransform);
		}
		return matrix;
	}
});

/**
 * Implements a matrix encapsulation object (of order 4) that is representative of a 3d transformation.
 *
 * @properties:
 * 	data =
 * 	{
 * 		values: the matrix values - array of 16 elements
 * 	}
 *
 * @methods:
 * 	--> scale: 				Apply a scale operation to the matrix.
 * 	--> translate:			Apply a translate operation to the matrix.
 * 	--> rotateAxisAngle:	Apply a rotation operation to the matrix.
 * 	--> multiply:			Multiply the current matrix by the given.
 *  --> clone:				Clones the current wink.math.Matrix
 * 	--> loadCssTransform:	Load the given transformation
 * 	--> getValues:			Returns the matrix values as an array
 * 	--> getCssMatrix:		Return the corresponding WebKitCSSMatrix
 *
 * @attributes:
 *  --> uId: unique identifier of the component
 *
 * @author:
 * 	--> Sylvain LALANDE
 */
wink.math.Matrix = function(properties)
{
	this.uId				= wink.getUId();
	this._properties		= properties;
	this._values			= [];
	this._cssMatrix			= null;
	
	if (this._validateProperties() === false) return;
	
	this._initProperties();
};

wink.math.Matrix.prototype =
{
	/**
	 * Apply a scale operation to the matrix.
	 *
	 * @parameters:
	 *	--> x: x scale component
	 *	--> y: y scale component
	 *	--> z: z scale component
	 */
	scale: function(x, y, z)
	{
		var resultMatrix = this._cssMatrix.scale(x, y, z);
		var values = this._cssMatrixToValues(resultMatrix);
		this._load(values);
	},
	/**
	 * Apply a translate operation to the matrix.
	 *
	 * @parameters:
	 *	--> x: x translation component
	 *	--> y: y translation component
	 *	--> z: z translation component
	 */
	translate: function(x, y, z)
	{
		var resultMatrix = this._cssMatrix.translate(x, y, z);
		var values = this._cssMatrixToValues(resultMatrix);
		this._load(values);
	},
	/**
	 * Apply a rotation operation to the matrix.
	 *
	 * @parameters:
	 *	--> x: x rotation component
	 *	--> y: y rotation component
	 *	--> z: z rotation component
	 *	--> angleDeg: the rotation angle in degree
	 */
	rotateAxisAngle: function(x, y, z, angleDeg)
	{
		var resultMatrix = this._cssMatrix.rotateAxisAngle(x, y, z, angleDeg);
		var values = this._cssMatrixToValues(resultMatrix);
		this._load(values);
	},
	/**
	 * Multiply the current matrix by an other one.
	 *
	 * @parameters:
	 *	--> otherWinkMatrix: the other matrix
	 */
	multiply: function(otherWinkMatrix)
	{
		var resultMatrix = this._cssMatrix.multiply(otherWinkMatrix.getCssMatrix());
		var values = this._cssMatrixToValues(resultMatrix);
		this._load(values);
	},
	/**
	 * Clones the current WinkMatrix
	 */
	clone: function()
	{
		return new wink.math.Matrix({ values: this._values });
	},
	/**
	 * Load the given transformation
	 *
	 * @parameters:
	 *	--> transformation: the css transform as string or WebKitCSSMatrix
	 */
	loadCssTransform: function(transformation)
	{
		var result = null;
		
		if (isString(transformation))
		{
			var search = "matrix3d";
			var chaine = transformation;
			var index = chaine.indexOf(search);
			if (index != -1)
			{
				var matriceS = chaine.substring((search.length + 1), (chaine.length - 1));
				var matValues = matriceS.split(", ");
				var m = [];
				for ( var i = 0; i < matValues.length; i++) {
					m[i] = matValues[i] * 1;
				}
				this._load(m);
			}
		}
		else
		{
			try {
				var values = this._cssMatrixToValues(transformation); // WebKitCSSMatrix
				this._load(values);
			} catch (e) {
				wink.log('[Matrix] Error: bad WebKitCSSMatrix');
			}
		}
	},
	/**
	 * Returns the matrix values as an array
	 */
	getValues: function()
	{
		return this._values;
	},
	/**
	 * Return the corresponding WebKitCSSMatrix
	 */
	getCssMatrix: function()
	{
		return this._cssMatrix;
	},
	/**
	 * Check if the properties are correct
	 */
	_validateProperties: function()
	{
		if (wink.isset(this._properties.values) && this._properties.values.length != 16)
		{
			wink.log('[Matrix] Error: values should be number 16');
			return false;
		}
		return true;
	},
	/**
	 * Initialize datas with given properties
	 */
	_initProperties: function()
	{
		if (wink.isset(this._properties.values))
		{
			this._load(this._properties.values);
		}
		else
		{
			this._loadIdentity();
		}
	},
	/**
	 * Load the identity matrix
	 */
	_loadIdentity: function()
	{
		this._load([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		]);
	},
	/**
	 * Load the given values
	 *
	 * @parameters:
	 *	--> values: an array of 16 matrix values
	 */
	_load: function(values)
	{
		if (!wink.isset(values) || values.length != 16)
		{
			wink.log('[Matrix] Error: values should be number 16');
			return false;
		}
		this._values = values;
		this._cssMatrix = this._valuesToCssMatrix(this._values);
	},
	/**
	 * Returns a WebKitCSSMatrix with the given array of values
	 *
	 * @parameters:
	 *	--> values: an array of 16 matrix values
	 */
	_valuesToCssMatrix: function(values)
	{
		var cssMatrix = new WebKitCSSMatrix();
		cssMatrix.m11 = values[0];
		cssMatrix.m12 = values[1];
		cssMatrix.m13 = values[2];
		cssMatrix.m14 = values[3];
		
		cssMatrix.m21 = values[4];
		cssMatrix.m22 = values[5];
		cssMatrix.m23 = values[6];
		cssMatrix.m24 = values[7];
		
		cssMatrix.m31 = values[8];
		cssMatrix.m32 = values[9];
		cssMatrix.m33 = values[10];
		cssMatrix.m34 = values[11];
		
		cssMatrix.m41 = values[12];
		cssMatrix.m42 = values[13];
		cssMatrix.m43 = values[14];
		cssMatrix.m44 = values[15];
		return cssMatrix;
	},
	/**
	 * Returns an array of values with the given WebKitCSSMatrix
	 *
	 * @parameters:
	 *	--> cssMatrix: the WebKitCSSMatrix
	 */
	_cssMatrixToValues: function(cssMatrix)
	{
		var values = [];
		values[0] = cssMatrix.m11;
		values[1] = cssMatrix.m12;
		values[2] = cssMatrix.m13;
		values[3] = cssMatrix.m14;
		
		values[4] = cssMatrix.m21;
		values[5] = cssMatrix.m22;
		values[6] = cssMatrix.m23;
		values[7] = cssMatrix.m24;
		
		values[8] = cssMatrix.m31;
		values[9] = cssMatrix.m32;
		values[10] = cssMatrix.m33;
		values[11] = cssMatrix.m34;
		
		values[12] = cssMatrix.m41;
		values[13] = cssMatrix.m42;
		values[14] = cssMatrix.m43;
		values[15] = cssMatrix.m44;
		return values;
	}
};