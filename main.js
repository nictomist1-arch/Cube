import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101820);

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.55);
scene.add(hemisphereLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
directionalLight.position.set(10, 14, 8);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
scene.add(directionalLight);

const geometry = new THREE.BoxGeometry(5, 5, 5);
const material = new THREE.MeshStandardMaterial({
	color: 0x00ff00,
	roughness: 0.45,
	metalness: 0.15
});
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
scene.add(cube);

const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
	color: 0x2194ce,
	roughness: 0.35,
	metalness: 0.2
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = 8;
sphere.castShadow = true;
scene.add(sphere);

const floorGeometry = new THREE.PlaneGeometry(80, 80);
const floorMaterial = new THREE.MeshStandardMaterial({
	color: 0x2a2a2a,
	roughness: 0.95,
	metalness: 0
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -5;
floor.receiveShadow = true;
scene.add(floor);

camera.position.z = 20;
camera.position.y = 6;
camera.lookAt(0, 0, 0);

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
	requestAnimationFrame(animate);
	const time = Date.now() * 0.001;

	cube.position.x = Math.sin(time) * 5;
	cube.position.y = Math.cos(time) * 1.5 + 1;
	sphere.position.x = cube.position.x + 8;
	sphere.position.y = cube.position.y;

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	sphere.rotation.y += 0.01;
	renderer.render(scene, camera);
}

animate();
