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

// Dashboard : previous
$( " #previous" ).click(function() {
	alert( "Handler for .click() called." );
});

// Dashboard : next
$( " #navigation" ).click(function() {
	alert( "Handler for .click() called." );
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
var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000 );
camera.position.z = 3;

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
function addPageWeb(link) {
	var url		= link;
	var domElement	= document.createElement('iframe')
	domElement.src	= url
	domElement.style.border	= 'none'

	// create the plane
	var mixerPlane	= new THREEx.HtmlMixer.Plane(mixerContext, domElement)
	mixerPlane.object3d.scale.multiplyScalar(2)
	scene.add(mixerPlane.object3d)
	return mixerPlane;
}

mainpage = addPageWeb('index_backup.html');
page2 = addPageWeb('index_backup.html');
pageLeft = addPageWeb('index_backup.html');
//console.log(page2);
page2.object3d.position.x = 2.1;
pageLeft.object3d.position.x = -2.1;

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

//////////////////////////////////////////////////////////////////////////////////
//		handle resize							//
//////////////////////////////////////////////////////////////////////////////////

	function onResize(){
		// notify the renderer of the size change
		renderer.setSize( window.innerWidth, window.innerHeight )
		// update the camera
		camera.aspect	= window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()		
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
	lastTimeMsec	= nowMsec
	// call each update function
	updateFcts.forEach(function(updateFn){
		updateFn(deltaMsec/1000, nowMsec/1000)
	})
})
