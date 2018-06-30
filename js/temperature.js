$(document).ready(function(){

// detect webgl support.
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();


// declare public variables.
	var container;
	var trackballControls;

	var camera;
	var scene;
	var renderer;
	var sketchup;
	var floor1, floor2, floor2_other, floor3, floor4;
	

// laod the JSON file and get the temperature data.

var week;

var xmlhttp = new XMLHttpRequest();
var url = "./js/temperature.json";

xmlhttp.onreadystatechange=function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        getData(xmlhttp.responseText);
    }
}

xmlhttp.open("GET", url, true);
xmlhttp.send();


function getData(response) {
    week = JSON.parse(response);
}

/*-------- attention -------
In JSON file. object property name must be wraped with double quotes like "201". '201' doesn't work in the JSON file.
In <script> javascript object property identifier can not be started with number. 8am:{} doesn't work.

*/





// create clock for trackballControls.
	var clock = new THREE.Clock();

// get the div container.
	container = document.getElementById("container");

// get the size of the div container.
	var viewWidth = $("#container").width();
	var viewHeight = $("#container").height();

// create webgl scene.
	scene = new THREE.Scene();

// create webgl camera.
	camera = new THREE.PerspectiveCamera( 45, viewWidth / viewHeight, 0.001, 2000 );
	camera.position.set( 3, 4.5, 3);
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
 	var hemiLight = new THREE.HemisphereLight(0x000000, 0x213c4d, 0.6); // adjust the color.
    hemiLight.position.set(0, 10, 0);
    hemiLight.name = "hemi";
    scene.add(hemiLight);

// create webgl renderer.
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setClearColor(0x282828, 1.0);
	renderer.setSize( viewWidth, viewHeight );

// add the domElement to the container.	
	container.appendChild( renderer.domElement );



// create colladaLoader.
	var loader = new THREE.ColladaLoader();

	loader.options.convertUpAxis = true; // convert the Z axis to Y axis.

	loader.load( './dae/temperature/temperature_legend.dae', function ( collada ) {

	sketchup = collada.scene.children[0];
	sketchup.scale.set(0.001, 0.001, 0.001); // the units of the model is in inch.
	sketchup.updateMatrix();

// assign sketchup instance to variable. Pay attention to the level of the object.
	floor1 = sketchup.children[3];
	floor2 = sketchup.children[2];
	floor2_other = sketchup.children[4];
	floor3 = sketchup.children[1];
	floor4 = sketchup.children[0];









// ---------------- floor visibility options --------------------------------------------------

	$("#floor1").on("click", function(){

		if(floor1.visible == true){
			floor1.visible = false;
		}else{
			floor1.visible = true;
		}
	});

	$("#floor2").on("click", function(){
		// floor2 is divided into two parts in the sketchup model.
		if(floor2.visible == true){
			floor2.visible = false;
		}else{
			floor2.visible = true;
		}

		if(floor2_other.visible == true){
			floor2_other.visible = false;
		}else{
			floor2_other.visible = true;
		}
	});

	$("#floor3").on("click", function(){

		if(floor3.visible == true){
			floor3.visible = false;
		}else{
			floor3.visible = true;
		}

	});

	$("#floor4").on("click", function(){

		if(floor4.visible == true){
			floor4.visible = false;
		}else{
			floor4.visible = true;
		}

	});







// ---------------- change floor layout. stack or unstack ------------------------------------------------------


// console.log(instance position). check the instance position for calculating offset for tweening.

	console.log(floor1.position);
	console.log(floor2.position);
	console.log(floor2_other.position);
	console.log(floor3.position);
	console.log(floor4.position);



// tween the transition. Don't forget to add TWEEN.update() in render function.

	var count = 0; // original count == 0, when count == 0, unstack. when count == 1, stack.

	$("#unstack").on("click", function(){
		if(count == 0) {

			new TWEEN.Tween(floor1.position).to(

				{x:floor1.position.x + 2000,
					y:0,
					z:floor1.position.z}, 2000 ).easing(TWEEN.Easing.Exponential.InOut).start();


			new TWEEN.Tween(floor3.position).to(

				{x:floor3.position.x - 2000,
					y:0,
					z:floor3.position.z}, 2000 ).easing(TWEEN.Easing.Exponential.InOut).start();


			new TWEEN.Tween(floor4.position).to(

				{x:floor4.position.x - 4000,
					y:0,
					z:floor4.position.z}, 2000 ).easing(TWEEN.Easing.Exponential.InOut).start();


			count ++; // change the status of count.

		}else{
			null;
		}

	});



	$("#stack").on("click", function(){

		if(count == 1){

			new TWEEN.Tween(floor1.position).to(

				{x:floor1.position.x - 2000,
					y:-960,
					z:floor1.position.z}, 2000 ).easing(TWEEN.Easing.Exponential.InOut).start();


			new TWEEN.Tween(floor3.position).to(

				{x:floor3.position.x + 2000,
					y:960,
					z:floor3.position.z}, 2000 ).easing(TWEEN.Easing.Exponential.InOut).start();


			new TWEEN.Tween(floor4.position).to(

				{x:floor4.position.x + 4000,
					y:1920,
					z:floor4.position.z}, 2000 ).easing(TWEEN.Easing.Exponential.InOut).start();


			count--; // change the status of count.
		}else{
			null;
		}

	});













 // -------------------- click time button, change room mesh color. -----------------------------------

/*
	// the following code doesn't work.
	$("#8am").on("click", onTimeButtonClick("8am"));

*/

	// wrap the onTimeButtonClick function in an anonymous function.
	$("#8am").on("click", function(event){

		onTimeButtonClick("8am");
	});

	$("#10am").on("click", function(event){

		onTimeButtonClick("10am");
	});

	$("#12pm").on("click", function(event){

		onTimeButtonClick("12pm");
	});

	$("#14pm").on("click", function(event){

		onTimeButtonClick("14pm");
	});

	$("#16pm").on("click", function(event){

		onTimeButtonClick("16pm");
	});

	$("#18pm").on("click", function(event){

		onTimeButtonClick("18pm");
	});










	// Add the collada model.
	scene.add(sketchup);
	console.log(sketchup); // inspect the THREE object3D level in browser console.


	// remove load html element when onLoad.
	$("#load").fadeOut(2000);
	
	}, function(){

	// call the onProgress function. add loading message to the load div element.
	load.innerHTML = "Loading model ...";

	});











