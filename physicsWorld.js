/**
 * @class
 */
var PhysicsWorld = function () {
	"use strict";
	/** @ignore */
	var C;

	/** @private */
	var objects = new Array();
	
	/** @private */
	var dbgDraw = false;
	
	/** @private */
	var scene;
	
	/** @private */
	var dbgMaterial, dbgMaterialActive;

	function addDbgDrawObject(obj) {
		var temp = obj.physics;
		var tempGeometry;
		if (temp.type === "circle") {
			//  radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded 
			// openended, because we are rendering wireframe
			tempGeometry = new THREE.CylinderGeometry (temp.r, temp.r, 10, 20, 20, false);
		} else if (temp.type === "aabb") {
			tempGeometry = new THREE.CubeGeometry (temp.w, 10, temp.h);
		}
		temp.dbg = new THREE.Mesh(tempGeometry, dbgMaterial);
		temp.dbg.position.y += 0.2;
		scene.add(temp.dbg);
	}
	
	/**
	 * @exports C as PhysicsWorld
	 */
	C = {
		/**
		 * Default THREE JSON loader
		 * @type {THREE}
		 */
		 
		add : function (object, physicsGeometry) {
			objects.push(object);
			object.physics = physicsGeometry;
			object.physics.collisions = {};
		
			if (dbgDraw === true) {
				addDbgDrawObject(object);
			}
		},
		
		listAllCollisions : function () {
			var ip, jp;
			for (var i = 0; i < objects.length - 1; ++i) {
				for (var j = i + 1; j < objects.length; ++j) {
					ip = objects[i].physics;
					jp = objects[j].physics;
					
					if (ip.type === "circle" && jp.type === "circle") {
						if (CollisionCircleCircle(objects[i].position.x, objects[i].position.z, ip.r,
						                          objects[j].position.x, objects[j].position.z, jp.r)) {
							
							if (dbgDraw === true) {
								ip.dbg.material = dbgMaterialActive;
								jp.dbg.material = dbgMaterialActive;
							}
							
							//ip.collisions[j] = true;
							//jp.collisions[i] = true;
						} else {
							//ip.collisions[j] = null;
							//jp.collisions[i] = null;
						
							if (dbgDraw === true) {
								ip.dbg.material = dbgMaterial;
								jp.dbg.material = dbgMaterial;
							}
						}
					}
				}
			}
		},
		
		/**
		 * Scene handle is only required if using Debug Draw
		 */
		setScene : function (s) {
			scene = s;
		},
		
		/**
		 * Turns the drawing of physics models on and off
		 */
		setDebugDraw : function (dbg) { 
			if (dbgDraw === false && dbg === true) { // turn on
				if (!scene) {
					throw new Error("physicsWorld: Can't turn debug draw without providing a scene");
				}
				
				dbgMaterial = new THREE.MeshBasicMaterial({ color: 0x11ee11, wireframe: true });
				dbgMaterialActive = new THREE.MeshBasicMaterial({ color: 0xee1111, wireframe: true });
				
				for (var i = 0; i < objects.length; ++i) {
					addDbgDrawObject(objects[i]);
				}
			} else if (dbgDraw === true && dbg === false) { // turn off
				for (var i = 0; i < objects.length; ++i) {
					scene.remove(objects[i].physics.dbg);
					delete objects[i].physics.dbg;
				}
			}
			dbgDraw = dbg;
		},
		
		/**
		 * Synchronize debug models with actual object position
		 */
		updateDebugGraphics : function () {
			if (dbgDraw) {
				for (var i = 0; i < objects.length; ++i) {
					objects[i].physics.dbg.position.x = objects[i].position.x;
					objects[i].physics.dbg.position.z = objects[i].position.z;
				}
			}
		}
	};

	return C;
};