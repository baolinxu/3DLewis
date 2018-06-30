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
	var zones, other, bars;
	var bar;
	var bar1, bar2, bar3, bar4, bar5, bar6, bar7, bar8, bar9, bar10, bar11, bar12, bar13, bar14, bar15, bar16, bar17;
	var zone1, zone2, zone3, zone4, zone5, zone6, zone7, zone8, zone9, zone10,
	zone11, zone12, zone13, zone14, zone15, zone16, zone17;
	var positionArray = [];


// laod the JSON file and get the temperature data.

	var week;

	var xmlhttp = new XMLHttpRequest();
	var url = "./js/energy.json";

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
	camera.position.set( 2, 3, 2);
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
	renderer.setPixelRatio( window.devicePixelRatio ); // ??????
	renderer.setClearColor(0x282828, 1.0);
	renderer.setSize( viewWidth, viewHeight );

// add the domElement to the container.	
	container.appendChild( renderer.domElement );



// create colladaLoader.
	var loader = new THREE.ColladaLoader();

	loader.options.convertUpAxis = true; // convert the Z axis to Y axis.

	loader.load( './dae/energy/energy_legend.dae', function ( collada ) {

	sketchup = collada.scene.children[0];
	sketchup.scale.set(0.001, 0.001, 0.001); // the units of the model is in inch.
	sketchup.updateMatrix();


// assign sketchup instance to variable. Pay attention to the level of the object.
	other = sketchup.children[0];
	zones = sketchup.children[1];
	bars = sketchup.children[2];










// ---------------- floor visibility options --------------------------------------------------

	$("#other").on("click", function(){

		if(other.visible == true){
			other.visible = false;
		}else{
			other.visible = true;
		}
	});







 // -------------------- click time button, change room mesh color. -----------------------------------


	// wrap the onTimeButtonClick function in an anonymous function.
	$("#search-button").on("click", function() {


	// get the weekday option value.
	var weekday = $("#weekday").val();

	// get the day object in the week object.
	var day_object = week[weekday];

	// get all the zone names and put them in an array.
	var zoneNameArray = Object.keys(day_object);




	// iterate through each zone in the array. search the zone mesh with the zone name in the array.
		for(var i = 0; i < zoneNameArray.length; i ++){

			var zone_name = zoneNameArray[i];

			var energy = day_object[zone_name]; // get the energy value in the day_object.


			//console.log(zone_name);


			// interate through the zone meshes to find the zone that matches the zone_name.

			zones.children[0].children.forEach(function(each){

				// get the zone component name.
				var component_name = each.children[0].name; //names are like zone1, zone2, zone3.

				if(zone_name == component_name){

					// map the energy value to HSL H value.
					// energy to hsl conversion. hsl(240 to 0, 100%, 50%).
					// (0 to 100) map to (240 to 0). 240 + x*(-240/100) = 240 - x*240/100.

					var color_hue = 240 - energy*240/100;

					var new_color = new THREE.Color("hsl" + "(" + color_hue + ", 80%, 50%)"); // pay attention to the hsl format here.

			 		var new_material = new THREE.MeshLambertMaterial( { opacity:1.0, color: new_color, transparent:true } );

					// change the material of the room mesh.
					each.children[0].children[0].material.materials[0] = new_material;
				}
			}); // end of forEach.
		} // end of for loop.








// ------------------ generate the energy bar meshes. --------------------------------------------



// clear the mesh generated last time.

			bars.children[0].children.forEach(function(each){

			if(each.children[1]!= null){
				each.remove(each.children[1]);
			}

			});



// generate new box mesh in the bar instance.

		for(var i = 0; i < zoneNameArray.length; i ++){

			var zone_name = zoneNameArray[i];

			var energy = day_object[zone_name]; // get the energy value in the day_object.

// iterate through each bar instance to match the zone name in the day_object.
			bars.children[0].children.forEach(function(each){

			var bar_name = each.children[0].name; // bar names are like bar1, bar2, bar3.
			var bar_length = bar_name.length; // 4
			var bar_number = bar_name.substr(3, bar_length-3); // get the last number in the bar name.

			var zone_length = zone_name.length;
			var zone_number = zone_name.substr(4, zone_length-4); // get the last number in the zone name.


			if(zone_number == bar_number){

			// create box mesh at the bar position.
			var boxGeometry = new THREE.BoxGeometry(20, energy*10, 20);// width, height, depth.

			var boxMaterial = new THREE.MeshLambertMaterial({color: 0xf0f0f0});

			var boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

			boxMesh.position = each.position; // the box mesh is centered to the bar position.
			boxMesh.translateY(energy*5); // move the box mesh up with a distance of half the height.
			boxMesh.translateX(10);
			boxMesh.translateZ(-10); // the barMesh position has been changed. the bar instace position is still the same.

			each.add(boxMesh); // add box mesh to bar instance.

			}

			}); // end of forEach.

		} // end of for loop.

	});




// ---------------- energy bar animation. ------------------------------------


	zone16 = zones.children[0].children[0];
	zone15 = zones.children[0].children[1];
	zone14 = zones.children[0].children[2];
	zone13 = zones.children[0].children[3];
	zone12 = zones.children[0].children[4];
	zone11 = zones.children[0].children[5];
	zone10 = zones.children[0].children[6];
	zone9 = zones.children[0].children[7];
	zone8 = zones.children[0].children[8];
	zone7 = zones.children[0].children[9];
	zone5 = zones.children[0].children[10];
	zone6 = zones.children[0].children[11];
	zone4 = zones.children[0].children[12];
	zone2 = zones.children[0].children[13];
	zone1 = zones.children[0].children[14];
	zone3 = zones.children[0].children[15];
	zone17 = zones.children[0].children[16];



	bar1 = bars.children[0].children[0];
	bar7 = bars.children[0].children[1];
	bar2 = bars.children[0].children[2];
	bar5 = bars.children[0].children[3];
	bar3 = bars.children[0].children[4];
	bar8 = bars.children[0].children[5];
	bar10 = bars.children[0].children[6];
	bar12 = bars.children[0].children[7];
	bar16 = bars.children[0].children[8];
	bar17 = bars.children[0].children[9];
	bar14 = bars.children[0].children[10];
	bar11 = bars.children[0].children[11];
	bar6 = bars.children[0].children[12];
	bar4 = bars.children[0].children[13];
	bar13 = bars.children[0].children[14];
	bar9 = bars.children[0].children[15];
	bar15 = bars.children[0].children[16];




	for(var i = 0; i < 17; i++){
		positionArray.push(bars.children[0].children[i].position);
	}

	console.log(positionArray); // check each bar position.




	var bar1_position = {x:0, y:0, z:0};
	var bar7_position = {x:0, y:0, z:-864};
	var bar2_position = {x:0, y:0, z:-144};
	var bar5_position = {x:0, y:0, z:-576};
	var bar3_position = {x:0, y:0, z:-288};
	var bar8_position = {x:0, y:0, z:-1008};
	var bar10_position = {x:0, y:0, z:-1296};
	var bar12_position = {x:0, y:0, z:-1584};
	var bar16_position = {x:0, y:0, z:-2160};
	var bar17_position = {x:0, y:0, z:-2304};
	var bar14_position = {x:0, y:0, z:-1872};
	var bar11_position = {x:0, y:0, z:-1440};
	var bar6_position = {x:0, y:0, z:-720};
	var bar4_position = {x:0, y:0, z:-432};
	var bar13_position = {x:0, y:0, z:-1728};
	var bar9_position = {x:0, y:0, z:-1152};
	var bar15_position = {x:0, y:0, z:-2016};




	$("#inplan").on("click", function() {

		bars.children[0].children.forEach(function(bar){

		var bar_name = bar.children[0].name;
		var bar_length = bar_name.length;
		var bar_number = bar_name.substr(3, bar_length-3);


			zones.children[0].children.forEach(function(zone){

			var zone_name = zone.children[0].name;
			var zone_length = zone_name.length;
			var zone_number = zone_name.substr(4, zone_length-4);

			// match the bar name with the zone name. move the bar instance to the zone instance position.
			if(zone_number == bar_number){

					new TWEEN.Tween(bar.position).to(
							{x:zone.position.x+420,
							 y:0,
							 z:zone.position.z}, 3000 ).easing(TWEEN.Easing.Exponential.InOut).start();
			}

			});

		});

	});






$("#inline").on("click", function() {

	new TWEEN.Tween(bar1.position).to(bar1_position, 3000 ).easing(TWEEN.Easing.Exponential.InOut).start();
	new TWEEN.Tween(bar2.position).to(bar2_position, 3000 ).easing(TWEEN.Easing.Exponential.InOut).start();
	new TWEEN.Tween(bar3.position).to(bar3_position, 3000 ).easing(TWEEN.Easing.Exponential.InOut).start();
	new TWEEN.Tween(bar4.position).to(bar4_position, 3000 ).easing(TWEEN.Easing.Exponential.InOut).start();
	new TWEEN.Tween(bar5.position).to(bar5_position, 3000 ).easing(TWEEN.Easing.Exponential.InOut).start();
	new TWEEN.Tween(bar6.position).to(bar6_position, 3000 ).easing(TWEEN.Easing.Exponential.InOut).start();
	new TWEEN.Tween(bar7.position).to(bar7_position, 3000 ).easing(TWEEN.Easing.Exponential.InOut).start();
	new TWEEN.Tween(bar8.position).to(bar8_position, 3000 ).easing(TWEEN.Easing.Exponential.InOut).start();
	new TWEEN.Tween(bar9.position).to(bar9_position, 3000 ).easing(TWEEN.Easing.Exponential.InOut).start();
	new TWEEN.Tween(bar10.position).to(bar10_position, 3000 ).easing(TWEEN.Easing.Exponential.InOut).start();
	new TWEEN.Tween(bar11.position).to(bar11_position, 3000 ).easing(TWEEN.Easing.Exponential.InOut).start();
	new TWEEN.Tween(bar12.position).to(bar12_position, 3000 ).easing(TWEEN.Easing.Exponential.InOut).start();
	new TWEEN.Tween(bar13.position).to(bar13_position, 3000 ).easing(TWEEN.Easing.Exponential.InOut).start();
	new TWEEN.Tween(bar14.position).to(bar14_position, 3000 ).easing(TWEEN.Easing.Exponential.InOut).start();
	new TWEEN.Tween(bar15.position).to(bar15_position, 3000 ).easing(TWEEN.Easing.Exponential.InOut).start();
	new TWEEN.Tween(bar16.position).to(bar16_position, 3000 ).easing(TWEEN.Easing.Exponential.InOut).start();
	new TWEEN.Tween(bar17.position).to(bar17_position, 3000 ).easing(TWEEN.Easing.Exponential.InOut).start();


});




	// Add the collada model.
	scene.add(sketchup);
	console.log(sketchup);

	// remove load html element when onLoad.
	$("#load").fadeOut(2000);
	
	}, function(){

	// call the onProgress function. add loading message to the load div element.
	load.innerHTML = "Loading model ...";

}); // end of loader.load()




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
		camera.position.set( 2, 3, 2);
		camera.lookAt( scene.position );
	});






	window.addEventListener( 'resize', onWindowResize, false );

// call the render funcition.
	render();



// function definitions.
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



});