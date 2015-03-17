/**
 * A module that documents all types in the library.
 * @module types
 */

/**
 * A 1D js array of numbers that has non-zero length.
 * @typedef module:types.Vector
 */

/**
 * A 2D js array of numbers that: 1) has non-zero number of rows.
 * (mat.length > 0). 2) has consistent non-zero column
 * length. (mat[0].length === mat[1].length ... === mat[m-1].length >
 * 0)
 * @typedef module:types.Matrix
 */

/**
 * An array of positive integers.
 * @typedef module:types.Connectivity
 */

/**
 * A {@link module:types.Matrix} of positive integers. Each row of the
 * matrix is a {@link module:types.Connectivity}.
 * @typedef module:types.ConnectivityList
 */
