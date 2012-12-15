/*global THREE: false */
/*jslint es5: true, nomen: true, vars: true, browser: true */
var scene;
var projector;
var camera;
var light;

var objectManager = new ObjectManager();
/**
 * Alias for objectManager.getByName
 * @see objectManager.getByName
 */
var $ = $ || function(name) {
	return objectManager.getByName(name);
};

var castingState = false;

var player = {
	state : 'idle',
	target : {
		x : 0,
		z : 0
	},	
	move : function (mapX, mapZ) {
		$('waypoint').position.y = 0;
		$('waypoint').position.x = mapX;
		$('waypoint').position.z = mapZ;
		
		player.state = 'moving';
		
		player.target.x = mapX;
		player.target.z = mapZ;
	},
	
	update : function () {
		if (player.state === 'moving') {
			var mech = $("mech");
			
			var dir = direction(mech.position, player.target);
			mech.rotation.y = -dir;
			mech.position.x += Math.cos(dir) * 0.2;
			mech.position.z += Math.sin(dir) * 0.2;
			
			if (distance(mech.position, player.target) <= 0.5)
			{
				player.state = 'idle';
				$('waypoint').position.y = 3;
			}
		}
	},
};

function normalisedMouseToPlane (mouseX, mouseY) {
	var
		startVector = new THREE.Vector3(),
		endVector = new THREE.Vector3(),
		dirVector = new THREE.Vector3(),
		goalVector = new THREE.Vector3(),
		t;

	startVector.set(mouseX, mouseY, -1.0);
	endVector.set(mouseX, mouseY, 1.0);

	// Convert back to 3D world coordinates
	startVector = projector.unprojectVector(startVector, camera);
	endVector = projector.unprojectVector(endVector, camera);

	// Get direction from startVector to endVector
	dirVector.sub(endVector, startVector);
	dirVector.normalize();

	// Find intersection where y = 0
	t = startVector.y / - (dirVector.y);

	// Find goal point
	goalVector.set(startVector.x + t * dirVector.x,
					startVector.y + t * dirVector.y,
					startVector.z + t * dirVector.z);
	return goalVector;
}