// add trackballControls.
    trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
    trackballControls.rotateSpeed = 0.6;
    trackballControls.zoomSpeed = 0.4;
    trackballControls.panSpeed = 0.4;









// camera button event.
	$("#cam1").on("click", function(){
		camera.position.set(0, 6, 0);
		camera.lookAt( scene.position );
	});

	$("#cam2").on("click", function(){
		camera.position.set( 3, 4.5, 3);
		camera.lookAt( scene.position );
	});









	window.addEventListener( 'resize', onWindowResize, false );

// call the render funcition.
	render();




// --------------- function definitions ------------------------------------------------------------
function onWindowResize() {

	camera.aspect = viewWidth / viewHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(viewWidth, viewHeight );
}


function render() {
	
	TWEEN.update();

    var delta = clock.getDelta();
    trackballControls.update(delta);

	requestAnimationFrame(render);
	renderer.render( scene, camera );

}


function onTimeButtonClick(timeName) {

// get the time.
var time_name = timeName;

// get the weekday option value.
var weekday = $("#weekday").val();

// get the time object in the week object which contains weekday and time object.
var time_object = week[weekday][time_name]; // time_name must be a string.

// get all the room names and put them in an array.
var roomNameArray = Object.keys(time_object);

// iterate through each room in the array. search the room mesh with the room name in the array.
	for(var i = 0; i < roomNameArray.length; i ++){

		var room_name = roomNameArray[i];

		var temperature = time_object[room_name]; // get the temperature value in the time_object.

		// console.log(temperature);

		// interate through the room meshes to find the room that matches the room_name.

		floor2.children[0].children.forEach(function(each){

			// get the room component name. the room component name is started with _. Like _201, _222.
			var component_name = each.children[0].name;
			var length = component_name.length;
			var new_name = component_name.substr(1, length-1); // delete the _ in the room component name.

			if(room_name == new_name){

				// map the temperature to HSL H value.
				// tempereture conversion. (10 to 37) celsius. (50 to 100) fahrenheit.
				// temperature to hsl conversion. hsl(240 to 0, 100%, 50%).
				// ( 50 to 100) map to (240 to 0). 240 + (x-50)*(-240/50) = 240 - (x-50)*240/50.

				var color_hue = 240 - (temperature -50)*240/50;

				var new_color = new THREE.Color("hsl" + "(" + color_hue + ", 80%, 50%)"); // pay attention to the hsl format here.

		 		var new_material = new THREE.MeshLambertMaterial( { opacity:1.0, color: new_color, transparent:true } );

				// change the material of the room mesh.
				each.children[0].children[0].material.materials[0] = new_material;

			}
		}); // end of forEach.
	} // end of for loop.
	
}



});