/**
 * @class
 */
var PhysicsWorld = function () {
	"use strict";
	/** @ignore */
	var C;

	/** @private */
	var objects = {};
	
	/** @private */
	var objectCount = 0;
	
	/** @private */
	var dbgDraw = false;

	/**
	 * @exports C as PhysicsWorld
	 */
	C = {
		/**
		 * Default THREE JSON loader
		 * @type {THREE}
		 */
		add : function (object) {
			object.physicsId = objectCount++;
			objects[object.physicsId] = object
		}
		
		updateGraphics : function () {
			for (i in objects) {
				objects[i].position.x = objects[i].physics.x;
				objects[i].position.z = objects[i].physics.y;
			}
		}
		
		setDebugDraw : function (dbg) { 
			if (dbgDraw === false && dbg === true) {
				var tempGeometry, temp;
				var tempMaterial = new THREE.MeshBasicMaterial({ color: 0x11ff11, wireframe: true });
				for (i in objects) {
					temp = objects[i].physics;
					if (temp.type === "circle") {
						//  radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded 
						// openended, because we are rendering wireframe
						tempGeometry = new THREE.CylinderGeometry (temp.r, temp.r, 10, 20, 20, true);
					} else if (temp.type === "aabb" {
						tempGeometry = new THREE.CubeGeometry (w, 10, h);
					}
					temp.dbg = new THREE.Mesh(tempGeometry, tempMaterial);
				}
			}
			dbgDraw = dbg;
		}

		remove : function 
	};

	return C;
};