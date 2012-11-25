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

/**
 * @class
 */
var objectManager = (function () {
	"use strict";
	/** @ignore */
	var C;

	/** @private */
	var objects = {};
	/** @private */
	var scene;
	/** @private */
	var toBeLoaded = 0;
	/** @private */
	var loaded = 0;

	/**
	 * @exports C as objectManager
	 */
	C = {
		/**
		 * Default THREE JSON loader
		 * @type {THREE}
		 */
		loaderJSON: new THREE.JSONLoader(),

		/**
		 * Sets scene for the objects to be added to
		 * @param {THREE.Scene} sc Scene
		 */
		setScene: function (sc) {
			scene = sc;
		},

		/**
		 * Adds object to the manager and tries to load it. When it's loaded, executes callback cb.
		 * @param {String}   name Object's identificator
		 * @param {String}   path Path to object's model to be loaded
		 * @param {Function} cb   Callback executed after the model is loaded with this object as an argument.
		 */
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

		/**
		 * 
		 * @param  {String} name Object's identificator
		 * @return {THREE.Mesh}      Reference to the object
		 */
		getByName: function (name) {
			return objects[name];
		},

		/**
		 * Removed object of given identificator from scene and from object manager
		 * @param  {String} name Object's identificator
		 */
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
		 * @param  {Function} cb Callback function to be executed with all objects as an argument
		 * @function
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

/**
 * Alias for objectManager.getByName
 * @see objectManager.getByName
 */
var $ = $ || function(name) {
	return objectManager.getByName(name);
};

