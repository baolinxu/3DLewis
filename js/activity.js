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
	camera = new THREE.PerspectiveCamera( 60, viewWidth / viewHeight, 0.001, 50000);
	camera.position.set( -3, 3, 3); // adjust the distance to the model.
	camera.lookAt( scene.position ); // try to change the postion.


// ambient light.
    var ambientLight = new THREE.AmbientLight(0x545454);
    ambientLight.name='ambient';
    scene.add(ambientLight);

// directional light.
	var directionalLight = new THREE.DirectionalLight( 0xdcdcdc);
	directionalLight.name = "directional";
	directionalLight.position.x = 50;
	directionalLight.position.y = 50;
	directionalLight.position.z = 50;
	directionalLight.position.normalize();
	scene.add( directionalLight );

// hemisphere light.
 	var hemiLight = new THREE.HemisphereLight(0x000000, 0x213c4d, 0.6); // adjust the color.
    hemiLight.position.set(0, 50, 0);
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

	loader.load( './dae/activity/activity.dae', function ( collada ) {

	sketchup = collada.scene.children[0];
	sketchup.scale.set(0.001, 0.001, 0.001); // the units of the model is in inch.
	sketchup.updateMatrix();



 // get the instance.
	wall2_instance = sketchup.children[0];
	rooms2_instance = sketchup.children[1];

	wall4_instance = sketchup.children[2];
	rooms4_instance = sketchup.children[3];

	wall3_instance = sketchup.children[4];
	rooms3_instance = sketchup.children[5];

	wall1_instance = sketchup.children[6];
	rooms1_instance = sketchup.children[7];


 // get the component.
	floor2_wall = sketchup.children[0].children[0];
	floor2_rooms = sketchup.children[1].children[0];

	floor4_wall = sketchup.children[2].children[0];
	floor4_rooms = sketchup.children[3].children[0];

	floor3_wall = sketchup.children[4].children[0];
	floor3_rooms = sketchup.children[5].children[0];

	floor1_wall = sketchup.children[6].children[0];
	floor1_rooms = sketchup.children[7].children[0];





// --------------------- add avatar to the sketchup component. ------------------------------

	var avatarGeometry = new THREE.SphereGeometry(0.03, 30, 30);// default position(0, 0, 0)

	var avatarMaterial = new THREE.MeshLambertMaterial({color: 0x00ff00});

	var avatar = new THREE.Mesh(avatarGeometry, avatarMaterial);

	avatar.position.set(0, 0.05, 0);


	scene.add(avatar);


	//console.log(avatar.position);






// -------------------------- Clone room mesh and add them to scene. Ajust the new mesh position. Hide the original mesh. ------------------------------------------------



// declare public variables.

	var move_status = true;

	var start_time, end_time, starting, ending;

	var mesh_name;

	var mesh_array = []; // hold the room meshes.

	var data_array = []; // hold the activity object.

	var data_set = ""; // hold html output.

	var room_check = false; // check if the avater is on top of a room.

// create activity object to hold information of occupation in one room.
	function Activity(mesh_name, starting, ending, period){
		this.mesh_name = mesh_name; // room name.
		this.starting = starting; // start time.
		this.ending = ending; // end time.
		this.period = period; // occupation time in the room.

	}



// iterat through each rooms instance and clone room mesh, add new mesh to scene, hide original mesh.

floor1_rooms.children.forEach(function(each){

	var room_position = each.position;

	var room_mesh = each.children[0].children[0];

	var component_name = each.children[0].name; // _201, _221.
	var length = component_name.length;
	var room_name = component_name.substr(1, length - 1); // get the room name.

	var new_mesh = room_mesh.clone();

	new_mesh.scale.set(0.001, 0.001, 0.001);

	var x  = (room_position.x - 1469)*0.001; // tested out.
	var y  = (room_position.y - 960)*0.001;
	var z  = (room_position.z + 729)*0.001; // tested out.

	new_mesh.position.set(x, y, z);

	new_mesh.name = room_name; // assign room name to new mesh.

	mesh_array.push(new_mesh); // push new mesh to an array for ray intersectObjects.

	scene.add(new_mesh); // add new mesh to scene.

	each.visible = false; // hide the original mesh.

});



floor2_rooms.children.forEach(function(each){

	var room_position = each.position;

	var room_mesh = each.children[0].children[0];

	var component_name = each.children[0].name; // _201, _221.

	var length = component_name.length;

	var room_name = component_name.substr(1, length - 1);


	var new_mesh = room_mesh.clone();

	new_mesh.scale.set(0.001, 0.001, 0.001);

	var x  = (room_position.x - 1449)*0.001; // tested out.
	var y  = (room_position.y)*0.001;
	var z  = (room_position.z + 729)*0.001; // tested out.

	new_mesh.position.set(x, y, z);

	new_mesh.name = room_name;

	mesh_array.push(new_mesh);

	scene.add(new_mesh);

	each.visible = false;

});

floor3_rooms.children.forEach(function(each){

	var room_position = each.position;

	var room_mesh = each.children[0].children[0];

	var component_name = each.children[0].name; // _201, _221.

	var length = component_name.length;

	var room_name = component_name.substr(1, length - 1);


	var new_mesh = room_mesh.clone();

	new_mesh.scale.set(0.001, 0.001, 0.001);

	var x  = (room_position.x - 1449)*0.001; // tested out.
	var y  = (room_position.y + 960)*0.001;
	var z  = (room_position.z + 729)*0.001; // tested out.

	new_mesh.position.set(x, y, z);

	new_mesh.name = room_name;

	mesh_array.push(new_mesh);

	scene.add(new_mesh);

	each.visible = false;

});

floor4_rooms.children.forEach(function(each){

	var room_position = each.position;

	var room_mesh = each.children[0].children[0];

	var component_name = each.children[0].name; // _201, _221.

	var length = component_name.length;

	var room_name = component_name.substr(1, length - 1);


	var new_mesh = room_mesh.clone();

	new_mesh.scale.set(0.001, 0.001, 0.001);

	var x  = (room_position.x - 1449)*0.001; // tested out.
	var y  = (room_position.y + 1920)*0.001;
	var z  = (room_position.z + 636)*0.001; // tested out.

	new_mesh.position.set(x, y, z);

	new_mesh.name = room_name;

	mesh_array.push(new_mesh);

	scene.add(new_mesh);

	each.visible = false;

});

console.log(mesh_array);







$("#stay").on("click", function() {

// get the avatar position vector.
	var avatar_position = avatar.position;

// get the surface point position.
	var surface_position = avatar_position.clone();

	surface_position.y = avatar_position.y - 0.04; // move the surface position 0.03 down the avatar position.

// get the direction vector.
	var direction_vector = surface_position.sub(avatar_position);

// create ray from avatar position to surface position.
	var ray = new THREE.Raycaster(avatar_position, direction_vector.normalize());

// get the intersects from the ray to the room meshes.
	var intersects = ray.intersectObjects(mesh_array);

	console.log(intersects);


	if(intersects.length > 0){

		room_check = true; // check if avatar is on top of a room.

	// get the intersected room mesh name.
		mesh_name = intersects[0].object.name;

		console.log(mesh_name);

	// get the start time.
		var date = new Date();
		start_time = date.getTime();

	// display the start time.	

		var start_hour = date.getHours().toString();
		var start_minute = date.getMinutes().toString();
		var start_second = date.getSeconds().toString();

		starting = start_hour + ":" + start_minute + ":" + start_second;

		console.log(starting);

	// change the move status of the avatar.
		move_status = false;

	// change the color of the avatar mesh.
	    avatar.material.color.setHex(0xff0000);
	}



});





$("#leave").on("click", function() {

// original room_check = false. ensure that when no room is in occupation, click the leave button doing nothing.
	if(room_check == true){

	// change the room_check status back to origin. Ready for next stay-leave circle.
		room_check = false;

	// change the move status of avatar.
		move_status = true;

	// change the color of avatar to green.
		avatar.material.color.setHex(0x00ff00);

	// get the end time. 
		var date = new Date();
		end_time = date.getTime();

	// display the end time format.
		var end_hour = date.getHours().toString();
		var end_minute = date.getMinutes().toString();
		var end_second = date.getSeconds().toString();

		ending = end_hour + ":" + end_minute + ":" + end_second;

		console.log(ending);


	// calculate the occupation period.
		var period = Math.floor((end_time - start_time)/1000);

	// create activity object and push the object into data_array.
		var activity = new Activity(mesh_name, starting, ending, period);
		data_array.push(activity);
	}

});




$("#output").on("click", function() {
	// loop through the data_array and display the data sets in output div element.

		data_set = ""; // clear output of last time.

		var length = data_array.length;

		for(var i = 0; i < length; i ++){


		data_set = data_set + "Room: " + data_array[i].mesh_name + " - " + data_array[i].starting + 
		" - " + data_array[i].ending + " - " + data_array[i].period + " seconds" + "<br>";

		}


	$("#table-rows").html(data_set);

});







// ---------------------- floor visibility options ---------------------------------------

	$("#floor1").on("click", function(){

		if(floor1_wall.visible == true){
			floor1_wall.visible = false;

		}else{
			floor1_wall.visible = true;
		}

		if(floor1_rooms.visible == true){
			floor1_rooms.visible = false;

			mesh_array.forEach(function(each){
				var floor_number = each.name.slice(0, 1);
				if(floor_number == "1"){
					each.visible = false;
				}
			});

		}else{
			floor1_rooms.visible = true;

			mesh_array.forEach(function(each){
				var floor_number = each.name.slice(0, 1);
				if(floor_number == "1"){
					each.visible = true;
				}
			});			
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

			mesh_array.forEach(function(each){
				var floor_number = each.name.slice(0, 1);
				if(floor_number == "2"){
					each.visible = false;
				}
			});	

		}else{
			floor2_rooms.visible = true;

			mesh_array.forEach(function(each){
				var floor_number = each.name.slice(0, 1);
				if(floor_number == "2"){
					each.visible = true;
				}
			});			
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


			mesh_array.forEach(function(each){
				var floor_number = each.name.slice(0, 1);
				if(floor_number == "3"){
					each.visible = false;
				}
			});	

		}else{
			floor3_rooms.visible = true;

			mesh_array.forEach(function(each){
				var floor_number = each.name.slice(0, 1);
				if(floor_number == "3"){
					each.visible = true;
				}
			});			
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

			mesh_array.forEach(function(each){
				var floor_number = each.name.slice(0, 1);
				if(floor_number == "4"){
					each.visible = false;
				}
			});	

		}else{
			floor4_rooms.visible = true;

			mesh_array.forEach(function(each){
				var floor_number = each.name.slice(0, 1);
				if(floor_number == "4"){
					each.visible = true;
				}
			});			
		}

	});







// -------------------------- define movement event. ------------------------------------------------

	$("#forward").on("click", function() {

	if(move_status == true){
	new TWEEN.Tween(avatar.position).to(
				{x:avatar.position.x,
				 y:avatar.position.y,
				 z:avatar.position.z-0.08}, 800 ).easing(TWEEN.Easing.Quadratic.Out).start();	
		}

	});

	$("#backward").on("click", function() {
	if(move_status == true){		
	new TWEEN.Tween(avatar.position).to(
				{x:avatar.position.x,
				 y:avatar.position.y,
				 z:avatar.position.z+0.08}, 800 ).easing(TWEEN.Easing.Quadratic.Out).start();
		}
	});

	$("#left").on("click", function() {
	if(move_status == true){		
	new TWEEN.Tween(avatar.position).to(
				{x:avatar.position.x-0.08,
				 y:avatar.position.y,
				 z:avatar.position.z}, 800 ).easing(TWEEN.Easing.Quadratic.Out).start();
	}
	});

	$("#right").on("click", function() {
	if(move_status == true){		
	new TWEEN.Tween(avatar.position).to(
				{x:avatar.position.x+0.08,
				 y:avatar.position.y,
				 z:avatar.position.z}, 800 ).easing(TWEEN.Easing.Quadratic.Out).start();
	}
	});

	$("#up").on("click", function() {
	if(move_status == true){		
	new TWEEN.Tween(avatar.position).to(
				{x:avatar.position.x,
				 y:avatar.position.y+0.960,
				 z:avatar.position.z}, 800 ).easing(TWEEN.Easing.Quadratic.Out).start();
	}
	});

	$("#down").on("click", function() {
	if(move_status == true){		
	new TWEEN.Tween(avatar.position).to(
				{x:avatar.position.x,
				 y:avatar.position.y-0.960,
				 z:avatar.position.z}, 800 ).easing(TWEEN.Easing.Quadratic.Out).start();
	}
	});




$(document).keydown(function(e) {

	if(move_status == true){
	// move left. "a"
		if(e.keyCode == 37 || e.keyCode == 65)
		{
		new TWEEN.Tween(avatar.position).to(
					{x:avatar.position.x-0.08,
					 y:avatar.position.y,
					 z:avatar.position.z}, 800 ).easing(TWEEN.Easing.Quadratic.Out).start();
		}
	// move forward. "w"
		if(e.keyCode == 38 || e.keyCode == 87)
		{
		new TWEEN.Tween(avatar.position).to(
				{x:avatar.position.x,
				 y:avatar.position.y,
				 z:avatar.position.z-0.08}, 800 ).easing(TWEEN.Easing.Quadratic.Out).start();
		}

	// move right. "d"
		if(e.keyCode == 39 || e.keyCode == 68)
		{
		new TWEEN.Tween(avatar.position).to(
				{x:avatar.position.x+0.08,
				 y:avatar.position.y,
				 z:avatar.position.z}, 800 ).easing(TWEEN.Easing.Quadratic.Out).start();
		}
	// move backward. "s"
		if(e.keyCode == 40 || e.keyCode == 83)
		{
		new TWEEN.Tween(avatar.position).to(
				{x:avatar.position.x,
				 y:avatar.position.y,
				 z:avatar.position.z+0.08}, 800 ).easing(TWEEN.Easing.Quadratic.Out).start();
		}
	// go up floor. "r"
		if(e.keyCode == 82)
		{
		new TWEEN.Tween(avatar.position).to(
				{x:avatar.position.x,
				 y:avatar.position.y+0.960,
				 z:avatar.position.z}, 800 ).easing(TWEEN.Easing.Quadratic.Out).start();
		}
	// go down floor. "f"
		if(e.keyCode == 70)
		{
		new TWEEN.Tween(avatar.position).to(
				{x:avatar.position.x,
				 y:avatar.position.y-0.960,
				 z:avatar.position.z}, 800 ).easing(TWEEN.Easing.Quadratic.Out).start();
		}		

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
    trackballControls.rotateSpeed = 1.0;
    trackballControls.zoomSpeed = 1.0;
    trackballControls.panSpeed = 1.0;


// window resize event.
	window.addEventListener( 'resize', onWindowResize, false );

// camera button event.
	$("#cam1").on("click", function(){
		camera.position.set(0, 6, 0.1);
		camera.lookAt( scene.position );
	});

	$("#cam2").on("click", function(){
		camera.position.set( -3, 3, 3);
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