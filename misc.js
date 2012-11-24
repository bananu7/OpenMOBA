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

var objectManager = (function () {
	"use strict";
	var objects = {},
		C,
		scene,
		toBeLoaded = 0,
		loaded = 0;

	C = {
		loaderJSON: new THREE.JSONLoader(),

		setScene: function (sc) {
			scene = sc;
		},

		addObject: function (name, path, cb) {
			if (!scene) {
				throw new Error("objectManager: Scene was not defined!");
			}
			if (!objects[name]) {
				++toBeLoaded;
				objects[name] = true; // loading
				this.loaderJSON.load(path, function (geometry, materials) {
					objects[name] = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
					scene.add(objects[name]);
					++loaded;
					if (cb && typeof cb === "function") {
						cb(objects[name]);
					}
					if (toBeLoaded === loaded) {
						C.onAllLoaded(true);
					}
				});
			} else {
				throw new Error("objectManager: Object of this name already exists!");
			}
		},

		getByName: function (name) {
			return objects[name];
		},

		removeObject: function (name) {
			if (!scene) {
				throw new Error("objectManager: Scene was not defined!");
			}
			if (objects[name]) {
				scene.remove(objects[name]);
				delete objects[name];
			}
		},
		/**
		 * Pushes back callback functions which are to be executed when all models are loaded.
		 * @param  {Function} cb [Callback function to be executed with all objects as an argument]
		 */
		onAllLoaded: (function () {
			var cbs = [];
			return function (cb) {
				if (!cb) {
					throw new Error("objectManager: No callback given!");
				}
				if (typeof cb === "function") {
					cbs.push(cb);
				}
				if (loaded && loaded === toBeLoaded) {
					for (var i = 0; i < cbs.length; ++i) {
						cbs[i](objects);
					}
					cbs.length = 0;
				}
			};
		}())
	};

	return C;
}());

var $ = function(name) {
	return objectManager.getByName(name);
};

