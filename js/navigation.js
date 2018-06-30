$(document).ready(function(){

// detect the webgl.
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

// declare public variables.
var load, container;
var trackballControls;

var camera;
var scene;
var renderer;
var sketchup;
var floor1_wall, floor1_rooms, floor2_wall, floor2_rooms, floor3_wall, floor3_rooms, floor4_wall, floor4_rooms;
var wall1_instance, rooms1_instance, wall2_instance, rooms2_instance, wall3_instance, rooms3_instance, wall4_instance, rooms4_instance;

// create clock for trackballControls.
	var clock = new THREE.Clock();

// get the div container.
	container = document.getElementById("container");

// get the load message div.
	load = document.getElementById("load");

// get the size of the container.
	var viewWidth = $("#container").width();
	var viewHeight = $("#container").height();

// create webgl scene.
	scene = new THREE.Scene();

// create webgl camera.
	camera = new THREE.PerspectiveCamera( 45, viewWidth / viewHeight, 0.001, 5000 );
	camera.position.set( 5, 3, 3); // adjust the distance to the model.
	camera.lookAt( scene.position ); // try to change the postion.


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
 	var hemiLight = new THREE.HemisphereLight(0x000000, 0x213c4d, 0.6); // adjust the color.
    hemiLight.position.set(0, 10, 0);
    hemiLight.name = "hemi";
    scene.add(hemiLight);

// create webgl renderer.
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio ); // ??????
	renderer.setClearColor(0x282828, 1.0);
	renderer.setSize( viewWidth, viewHeight );

// add renderer.domElement to container.	
	container.appendChild( renderer.domElement );


// create colladaLoader.
var loader = new THREE.ColladaLoader();

	loader.options.convertUpAxis = true; // convert the Z axis to Y axis.

	loader.load( './dae/navigation/navigation_legend.dae', function ( collada ) {

		sketchup = collada.scene.children[0];
		sketchup.scale.set(0.001, 0.001, 0.001); // the units of the model is in inch.
		sketchup.updateMatrix();



	floor2_wall = sketchup.children[0].children[0];
	floor2_rooms = sketchup.children[1].children[0];

	floor4_wall = sketchup.children[2].children[0];
	floor4_rooms = sketchup.children[3].children[0];

	floor3_wall = sketchup.children[4].children[0];
	floor3_rooms = sketchup.children[5].children[0];

	floor1_wall = sketchup.children[6].children[0];
	floor1_rooms = sketchup.children[7].children[0];






// ----------- floor visibility options ---------------

	$("#floor1").on("click", function(){

		if(floor1_wall.visible == true){
			floor1_wall.visible = false;
		}else{
			floor1_wall.visible = true;
		}

		if(floor1_rooms.visible == true){
			floor1_rooms.visible = false;
		}else{
			floor1_rooms.visible = true;
		}

	});


	$("#floor2").on("click", function(){

		if(floor2_wall.visible == true){
			floor2_wall.visible = false;
		}else{
			floor2_wall.visible = true;
		}

		if(floor2_rooms.visible == true){
			floor2_rooms.visible = false;
		}else{
			floor2_rooms.visible = true;
		}

	});

	$("#floor3").on("click", function(){

		if(floor3_wall.visible == true){
			floor3_wall.visible = false;
		}else{
			floor3_wall.visible = true;
		}

		if(floor3_rooms.visible == true){
			floor3_rooms.visible = false;
		}else{
			floor3_rooms.visible = true;
		}

	});

	$("#floor4").on("click", function(){

		if(floor4_wall.visible == true){
			floor4_wall.visible = false;
		}else{
			floor4_wall.visible = true;
		}

		if(floor4_rooms.visible == true){
			floor4_rooms.visible = false;
		}else{
			floor4_rooms.visible = true;
		}

	});










// --------- change floor layout. stack or unstack ------------

	wall2_instance = sketchup.children[0];
	rooms2_instance = sketchup.children[1];

	wall4_instance = sketchup.children[2];
	rooms4_instance = sketchup.children[3];

	wall3_instance = sketchup.children[4];
	rooms3_instance = sketchup.children[5];

	wall1_instance = sketchup.children[6];
	rooms1_instance = sketchup.children[7];


// console.log() instance position. check the instance position for calculating offset for tweening.

	console.log(wall1_instance.position);
	console.log(rooms1_instance.position);
	console.log(wall2_instance.position);
	console.log(rooms2_instance.position);
	console.log(wall3_instance.position);
	console.log(rooms3_instance.position);
	console.log(wall4_instance.position);
	console.log(rooms4_instance.position);


// tween the transition. Don't forget to add TWEEN.update() in render function.

	var count = 0; // original count == 0, when count == 0, unstack, when count == 1, stack.

	$("#unstack").on("click", function(){
		if(count == 0) {

			new TWEEN.Tween(wall1_instance.position).to(

				{x:wall1_instance.position.x + 2000,
					y:0,
					z:wall1_instance.position.z}, 2000 ).easing(TWEEN.Easing.Sinusoidal.InOut).start();

			new TWEEN.Tween(rooms1_instance.position).to(

				{x:rooms1_instance.position.x + 2000,
					y:0,
					z:rooms1_instance.position.z}, 2000 ).easing(TWEEN.Easing.Sinusoidal.InOut).start();


			new TWEEN.Tween(wall3_instance.position).to(

				{x:wall3_instance.position.x - 2000,
					y:0,
					z:wall3_instance.position.z}, 2000 ).easing(TWEEN.Easing.Sinusoidal.InOut).start();

			new TWEEN.Tween(rooms3_instance.position).to(

				{x:rooms3_instance.position.x - 2000,
					y:0,
					z:rooms3_instance.position.z}, 2000 ).easing(TWEEN.Easing.Sinusoidal.InOut).start();


			new TWEEN.Tween(wall4_instance.position).to(

				{x:wall4_instance.position.x - 4000,
					y:0,
					z:wall4_instance.position.z}, 2000 ).easing(TWEEN.Easing.Sinusoidal.InOut).start();

			new TWEEN.Tween(rooms4_instance.position).to(

				{x:rooms4_instance.position.x - 4000,
					y:0,
					z:rooms4_instance.position.z}, 2000 ).easing(TWEEN.Easing.Sinusoidal.InOut).start();

			count ++;

		}else{
			null;
		}

	});



	$("#stack").on("click", function(){

		if(count == 1){

			new TWEEN.Tween(wall1_instance.position).to(

				{x:wall1_instance.position.x - 2000,
					y:-960,
					z:wall1_instance.position.z}, 2000 ).easing(TWEEN.Easing.Sinusoidal.InOut).start();

			new TWEEN.Tween(rooms1_instance.position).to(

				{x:rooms1_instance.position.x - 2000,
					y:-960,
					z:rooms1_instance.position.z}, 2000 ).easing(TWEEN.Easing.Sinusoidal.InOut).start();


			new TWEEN.Tween(wall3_instance.position).to(

				{x:wall3_instance.position.x + 2000,
					y:960,
					z:wall3_instance.position.z}, 2000 ).easing(TWEEN.Easing.Sinusoidal.InOut).start();

			new TWEEN.Tween(rooms3_instance.position).to(

				{x:rooms3_instance.position.x + 2000,
					y:960,
					z:rooms3_instance.position.z}, 2000 ).easing(TWEEN.Easing.Sinusoidal.InOut).start();


			new TWEEN.Tween(wall4_instance.position).to(

				{x:wall4_instance.position.x + 4000,
					y:1920,
					z:wall4_instance.position.z}, 2000 ).easing(TWEEN.Easing.Sinusoidal.InOut).start();

			new TWEEN.Tween(rooms4_instance.position).to(

				{x:rooms4_instance.position.x + 4000,
					y:1920,
					z:rooms4_instance.position.z}, 2000 ).easing(TWEEN.Easing.Sinusoidal.InOut).start();
			count--;
		}else{
			null;
		}

	});









// ------------- search for rooms --------------


// define public variables to hold informaiton of last search.
var last_search = null;
// get normal room material.
var normal_material = floor2_rooms.children[0].children[0].children[0].material.materials[0];

// get the restroom material. console.log to check the restroom component name. Use room 222 in the second floor for searching.
var restroom_material;
	floor2_rooms.children.forEach(function(each){

		if("_222" == each.children[0].name){
			restroom_material = each.children[0].children[0].material.materials[0];
		}
	});




// search button event.
$("#search-button").on("click", function(){


// change the material of last search to original. Normal rooms to normal_material, restroom to restroom_material.
	if(last_search!= null){

		if(last_search.name == "_222" || last_search.name == "_221" || 
			last_search.name == "_322" || last_search.name == "_321" || 
			last_search.name == "_418" || last_search.name == "_419"){

			last_search.children[0].material.materials[0] = restroom_material;

		}else{

			last_search.children[0].material.materials[0] = normal_material;
		}
	}



// search the room and change the mesh material.

// get the input value and convert it to upper case. room names are like 222, 201, 201A.
	var room_name = $("#room-name").val().toUpperCase();
	console.log(room_name);


// traverse each room component in floor1_rooms.
	floor1_rooms.children.forEach(function(each){

		// get the room component name.
		// In the loaded model, component name begining with number are automatically started with _, like _222, _201A.
		var component_name = each.children[0].name;
		var length = component_name.length;
		var new_name = component_name.substr(1, length-1);

		//console.log(length);
		//console.log(component_name);
		//console.log(new_name);

		if(room_name == new_name){

			// create new THREE material for searched room.
	 		var new_material = new THREE.MeshLambertMaterial( { opacity:0.8, color: 0xff0000, transparent:true } );
			// change the material of the room mesh.
			each.children[0].children[0].material.materials[0] = new_material;
			// assign the searched room to last_search.
			last_search = each.children[0];
		}

	});


// traverse each room component in floor2_rooms.
	floor2_rooms.children.forEach(function(each){

		// get the room component name.
		var component_name = each.children[0].name;
		var length = component_name.length;
		var new_name = component_name.substr(1, length-1);

		if(room_name == new_name){

			// create new THREE material for searched room.
	 		var new_material = new THREE.MeshLambertMaterial( { opacity:0.8, color: 0xff0000, transparent:true } );
			// change the material of the room mesh.
			each.children[0].children[0].material.materials[0] = new_material;
			// assign the searched room to last_search.
			last_search = each.children[0];
		}

	});

// traverse each room component in floor3_rooms.
	floor3_rooms.children.forEach(function(each){

		// get the room component name.
		var component_name = each.children[0].name;
		var length = component_name.length;
		var new_name = component_name.substr(1, length-1);

		if(room_name == new_name){

			// create new THREE material for searched room.
	 		var new_material = new THREE.MeshLambertMaterial( { opacity:0.8, color: 0xff0000, transparent:true } );
			// change the material of the room mesh.
			each.children[0].children[0].material.materials[0] = new_material;
			// assign the searched room to last_search.
			last_search = each.children[0];
		}

	});

// traverse each room component in floor4_rooms.
	floor4_rooms.children.forEach(function(each){

		// get the room component name.
		var component_name = each.children[0].name;
		var length = component_name.length;
		var new_name = component_name.substr(1, length-1);

		if(room_name == new_name){

			// create new THREE material for searched room.
	 		var new_material = new THREE.MeshLambertMaterial( { opacity:0.8, color: 0xff0000, transparent:true } );
			// change the material of the room mesh.
			each.children[0].children[0].material.materials[0] = new_material;
			// assign the searched room to last_search.
			last_search = each.children[0];
		}

	});


}); // end of button click function.






// --------------------- add avatar to the sketchup component. ------------------------------

	var avatarGeometry = new THREE.SphereGeometry(25, 30, 30);// default position(0, 0, 0)

	var avatarMaterial = new THREE.MeshLambertMaterial({color: 0x00ff00});

	var avatar = new THREE.Mesh(avatarGeometry, avatarMaterial);

	avatar.position.set(0, 40, 0);
	sketchup.add(avatar);


// -------------------------- define movement event. ------------------------------------------------

	$("#forward").on("click", function() {
	new TWEEN.Tween(avatar.position).to(
				{x:avatar.position.x-80,
				 y:avatar.position.y,
				 z:avatar.position.z}, 800 ).easing(TWEEN.Easing.Quadratic.Out).start();
	});

	$("#backward").on("click", function() {
	new TWEEN.Tween(avatar.position).to(
				{x:avatar.position.x+80,
				 y:avatar.position.y,
				 z:avatar.position.z}, 800 ).easing(TWEEN.Easing.Quadratic.Out).start();
	});

	$("#left").on("click", function() {
	new TWEEN.Tween(avatar.position).to(
				{x:avatar.position.x,
				 y:avatar.position.y,
				 z:avatar.position.z+80}, 800 ).easing(TWEEN.Easing.Quadratic.Out).start();
	});

	$("#right").on("click", function() {
	new TWEEN.Tween(avatar.position).to(
				{x:avatar.position.x,
				 y:avatar.position.y,
				 z:avatar.position.z-80}, 800 ).easing(TWEEN.Easing.Quadratic.Out).start();
	});

	$("#up").on("click", function() {
	new TWEEN.Tween(avatar.position).to(
				{x:avatar.position.x,
				 y:avatar.position.y+960,
				 z:avatar.position.z}, 800 ).easing(TWEEN.Easing.Quadratic.Out).start();
	});

	$("#down").on("click", function() {
	new TWEEN.Tween(avatar.position).to(
				{x:avatar.position.x,
				 y:avatar.position.y-960,
				 z:avatar.position.z}, 800 ).easing(TWEEN.Easing.Quadratic.Out).start();
	});







$(document).keydown(function(e) {

	// move left. "a"
		if(e.keyCode == 37 || e.keyCode == 65)
		{
		new TWEEN.Tween(avatar.position).to(
					{x:avatar.position.x,
					 y:avatar.position.y,
					 z:avatar.position.z+80}, 800 ).easing(TWEEN.Easing.Quadratic.Out).start();
		}
	// move forward. "w"
		if(e.keyCode == 38 || e.keyCode == 87)
		{
		new TWEEN.Tween(avatar.position).to(
				{x:avatar.position.x-80,
				 y:avatar.position.y,
				 z:avatar.position.z}, 800 ).easing(TWEEN.Easing.Quadratic.Out).start();
		}

	// move right. "d"
		if(e.keyCode == 39 || e.keyCode == 68)
		{
		new TWEEN.Tween(avatar.position).to(
				{x:avatar.position.x,
				 y:avatar.position.y,
				 z:avatar.position.z-80}, 800 ).easing(TWEEN.Easing.Quadratic.Out).start();
		}
	// move backward. "s"
		if(e.keyCode == 40 || e.keyCode == 83)
		{
		new TWEEN.Tween(avatar.position).to(
				{x:avatar.position.x+80,
				 y:avatar.position.y,
				 z:avatar.position.z}, 800 ).easing(TWEEN.Easing.Quadratic.Out).start();
		}
	// go up floor. "r"
		if(e.keyCode == 82)
		{
		new TWEEN.Tween(avatar.position).to(
				{x:avatar.position.x,
				 y:avatar.position.y+960,
				 z:avatar.position.z}, 800 ).easing(TWEEN.Easing.Quadratic.Out).start();
		}
	// go down floor. "f"
		if(e.keyCode == 70)
		{
		new TWEEN.Tween(avatar.position).to(
				{x:avatar.position.x,
				 y:avatar.position.y-960,
				 z:avatar.position.z}, 800 ).easing(TWEEN.Easing.Quadratic.Out).start();
		}		



});









	// Add the collada model.
		scene.add(sketchup);
		console.log(sketchup);

	// remove load html element.
		$("#load").fadeOut(2000);

	}, function(){

	// call the onProgress function. add loading message to the load div element.
	load.innerHTML = "Loading model ...";

	});












// add trackball controls.
    trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
    trackballControls.rotateSpeed = 0.6;
    trackballControls.zoomSpeed = 0.4;
    trackballControls.panSpeed = 0.4;


// window resize event.
	window.addEventListener( 'resize', onWindowResize, false );

// camera button event.
	$("#cam1").on("click", function(){
		camera.position.set(0, 6, 0);
		camera.lookAt( scene.position );
	});

	$("#cam2").on("click", function(){
		camera.position.set( 5, 3, 3);
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