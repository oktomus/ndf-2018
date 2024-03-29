/*
  __   __        __        
|/  | /  | /  | /  | /     
|   |(___|(   |(___|(      
|   )|   ) \  )|   )|      
|__/ |  /   \/ |  / |      
                           
  __   __        __        
|/  | /  | /  | /  | /     
|   |(___|(   |(___|(      
|   )|   ) \  )|   )|      
|__/ |  /   \/ |  / |      

 Nuit de l'info 2018. Donc pas ndf mais ndi. N'est-ce pas Kevin ?
*/

// ------------------------------------------------------
// Gestion des évenements.
// Parcequ'il faut bien s'en occuper de ces gilets jaunes.
// ------------------------------------------------------

var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.01, 1000);
var nb_pages = 6;
var direction = -1;
var camera_max_rotate = 0;
var animation_running = false;
// Dashboard : previous
$("#navigation #previous").click(function () {
	if (animation_running) return;
	camera_max_rotate += 6.28318530718 / nb_pages;
	if (camera_max_rotate > 6.28318530718) camera_max_rotate -= 6.28318530718;
	direction = 1;
	animation_running = true;
});

// Dashboard : next
$( " #navigation #next" ).click(function() {
	if (animation_running) return;
	camera_max_rotate -= 6.28318530718 / nb_pages;
	if (camera_max_rotate < 0) camera_max_rotate += 6.28318530718;
	direction = -1;
	animation_running = true;
});

var renderer	= new THREE.WebGLRenderer({
	alpha		: true,
});

var webglcontent = document.getElementById('webglcontent');
renderer.autoClear	= false;
renderer.setSize( window.innerWidth, window.innerHeight );
webglcontent.appendChild(renderer.domElement);

var updateFcts	= [];
var scene	= new THREE.Scene();

// Add wireframe thing.
var geo = new THREE.IcosahedronBufferGeometry( 20, 1 );
var geometry = new THREE.WireframeGeometry2( geo );
matLine = new THREE.LineMaterial( {
	color: 0xc6c9d1,
	linewidth: 5.00, // in pixels
	//resolution: w 
	dashed: false
} );
matLine.opacity = 0.05;
matLine.transparent = true;
matLine.resolution.set( window.innerWidth, window.innerHeight ); 
wireframe = new THREE.Wireframe( geometry, matLine );
wireframe.computeLineDistances();
wireframe.scale.set( 10.00, 10.00, 10.00 );
scene.add( wireframe );


updateFcts.push(function(delta, now){
	wireframe.rotation.x = now * 0.01;
	wireframe.rotation.y = Math.cos(now * 0.1);
	wireframe.rotation.z = Math.sin(now * 0.1);
})

//////////////////////////////////////////////////////////////////////////////////
//		create THREEx.HtmlMixer						//
//////////////////////////////////////////////////////////////////////////////////
	var mixerContext= new THREEx.HtmlMixer.Context(renderer, scene, camera)

// handle window resize for mixerContext
window.addEventListener('resize', function(){
	mixerContext.rendererCss.setSize( window.innerWidth, window.innerHeight )
}, false)


//////////////////////////////////////////////////////////////////////////////////
//		mixerContext configuration and dom attachement
//////////////////////////////////////////////////////////////////////////////////

	// set up rendererCss
	var rendererCss		= mixerContext.rendererCss
rendererCss.setSize( window.innerWidth, window.innerHeight )
// set up rendererWebgl
var rendererWebgl	= mixerContext.rendererWebgl


var css3dElement		= rendererCss.domElement
css3dElement.style.position	= 'absolute'
css3dElement.style.top		= '0px'
css3dElement.style.width	= '100%'
css3dElement.style.height	= '100%'
webglcontent.appendChild(css3dElement);

var webglCanvas			= rendererWebgl.domElement
webglCanvas.style.position	= 'absolute'
webglCanvas.style.top		= '0px'
webglCanvas.style.width		= '100%'
webglCanvas.style.height	= '100%'
webglCanvas.style.pointerEvents	= 'none'
webglcontent.appendChild(webglCanvas);

//////////////////////////////////////////////////////////////////////////////////
//		create a Plane for THREEx.HtmlMixer				//
//////////////////////////////////////////////////////////////////////////////////
	// create the iframe element
	// Creation des plans des pages web.
	//
function addPageWeb(link, page_nb, out_of) {
	var url		= link;
	var domElement	= document.createElement('iframe')
	domElement.src	= url
	domElement.style.border	= 'none'

	// create the plane
	var mixerPlane	= new THREEx.HtmlMixer.Plane(mixerContext, domElement)
	mixerPlane.object3d.scale.multiplyScalar(2)

	var parent = new THREE.Object3D();
	scene.add(parent)

	parent.rotation.y = page_nb * 6.28 / out_of;
	parent.add(mixerPlane.object3d);
	parent.children[0].position.z = -2;

	return parent;
}

