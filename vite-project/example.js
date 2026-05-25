import * as THREE from 'three';
        // создание сцены
const scene = new THREE.Scene();
        // камера - угол наклона, расположение, размер экрана
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        // отрисовка 
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 5;
scene.add(camera);
        // освещение
const spotLight = new THREE.SpotLight(0xffffff, 1);
scene.add(spotLight);
spotLight.position.set(15, 15, 10);
const light = new THREE.AmbientLight(0x404040, 1);
scene.add(light);


const geometry = new THREE.SphereGeometry(1, 32, 32);
const as = new THREE.MeshStandardMaterial({ color: 0x800080, roughness: 0.1, metalness: 0.8 });
const sphere = new THREE.Mesh(geometry, as);
sphere.position.x = -2; 
scene.add(sphere);

const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
const material = new THREE.MeshStandardMaterial({ color: 0xffff00, roughness: 0.5, metalness: 0.5 });
const cylinder = new THREE.Mesh(cylinderGeometry, material);
cylinder.position.y = 2;
scene.add(cylinder);

const coneGeometry = new THREE.ConeGeometry(1, 2, 32);
const coneMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00, roughness: 0.5, metalness: 0.5 });
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.x = 2;
scene.add(cone);

camera.position.z = 5;

function render(){
    requestAnimationFrame(render);
    cylinder.rotation.x += 0.01;
    cylinder.rotation.y += 0.01;
    
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    cone.rotation.x += 0.01;
    cone.rotation.y += 0.01;
    
    renderer.render(scene, camera);
}
render();