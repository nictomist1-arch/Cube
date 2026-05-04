import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.55);
scene.add(hemisphereLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
directionalLight.position.set(10, 14, 8);
scene.add(directionalLight);

const geometry = new THREE.BoxGeometry(5, 5, 5);
const material = new THREE.MeshStandardMaterial({
	color: 0x00ff00,
	roughness: 0.45,
	metalness: 0.15
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const sphereGeometry = new THREE.SphereGeometry(3, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
	color: 0x2194ce,
	roughness: 0.35,
	metalness: 0.2
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = 8;
scene.add(sphere);

camera.position.z = 20;

function animate() {
	requestAnimationFrame(animate);
	const time = Date.now() * 0.001;

	cube.position.x = Math.sin(time) * 5;
	cube.position.y = Math.cos(time) * 1.5;
	sphere.position.x = cube.position.x + 8;
	sphere.position.y = cube.position.y;

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	sphere.rotation.y += 0.01;
	renderer.render(scene, camera);
}

animate();