mainpage = addPageWeb('modules/terrain.html', 0, nb_pages);
page2 = addPageWeb('modules/weathermap.html', 1, nb_pages);
page1 = addPageWeb('modules/DangerRSS.html', 2, nb_pages);
page3 = addPageWeb('modules/power.html', 3, nb_pages);
page4 = addPageWeb('modules/Weather_log.html', 4, nb_pages);
page5 = addPageWeb('modules/logbook.html', 5, nb_pages);

//////////////////////////////////////////////////////////////////////////////////
//		Make it move							//
//////////////////////////////////////////////////////////////////////////////////

	// update it
	/*
	updateFcts.push(function(delta, now){
		mixerPlane.object3d.rotation.y += Math.PI * 2 * delta * 0.1;
	})
	*/

//////////////////////////////////////////////////////////////////////////////////
//		add objects in the scene					//
//////////////////////////////////////////////////////////////////////////////////

	/*
	var geometry	= new THREE.TorusKnotGeometry(0.5-0.125, 0.125);
var material	= new THREE.MeshNormalMaterial();
var mesh	= new THREE.Mesh( geometry, material );
mesh.position.set(+1,0,+0.5)
scene.add( mesh );

var geometry	= new THREE.TorusKnotGeometry(0.5-0.125, 0.125);
var material	= new THREE.MeshNormalMaterial();
var mesh	= new THREE.Mesh( geometry, material );
mesh.position.set(-1,0,-0.5)
scene.add( mesh );
*/

//////////////////////////////////////////////////////////////////////////////////
//		Camera Controls							//
//////////////////////////////////////////////////////////////////////////////////
	//var controls	= new THREE.OrbitControls(camera)
	//

// Add a sun.
sky = new THREE.Sky();
sky.scale.setScalar( 450000 );
scene.add( sky );
// Add Sun Helper
sunSphere = new THREE.Mesh(
	new THREE.SphereBufferGeometry( 20000, 16, 8 ),
	new THREE.MeshBasicMaterial( { color: 0xffffff } )
);
sunSphere.position.y = - 700000;
sunSphere.visible = false;
scene.add( sunSphere );

var uniforms = sky.material.uniforms;
uniforms.turbidity.value = 20.0;
uniforms.rayleigh.value = 3.1;
uniforms.luminance.value = 0.5;
uniforms.mieCoefficient.value = 0.1;
uniforms.mieDirectionalG.value = 0.8;
var theta = Math.PI * ( 0.36 - 0.5 );
var phi = 2 * Math.PI * ( 0.18 - 0.5 );
var distance = 400000;
sunSphere.position.x = distance * Math.cos( phi );
sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );
sunSphere.visible = true;
uniforms.sunPosition.value.copy( sunSphere.position );

//////////////////////////////////////////////////////////////////////////////////
//		handle resize							//
//////////////////////////////////////////////////////////////////////////////////

	function onResize(){
		// notify the renderer of the size change
		renderer.setSize( window.innerWidth, window.innerHeight )
		// update the camera
		camera.aspect	= window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()		
		matLine.resolution.set( innerWidth, innerHeight ); // resolution of the inset viewport
	}

window.addEventListener('resize', onResize, false)

//////////////////////////////////////////////////////////////////////////////////
//		render the scene						//
//////////////////////////////////////////////////////////////////////////////////
	// render the css3d
	updateFcts.push(function(delta, now){
		// NOTE: it must be after camera mode
		mixerContext.update(delta, now)
	})
// render the webgl
updateFcts.push(function(){
	renderer.render( scene, camera );		
})



//////////////////////////////////////////////////////////////////////////////////
//		loop runner							//
//////////////////////////////////////////////////////////////////////////////////
var lastTimeMsec= null

requestAnimationFrame(function animate(nowMsec){
	// keep looping
	requestAnimationFrame( animate );
	// measure time
	lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
	var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
	lastTimeMsec = nowMsec

	//animation de la camera
	var espilon = 0.03;
	if (camera.rotation.y < camera_max_rotate - espilon || camera.rotation.y > camera_max_rotate + espilon) {
		camera.rotation.y += direction * 0.001 * deltaMsec;
		if (camera.rotation.y > 6.28318530718) camera.rotation.y -= 6.28318530718;
		if (camera.rotation.y < 0) camera.rotation.y += 6.28318530718;
	}
	else {
		if (animation_running) {
			animation_running = false;
			camera.rotation.y = camera_max_rotate;
		}
	}
	// call each update function
	updateFcts.forEach(function(updateFn){
		updateFn(deltaMsec/1000, nowMsec/1000)
	})

})
