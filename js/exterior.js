$(document).ready(function(){

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var load, container;
var trackballControls;
var camera;
var scene;
var renderer;
var sketchup;
var roof, fins, north, south, glazing, plates, stair, columns, base, existing;

// create clock for trackballControls. 
	var clock = new THREE.Clock();

// get the container for domElement.
	container = document.getElementById("container");
	load = document.getElementById("load");

// get the size of the container.
	var viewWidth = $("#container").width();
	var viewHeight = $("#container").height();

// create THREE scene.
	scene = new THREE.Scene();

// create THREE camera.
	camera = new THREE.PerspectiveCamera( 45, viewWidth / viewHeight, 0.01, 1000 );
	camera.position.set(-2, 2, 2);
	camera.lookAt( scene.position );

// add grid
	var size = 10;
	var step = 1;

	var gridHelper = new THREE.GridHelper( size, step );
	gridHelper.setColors(0x545454, 0x545454);
	scene.add( gridHelper );	

// create ambient light.
    var ambientLight = new THREE.AmbientLight(0x545454);
    ambientLight.name='ambient';
    scene.add(ambientLight);

// create directional light1.
	var directionalLight = new THREE.DirectionalLight( 0xdcdcdc);
	directionalLight.name = "directional";
	directionalLight.position.x = 5;
	directionalLight.position.y = 5;
	directionalLight.position.z = 5;
	directionalLight.position.normalize();
	scene.add( directionalLight );

// create directional light2.
	var directionalLight = new THREE.DirectionalLight( 0xdcdcdc, 0.3);
	directionalLight.name = "directional";
	directionalLight.position.x = -5;
	directionalLight.position.y = 5;
	directionalLight.position.z = -5;
	directionalLight.position.normalize();
	scene.add( directionalLight );


// create hemisphere light.
 	var hemiLight = new THREE.HemisphereLight(0x000000, 0x213c4d, 0.6); // adjust the color.
    hemiLight.position.set(0, 10, 0);
    hemiLight.name = "hemi";
    scene.add(hemiLight);

// create THREE WebGLRenderer.
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio ); // optional.
	renderer.setClearColor(0x282828, 1.0); // set the background color.
	renderer.setSize( viewWidth, viewHeight );
	container.appendChild( renderer.domElement );



// create collada loader.
	var loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis = true; // convert the Z axis to Y axis.
	loader.load( './dae/exterior/lewis.dae', function ( collada ) {

		sketchup = collada.scene.children[0]; // the collada.scene will be a group in the WebGL scene.
		sketchup.scale.set(0.001, 0.001, 0.001);
		sketchup.updateMatrix(); // update matrix for transformation.

// make existing invisible at the beginning.
		sketchup.children[3].visible = false;


// filtering click event.
	$("#roof").on("click", function(){
		if(sketchup.children[5].visible == true) {
			sketchup.children[5].visible = false;
		}else{
			sketchup.children[5].visible = true;		
		}

	});

	$("#fins").on("click", function(){
		if(sketchup.children[8].visible == true) {
			sketchup.children[8].visible = false;
		}else{
			sketchup.children[8].visible = true;		
		}
	});

	$("#north").on("click", function(){
		if(sketchup.children[6].visible == true) {
			sketchup.children[6].visible = false;
		}else{
			sketchup.children[6].visible = true;		
		}
	});

	$("#south").on("click", function(){
		if(sketchup.children[7].visible == true) {
			sketchup.children[7].visible = false;
		}else{
			sketchup.children[7].visible = true;		
		}
	});

	$("#glazing").on("click", function(){
		if(sketchup.children[1].visible == true) {
			sketchup.children[1].visible = false;
		}else{
			sketchup.children[1].visible = true;		
		}
	});

	$("#plates").on("click", function(){
		if(sketchup.children[9].visible == true) {
			sketchup.children[9].visible = false;
		}else{
			sketchup.children[9].visible = true;		
		}
	});

	$("#stair").on("click", function(){
		if(sketchup.children[2].visible == true) {
			sketchup.children[2].visible = false;
		}else{
			sketchup.children[2].visible = true;		
		}
	});

	$("#columns").on("click", function(){
		if(sketchup.children[0].visible == true) {
			sketchup.children[0].visible = false;
		}else{
			sketchup.children[0].visible = true;		
		}
	});

	$("#base").on("click", function(){
		if(sketchup.children[4].visible == true) {
			sketchup.children[4].visible = false;
		}else{
			sketchup.children[4].visible = true;		
		}
	});

	$("#existing").on("click", function(){
		if(sketchup.children[3].visible == true) {
			sketchup.children[3].visible = false;
		}else{
			sketchup.children[3].visible = true;		
		}
	});

	$("#all").on("click", function(){

			sketchup.children.forEach(function(each) {
				each.visible = true;
				});	
	});




// explode and unexplode.

	columns = sketchup.children[0];
	glazing = sketchup.children[1];
	stair = sketchup.children[2];
	existing = sketchup.children[3];
	base = sketchup.children[4];
	roof = sketchup.children[5];
	north = sketchup.children[6];
	south = sketchup.children[7];
	fins = sketchup.children[8];
	plates = sketchup.children[9];



	var count = 0; // original count == 0, when count == 0, explode, when count == 1, unexplode.

	$("#explode").on("click", function(){

		if(count == 0) {

			new TWEEN.Tween(columns.position).to(

				{x:columns.position.x,
					y:columns.position.y+1500,
					z:columns.position.z}, 2000 ).easing(TWEEN.Easing.Sinusoidal.InOut).start();

			new TWEEN.Tween(roof.position).to(

				{x:roof.position.x,
					y:roof.position.y+600,
					z:roof.position.z}, 2000 ).easing(TWEEN.Easing.Sinusoidal.InOut).start();

			new TWEEN.Tween(north.position).to(

				{x:north.position.x,
					y:north.position.y,
					z:north.position.z-700}, 2000 ).easing(TWEEN.Easing.Sinusoidal.InOut).start();

			new TWEEN.Tween(south.position).to(

				{x:south.position.x,
					y:south.position.y,
					z:south.position.z+700}, 2000 ).easing(TWEEN.Easing.Sinusoidal.InOut).start();

			new TWEEN.Tween(fins.position).to(

				{x:fins.position.x,
					y:fins.position.y+400,
					z:fins.position.z}, 2000 ).easing(TWEEN.Easing.Sinusoidal.InOut).start();

			new TWEEN.Tween(plates.position).to(

				{x:plates.position.x,
					y:plates.position.y,
					z:plates.position.z}, 2000 ).easing(TWEEN.Easing.Sinusoidal.InOut).start();																																	

			count ++;



		}else{
			null;
		}
	});


	$("#unexplode").on("click", function(){

		if(count == 0) {
			null;
		}else{


			new TWEEN.Tween(columns.position).to(

				{x:columns.position.x,
					y:columns.position.y-1500,
					z:columns.position.z}, 2000 ).easing(TWEEN.Easing.Sinusoidal.InOut).start();

			new TWEEN.Tween(roof.position).to(

				{x:roof.position.x,
					y:roof.position.y-600,
					z:roof.position.z}, 2000 ).easing(TWEEN.Easing.Sinusoidal.InOut).start();

			new TWEEN.Tween(north.position).to(

				{x:north.position.x,
					y:north.position.y,
					z:north.position.z+700}, 2000 ).easing(TWEEN.Easing.Sinusoidal.InOut).start();

			new TWEEN.Tween(south.position).to(

				{x:south.position.x,
					y:south.position.y,
					z:south.position.z-700}, 2000 ).easing(TWEEN.Easing.Sinusoidal.InOut).start();

			new TWEEN.Tween(fins.position).to(

				{x:fins.position.x,
					y:fins.position.y-400,
					z:fins.position.z}, 2000 ).easing(TWEEN.Easing.Sinusoidal.InOut).start();

			new TWEEN.Tween(plates.position).to(

				{x:plates.position.x,
					y:plates.position.y,
					z:plates.position.z}, 2000 ).easing(TWEEN.Easing.Sinusoidal.InOut).start();																																	


			count --;
		}

	});



		$("#load").fadeOut(2000); // remove load html element.

		scene.add(sketchup);
		console.log(columns); // check the level of sketchUp Object3D.




	}, function(){

	load.innerHTML = "Loading Model ...";
	});

// onProgress function. Add loading model in the load html element.






// show grid or hide grid.
	$("#grid").on("click", function(){
		if(gridHelper.visible == true) {
			gridHelper.visible = false;
		}else{
			gridHelper.visible = true;		
		}
	});





// add camera controls.
    trackballControls = new THREE.TrackballControls(camera, renderer.domElement); // the second argument defines the control area.
    trackballControls.rotateSpeed = 0.6;
    trackballControls.zoomSpeed = 0.4;
    trackballControls.panSpeed = 0.4;
	//trackballControls.noZoom=false;
	//trackballControls.noPan=false;
	//trackballControls.staticMoving = true;
	//trackballControls.dynamicDampingFactor=0.3;

// call onWindowResize function on window event.
	window.addEventListener( 'resize', onWindowResize, false );


// switch camera event.
	$("#cam1").on("click", function(){
	camera.position.set( -2, 0.5, 2);
	camera.lookAt( scene.position );
	});

	$("#cam2").on("click", function(){
	camera.position.set( 2, 0.5, -2);
	camera.lookAt( scene.position );
	});

	$("#cam3").on("click", function(){
	camera.position.set( -2, 0.5, -2);
	camera.lookAt( scene.position );
	});

	$("#cam4").on("click", function(){
	camera.position.set( -2, 2, 2);
	camera.lookAt( scene.position );
	});





// call the render function.
	render();



// function definitions.
	function render() {

		TWEEN.update(); // tween update.

	    var delta = clock.getDelta();
	    trackballControls.update(delta);

		requestAnimationFrame(render);
		renderer.render( scene, camera );
	}


	function onWindowResize() {
		camera.aspect = viewWidth / viewHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(viewWidth, viewHeight );
	}



});