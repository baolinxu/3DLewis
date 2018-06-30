$(document).ready(function(){

// detect WebGL.
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

// public variables declaration.
	var load, container;
	var camControls;
	var camera;
	var scene;
	var renderer;
	var dae;

// create clock for FirstPersonControls.
	var clock = new THREE.Clock();

// get the container div element.
	container = document.getElementById("container");

// get the load div element for displaying loading message.	
	load = document.getElementById("load");

// get the size of the container.
	var viewWidth = $("#container").width();
	var viewHeight = $("#container").height();

// create WebGL scene.
	scene = new THREE.Scene();

// create camera.
	camera = new THREE.PerspectiveCamera( 45, viewWidth / viewHeight, 0.01, 1000 );
	camera.position.set( -1.2, 0.2, 0);
	camera.lookAt( scene.position );


// ambient light.
    var ambientLight = new THREE.AmbientLight(0x545454);
    ambientLight.name='ambient';
    scene.add(ambientLight);

// directional light.
	var directionalLight = new THREE.DirectionalLight( 0xdcdcdc);
	directionalLight.name = "directional";
	directionalLight.position.x = 5;
	directionalLight.position.y = 5;
	directionalLight.position.z = 5;
	directionalLight.position.normalize();
	scene.add( directionalLight );

// hemisphere light.
 	var hemiLight = new THREE.HemisphereLight(0x000000, 0x213c4d, 0.6);
    hemiLight.position.set(0, 10, 0);
    hemiLight.name = "hemi";
    scene.add(hemiLight);

// create renderer.
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setClearColor(0x282828, 1.0);
	renderer.setSize( viewWidth, viewHeight );

// add renderer.domElement to container.
	container.appendChild( renderer.domElement );

// create colladaLoader.
	var loader = new THREE.ColladaLoader();

	loader.options.convertUpAxis = true; // convert the Z axis to Y axis.

	loader.load( './dae/interior/interior.dae', function ( collada ) {

		dae = collada.scene;
		dae.scale.set(0.001, 0.001, 0.001);
		dae.updateMatrix();

// Add the collada model to the scene.
		scene.add(dae);

// remove load html element.
		$("#load").fadeOut(2000); 

		}, function(){
// call the onProgress function. add loading message to the load div element.
	load.innerHTML = "Loading Model ...";

	});


// add camera controls.
    camControls = new THREE.FirstPersonControls(camera, container);
    camControls.lookSpeed = 0.05;
    camControls.movementSpeed = 0.4;
    camControls.noFly = true;
    camControls.lookVertical = true;
    camControls.constrainVertical = true;
    camControls.verticalMin = 1.0;
    camControls.verticalMax = 2.0;
    camControls.lon = 0;
    camControls.lat = 0;

// window resize event.
	window.addEventListener( 'resize', onWindowResize, false );


// camera button event.
	$("#cam1").on("click", function(){
		camera.position.set( -1.2, 0.2, 0);
		camera.lookAt( scene.position );
	});

	$("#cam2").on("click", function(){
		camera.position.set( -1.2, 0.4, 0);
		camera.lookAt( scene.position );
	});

	$("#cam3").on("click", function(){
		camera.position.set( -1.2, 0.55, 0);
		camera.lookAt( scene.position );
	});


// call the render function.
	render();


// function definitions.

	function render() {

	    var delta = clock.getDelta();
	    camControls.update(delta);

		requestAnimationFrame(render);
		renderer.render( scene, camera );
	}

	function onWindowResize() {
		camera.aspect = viewWidth / viewHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(viewWidth, viewHeight );
	}


});