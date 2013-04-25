/*--------------------------------------------------------
 * Copyright © 2009 – 2010* France Telecom
 * This software is distributed under the "Simplified BSD license",
 * the text of which is available at http://www.winktoolkit.org/licence.txt
 * or see the "license.txt" file for more details.
 *--------------------------------------------------------*/

/**
 * math geometric library - a wink.math extension.
 *
 * @methods:
 * 	--> radToDeg: 				Convert the given radian angle in degree
 * 	--> degToRad: 				Convert the given degree angle in radian
 * 	--> getAngle: 				Returns the angle corresponding to the distance between two points on a plane cutting a virtual sphere
 * 	--> getAngleBetweenVectors: Returns the angle between two vectors
 * 	--> normalizeVector: 		Returns the normalized vector from the given
 * 	--> getNormVector: 			Returns the norm of the given vector
 * 	--> getNormalVector: 		Returns the normal vector formed by these two vectors
 * 	--> getScalarVector: 		Returns the scalar value of these two vectors
 * 	--> getVector: 				Returns a vector with the given two points
 * 	--> multiplyMatrixVector: 	Returns the vector result of the multiplication between the matrix and this vector
 *
 * @compatibility
 *  --> Iphone OS2, Iphone OS3, Android 1.1, Android 1.5, Android 2.1
 *
 * @author:
 * 	--> Sylvain LALANDE
 */
wink.json.concat(wink.math,
{
	/**
	 * Converts the given radian angle in degree
	 *
	 * @parameters:
	 *	--> angleRad: the angle in radian
	 */
	radToDeg: function(angleRad)
	{
		return angleRad * 180 / Math.PI;
	},
	/**
	 * Converts the given degree angle in radian
	 *
	 * @parameters:
	 *	--> angleDeg: the angle in degree
	 */
	degToRad: function(angleDeg)
	{
		return angleDeg * Math.PI / 180;
	},
	/**
	 * Returns the angle corresponding to the distance between two points on a plane cutting a virtual sphere
	 *
	 * @parameters:
	 *	--> radius: the radius of the virtual sphere
	 *	--> distance: the distance between the two points
	 */
	getAngle: function(radius, distance)
	{
		var d = Math.abs(distance);
		if (d > (radius * 2))
		{
			d = (radius * 2);
		}

		// Al-Kashi theorem
		var a = Math.pow(d, 2);
		var b = (Math.pow(radius, 2) + Math.pow(radius, 2));
		var c = 2 * radius * radius;
		var cosinusAngle = -((a - b) / c);
		var angleRad = Math.acos(cosinusAngle);
		if (isNaN(angleRad))
		{
			angleRad = 0;
		}
		return angleRad;
	},
	/**
	 * Returns the angle between two vectors
	 *
	 * @parameters:
	 *	--> u: first vector
	 *	--> v: second vector
	 */
	getAngleBetweenVectors: function(u, v)
	{
		var scalar = this.getScalarVector(u, v);
		var norms = this.getNormVector(u) * this.getNormVector(v);
		var cosAngle = scalar / norms;

		var angleRad = Math.acos(cosAngle);
		if (isNaN(angleRad)) {
			angleRad = 0;
		}
		return angleRad;
	},
	/**
	 * Returns the normalized vector from the given
	 *
	 * @parameters:
	 *	--> u: the vector to normalize
	 */
	normalizeVector: function(u)
	{
		var result = [ 0, 0, 0, 1 ];
		var norm = this.getNormVector(u);
		
        if (norm <= 0)
        {
        	return result;
        }
		result[0] = u[0] / norm;
		result[1] = u[1] / norm;
		result[2] = u[2] / norm;
		return result;
	},
	/**
	 * Returns the norm of the given vector
	 *
	 * @parameters:
	 *	--> u: the vector
	 */
	getNormVector: function(u)
	{
		var result = u[0] * u[0] + u[1] * u[1] + u[2] * u[2];
		result = Math.sqrt(result);
		return result;
	},
	/**
	 * Returns the normal vector formed by these two vectors
	 *
	 * @parameters:
	 *	--> u: first vector
	 *	--> v: second vector
	 */
	getNormalVector: function(u, v)
	{
		var vector = [ 0, 0, 0, 1 ];
		vector[0] = (u[1] * v[2]) - (u[2] * v[1]);
		vector[1] = (u[2] * v[0]) - (u[0] * v[2]);
		vector[2] = (u[0] * v[1]) - (u[1] * v[0]);
		return vector;
	},
	/**
	 * Returns the scalar value of these two vectors
	 *
	 * @parameters:
	 *	--> u: first vector
	 *	--> v: second vector
	 */
	getScalarVector: function(u, v)
	{
		var scalar = 0;
		scalar = u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
		return scalar;
	},
	/**
	 * Returns a vector with the given two points
	 *
	 * @parameters:
	 *	--> p1: the first point
	 *	--> p2: the second point
	 */
	getVector: function(p1, p2)
	{
		var vector = [ 0, 0, 0, 1 ];
		vector[0] = p2[0] - p1[0];
		vector[1] = p2[1] - p1[1];
		vector[2] = p2[2] - p1[2];
		return vector;
	},
	/**
	 * Returns the vector result of the multiplication between a matrix and a vector
	 *
	 * @parameters:
	 *	--> matrix: the matrix
	 *	--> vector: the vector
	 */
	multiplyMatrixVector: function(matrix, vector)
	{
		var result = [ 0, 0, 0, 1 ];
		if (!vector[3])
		{
			vector[3] = 1;
		}
		result[0] = vector[0] * matrix[0] + vector[1] * matrix[1] + vector[2] * matrix[2] + vector[3] * matrix[3];
		result[1] = vector[0] * matrix[4] + vector[1] * matrix[5] + vector[2] * matrix[6] + vector[3] * matrix[7];
		result[2] = vector[0] * matrix[8] + vector[1] * matrix[9] + vector[2] * matrix[10] + vector[3] * matrix[11];
		result[3] = vector[0] * matrix[12] + vector[1] * matrix[13] + vector[2] * matrix[14] + vector[3] * matrix[15];
		return result;
	}
});