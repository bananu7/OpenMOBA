/*global THREE: false */
/*jslint es5: true, nomen: true, plusplus: true, vars: true, browser: true */

/**
 * @class
 */
var ObjectManager = function () {
	"use strict";
	/** @ignore */
	var C;

	/** @private */
	var objects = {};
	/**
	 * The array that holds object "construction infos", not the objects themselves.
	 * @private
	 */
	var objectCInfos = {};
	/** @private */
	var scene;
	/** @private */
	var toBeLoaded = 0;
	/** @private */
	var loaded = 0;

	/**
	 * @exports C as ObjectManager
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
		 * Loads object construction info, for objects that are instanced.
		 * Does NOT add object to the scene and neither does require present scene.
		 * @param {String}   name Object CInfo's identificator
		 * @param {String}   path Path to object's model to be loaded
		 * @param {Function} behaviour Function that becomes "Update" function of instances.
		 */
		loadObjectCInfo: function (name, path, behaviour) {
			if (!objectCInfos[name])
			{
				objectCInfos[name] = {};
				objectCInfos[name].queue = {};
				
				this.loaderJSON.load(path, function (geometry, materials) {
					objectCInfos[name] = {};
					objectCInfos[name].geometry = geometry;
					objectCInfos[name].material = new THREE.MeshFaceMaterial(materials);
					objectCInfos[name].count = 0;
					objectCInfos[name].behaviour = behaviour;
					objectCInfos[name].instances = {};
				});
			} else {
				throw new Error("objectManager: CInfo with given name already loaded");
			}
		},

		/**
		 * Instances an object from preloaded CInfo
		 * @param {String}   name Object CInfo's identifier
		 * @return {THREE.Mesh}      Reference to the created object
		 */
		 
		//* @param {Function} cb   Callback that will be run on a given instance, when it's loaded.
		createObjectInstance: function(name) {
			if (!scene) {
				throw new Error("objectManager: Scene was not defined!");
			}
			if (objectCInfos[name])
			{
				var instanceNumber = objectCInfos[name].count;
				var instance = new THREE.Mesh(objectCInfos[name].geometry, objectCInfos[name].material);
					
				if (objectCInfos[name].queue === null)
				{
					objectCInfos[name].instances[instanceNumber] = instance;
					scene.add(instance);
					instance.behaviour = objectCInfos[name].behaviour;
					
					objectCInfos[name].count += 1;
					
					return instance;
				} else {
				//	objectCInfos[name].queue .push_back(?) (instance);
				}
			} else {
				throw new Error("objectManager: No preloaded CInfo with given name exists");
			}
		},
		
		/**
		 * 
		 * @param  {String} name Object's identificator
		 * @return {THREE.Mesh}      Reference to the object
		 */
		getByName: function (name) {
			if (typeof objects[name] === "boolean") {
				throw new Error("objectManager: Object is not loaded yet! Use onAllLoaded method instead.");
			}
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
		 * Updates all objects that have defined update behaviour
		 */
		updateAll: function () {
			for (var i in objects) {
				if (objects[i].behaviour)
					objects[i].behaviour();
			}
			for (var i in objectCInfos) {
				for (var j in objectCInfos[i].instances)
					if (objectCInfos[i].instances[j].behaviour)
						objectCInfos[i].instances[j].behaviour();
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
};