window.addEventListener("load", function () {
	"use strict";

	// Keyboard input
	var keyboard = new THREEx.KeyboardState();

	// Scene
	scene = new THREE.Scene();
	objectManager.setScene(scene);
	
	// Camera
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = 15;
	camera.position.y = 20;
	camera.rotation.x = -1.0;
	scene.add(camera);
	
	// point-and-click
	projector = new THREE.Projector();
	
	// Renderer
	var renderer = new THREE.WebGLRenderer();
	renderer.shadowMapEnabled	= true;
	renderer.shadowMapSoft		= true;
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// Cube (currently used as a waypoint)
	var
		geometry = new THREE.CubeGeometry(1, 1, 1),
		material = new THREE.MeshPhongMaterial({color: 0xaaaaaa}),
		blueMaterial = new THREE.MeshPhongMaterial({color: 0x5555FF});
	
	// Second cube (possible to lift up to the air)
	var pickerGeometry = new THREE.CubeGeometry(1, 1, 1);
	pickerGeometry.computeCentroids();
	var picker = new THREE.Mesh(geometry, blueMaterial);
	picker.position.y += 1;
	picker.position.x += 5;
	picker.name = 'picker';
	picker.castShadow = true;
	picker.receiveShadow = true;
	scene.add(picker);
	
	// Grass Plane
	var 
		planeGeometry = new THREE.CubeGeometry(200, 0.1, 200),
		//planeMap = THREE.ImageUtils.loadTexture("textures/grass.jpg"),
		//planeMaterial = new THREE.MeshLambertMaterial({map: planeMap }),
		planeMaterial = new THREE.MeshPhongMaterial(0x333333),
		plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.name = 'plane';
	plane.receiveShadow = true;
	scene.add(plane);
		
	objectManager.addObject("blok", "models/Blok/Blok.json", function (obj) {
		obj.position.x -= 30;
		obj.castShadow = true;
		obj.receiveShadow = true;
	});
	
	objectManager.addObject("mech", "models/TV.json", function (obj) {
		obj.position.y = 0;
		obj.castShadow = true;
		obj.receiveShadow = true;
	});
	
	objectManager.addObject("waypoint", "models/Waypoint.json", function (obj) {
		obj.position.y = 3;
		obj.castShadow = true;
		obj.receiveShadow = true;
		obj.behaviour = function () {
			obj.rotation.y -= 0.05;
		}
	});
	
	objectManager.loadObjectCInfo("rocket", "models/rocket.json", function () {
		this.rotation.y = 0;
		this.position.x += Math.cos(this.rotation.y + Math.PI * 0.5) * 0.1;
		this.position.z += Math.sin(this.rotation.y + Math.PI * 0.5) * 0.1;
	});
	
	for (var i = 0; i < 10; ++i)
	{
		setTimeout(function(){objectManager.createObjectInstance("rocket")}, i * 1000);
	};
	
	var spriteGeometry = new THREE.PlaneGeometry(10, 10);
	var mapB = THREE.ImageUtils.loadTexture( "textures/aoe.png" );
	var spriteMat = new THREE.MeshBasicMaterial({map: mapB, transparent: true });
	var sprite = new THREE.Mesh(spriteGeometry, spriteMat);
	sprite.rotation.x = -Math.PI * 0.5;
	sprite.position.y = 0.2;
	scene.add(sprite);

	light = new THREE.SpotLight( 0xffffdd, 1, 0, Math.PI, 1 );
	light.position.set(30, 30, 30);
	light.target.position.set(0, 0, 0);

	light.castShadow = true;

	light.shadowCameraNear = 20;
	light.shadowCameraFar = 100;

	light.shadowCameraVisible = true;

	// Tune if the shadows start to appear on objects
	// or appear in offset on the plane
	light.shadowBias = -0.005;
	light.shadowDarkness = 0.5;

	var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

	light.shadowMapWidth = SHADOW_MAP_WIDTH;
	light.shadowMapHeight = SHADOW_MAP_HEIGHT;

	scene.add( light );
	
	var pointLight2 = new THREE.SpotLight(0xFFaaaa);
	pointLight2.position.x = 10;
	pointLight2.position.y = 50;
	pointLight2.position.z = 130;
	//scene.add(pointLight2);
	var pointLight2 = new THREE.PointLight(0xaaaaFF);
	pointLight2.position.x = 130;
	pointLight2.position.y = 50;
	pointLight2.position.z = 130;
	//scene.add(pointLight2);

	var prevTime = Date.now();
	var curTime = Date.now();

	function render () {
		stats.begin();
		if (curTime - prevTime > 16) {
			//controls.update(); 	
			while (curTime - prevTime > 16) {
				checkKeyboard();
				player.update();
				//$('waypoint').rotation.y -= 0.05;
				prevTime += 16;
				
				objectManager.updateAll();
			}
			renderer.render(scene, camera);
			stats.end();
		}
		curTime = Date.now();
		requestAnimationFrame(render, renderer.domElement);
	} 
	
	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );
	}
	
	function checkKeyboard(event) {
		if (keyboard.pressed("W")) {
			camera.position.z -= 0.5;
		}
		if (keyboard.pressed("S")) {
			camera.position.z += 0.5;
		}
		if (keyboard.pressed("A")) {
			camera.position.x -= 0.5;
		}
		if (keyboard.pressed("D")) {
			camera.position.x += 0.5;
		}
		if (keyboard.pressed("F")) {
			window.addEventListener('click', function onWindowClick () {
				if (THREEx.FullScreen.activated()) {
					window.removeEventListener('click', onWindowClick);
				} else {
					THREEx.FullScreen.request();
				}
			});
		}
	}
	
	function testForPicking(x, y) { 
		var vector = new THREE.Vector3(x, y, 1);
		projector.unprojectVector( vector, camera );

		var ray = new THREE.Ray(camera.position, vector.subSelf( camera.position ).normalize());
		var intersects = ray.intersectObjects(scene.children, true);

		if (intersects.length > 0) {
			var target = intersects[0].object;
			if (target.name === 'picker')
				target.position.y += 0.5;
				
			if (target.name === 'plane')
				return false;
			/*if ( INTERSECTED != intersects[ 0 ].object ) {
				if ( INTERSECTED )
					INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

				INTERSECTED = intersects[ 0 ].object;
				INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
				INTERSECTED.material.emissive.setHex( 0xff0000 );
			}*/
			console.log("HIT! " + target.name);
			return true;
		} 
		else {
			console.log("missed");
			/*
			if ( INTERSECTED )
				INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

			INTERSECTED = null;
			*/
			return false;
		}
	}
	
	function onMouseMove(event) {
		if (castingState) {
			var x = event.clientX;
			var y = event.clientY;
			
			x = (x / window.innerWidth) * 2 - 1;
			y = 1 - (y / window.innerHeight) * 2;
			
			var planeTarget = normalisedMouseToPlane(x, y);
			sprite.position.x = planeTarget.x;
			sprite.position.z = planeTarget.z;
		}
	}
	
	function onMouseDown(event) {
		var x = event.clientX;
		var y = event.clientY;
		
		x = (x / window.innerWidth) * 2 - 1;
		y = 1 - (y / window.innerHeight) * 2;
		
		var planeTarget = normalisedMouseToPlane(x, y);
		
		if (event.button == 0) { // LPM
			var hitSomething = testForPicking(x, y);
			
			if (!hitSomething)
			{
				player.move(planeTarget.x, planeTarget.z);
			}
		}
		else if (event.button = 2) { // PPM
			castingState = !castingState;
			sprite.position.x = planeTarget.x;
			sprite.position.z = planeTarget.z;
		}
		return true;
	}
	
	function contextMenu(event) {
		return false;
	}
	function mouseWheel(event) {
		camera.position.y -= (event.wheelDelta / 120);
	}
			
	window.addEventListener('resize', onWindowResize);
	window.addEventListener('mousedown', onMouseDown);
	window.addEventListener('mousemove', onMouseMove);
	window.addEventListener('mousewheel', mouseWheel);
	window.oncontextmenu = contextMenu;

	var stats = new Stats();
	stats.setMode(0); // 0: fps, 1: ms
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	document.body.appendChild(stats.domElement);
	objectManager.onAllLoaded(render);
});