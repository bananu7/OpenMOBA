/*global THREE: false */
/*jslint browser: true, nomen: true */
var scene;

var player = {
	state : 'idle',
	target : {
		x : 0,
		y : 0
	}
};

window.addEventListener("load", function () {
	"use strict";
	
	var keyboard = new THREEx.KeyboardState();
	
	scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
	scene.add(camera);
	
	// point-and-click
	var
		projector = new THREE.Projector(),
		p3D = new THREE.Vector3(25, 15, 9),
		p2D;

//	p2D = projector.projectVector(p3D, camera);
//	p3D = projector.unprojectVector(p2D, camera);
		
/*	var controls = new THREE.TrackballControls( camera );
	controls.target.set(0, 0, 0);
	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.0;
	controls.panSpeed = 0.8;
	controls.noZoom = false;
	controls.noPan = false;

	controls.staticMoving = false;
	controls.dynamicDampingFactor = 0.15;

	controls.keys = [ 65, 83, 68 ];*/
	
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	var geometry = new THREE.CubeGeometry(1, 1, 1);
	var material = new THREE.MeshPhongMaterial({color: 0xaaaaaa});
	var cube = new THREE.Mesh(geometry, material);
	cube.position.y += 1;
	cube.position.x += 5;
	scene.add(cube);
	
	var planeGeometry = new THREE.CubeGeometry(20, 0.1, 20);
	var plane = new THREE.Mesh(planeGeometry, material);
	scene.add(plane);

	camera.position.z = 5;
	camera.position.y = 10;
	camera.rotation.x = -1.0;
	
	/*
	var loader = new THREE.ImageLoader();
	loader.addEventListener( 'load', function ( event ) {

		texture.image = event.content;
		texture.needsUpdate = true;

	} );
	loader.load( 'textures/ash_uvgrid01.jpg' );
	*/
	
	var loader = new THREE.OBJLoader();
	var object;
	loader.addEventListener( 'load', function (event) {
		object = event.content;

		for (var i = 0, l = object.children.length; i < l; i++ ) {
			//object.children[ i ].material.map = texture;
			object.children[ i ].material = material;
		}

		object.position.y = 0;
		object.scale.x = 2;
		object.scale.y = 2;
		object.scale.z = 2;
		scene.add( object );
	});
	loader.load( 'models/tv.obj' );

	var pointLight1 = new THREE.PointLight(0xaaFFaa);
	pointLight1.position.x = 130;
	pointLight1.position.y = 50;
	pointLight1.position.z = 10;
	scene.add(pointLight1);
	var pointLight2 = new THREE.PointLight(0xFFaaaa);
	pointLight2.position.x = 10;
	pointLight2.position.y = 50;
	pointLight2.position.z = 130;
	scene.add(pointLight2);
	var pointLight2 = new THREE.PointLight(0xaaaaFF);
	pointLight2.position.x = 130;
	pointLight2.position.y = 50;
	pointLight2.position.z = 130;
	scene.add(pointLight2);

	function render () {
		//controls.update();
		checkKeyboard();
		requestAnimationFrame(render);
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
		object.rotation.y += 0.01;
		
		renderer.render(scene, camera); 
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
	}
	
	function onMouseDown(event) {
		var x = event.clientX;
		var y = event.clientY;
		
		x = ( x / window.innerWidth ) * 2 - 1;
		y = 1 - ( y / window.innerHeight ) * 2;
		
		var startVector = new THREE.Vector3(),
			endVector = new THREE.Vector3(),
			dirVector = new THREE.Vector3(),
			goalVector = new THREE.Vector3(),
			t;

		startVector.set( x, y, -1.0 );
		endVector.set( x, y, 1.0 );

		// Convert back to 3D world coordinates
		startVector = projector.unprojectVector( startVector, camera );
		endVector = projector.unprojectVector( endVector, camera );
	
		// Get direction from startVector to endVector
		dirVector.sub( endVector, startVector );
		dirVector.normalize();
		
		// Find intersection where y = 0
		t = startVector.y / - ( dirVector.y );

		// Find goal point
		goalVector.set( startVector.x + t * dirVector.x,
		startVector.y + t * dirVector.y,
		startVector.z + t * dirVector.z );
		
		cube.position.x = goalVector.x;
		cube.position.z = goalVector.z;
	}
			
	window.addEventListener( 'resize', onWindowResize);
	window.addEventListener('mousedown', onMouseDown);
	render();
});