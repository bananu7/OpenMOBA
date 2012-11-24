/*global THREE: false */
/*jslint es5: true, nomen: true, vars: true, browser: true */
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

var objectManager = (function () {
	"use strict";
	var objects = {},
		C,
		scene;

	C = {
		loaderJSON: new THREE.JSONLoader(),

		setScene: function (sc) {
			scene = sc;
		},

		addObject: function (name, path, cb) {
			if (!scene) {
				throw new Error("Scene was not defined!");
			}
			if (!objects[name]) {
				this.loaderJSON.load(path, function (geometry, materials) {
					objects[name] = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
					scene.add(objects[name]);
					if (cb && typeof cb === "function") {
						cb(objects[name]);
					}
				});
			} else {
				throw new Error("Object of this name already exists!");
			}
		},

		getByName: function (name) {
			return objects[name];
		},

		removeObject: function (name) {
			if (!scene) {
				throw new Error("Scene was not defined!");
			}
			if (objects[name]) {
				scene.remove(objects[name]);
				delete objects[name];
			}
		}
	};

	return C;
}());

var $ = function(name) {
	return objectManager.getByName(name);
};

