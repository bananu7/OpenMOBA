/*global THREE: false */
/*jslint es5: true, nomen: true, plusplus: true, vars: true, browser: true */

function direction(a, b) {
	"use strict";
	var dx,
		dz;

	dx = b.x - a.x;
	dz = b.z - a.z;
	return Math.atan2(dz, dx);
}

function distance(a, b) {
	"use strict";
	var dx,
		dz;

	dx = b.x - a.x;
	dz = b.z - a.z;
	return Math.sqrt(dx * dx + dz * dz);
}
