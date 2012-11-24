// misc
function direction(a, b) {
	var dx = b.x - a.x;
	var dz = b.z - a.z;
	return Math.atan2(dz, dx);
}
function distance(a, b) {
	var dx = b.x - a.x;
	var dz = b.z - a.z;
	return Math.sqrt(dx * dx + dz * dz);
}
