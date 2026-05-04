import * as THREE from 'three';
import { SceneManager } from './core/SceneManager.js';
import { CameraManager } from './core/CameManager.js';
import { LIGHTS_CONFIG } from './config/light.js';

class Main {
	constructor() {
		this.sceneManager = new SceneManager();
		this.cameraManager = new CameraManager();

		this.scene = this.sceneManager.create();
		this.camera = this.cameraManager.create(
			window.innerWidth / window.innerHeight
		);

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;
		document.body.appendChild(this.renderer.domElement);

		this.createLights();
		this.createObjects();
		this.bindEvents();
		this.animate();
	}

	createLights() {
		const preset =
			LIGHTS_CONFIG.presets[LIGHTS_CONFIG.activePreset] ??
			LIGHTS_CONFIG.presets.day;

		if (preset.ambient.enabled) {
			const ambientLight = new THREE.AmbientLight(
				preset.ambient.color,
				preset.ambient.intensity
			);
			this.scene.add(ambientLight);
		}

		if (preset.hemisphere.enabled) {
			const hemisphereLight = new THREE.HemisphereLight(
				preset.hemisphere.skyColor,
				preset.hemisphere.groundColor,
				preset.hemisphere.intensity
			);
			this.scene.add(hemisphereLight);
		}

		if (preset.main.enabled) {
			this.mainLight = new THREE.DirectionalLight(
				preset.main.color,
				preset.main.intensity
			);
			this.mainLight.position.set(
				preset.main.position.x,
				preset.main.position.y,
				preset.main.position.z
			);
			this.mainLight.castShadow = preset.main.castShadow;
			this.mainLight.shadow.mapSize.set(
				preset.main.shadowMapSize.width,
				preset.main.shadowMapSize.height
			);
			this.mainLight.shadow.camera.near = preset.main.shadowCamera.near;
			this.mainLight.shadow.camera.far = preset.main.shadowCamera.far;
			this.mainLight.shadow.camera.left = preset.main.shadowCamera.left;
			this.mainLight.shadow.camera.right = preset.main.shadowCamera.right;
			this.mainLight.shadow.camera.top = preset.main.shadowCamera.top;
			this.mainLight.shadow.camera.bottom = preset.main.shadowCamera.bottom;
			this.mainLight.shadow.camera.updateProjectionMatrix();
			this.scene.add(this.mainLight);
		}

		if (preset.fill.enabled) {
			const fillLight = new THREE.PointLight(
				preset.fill.color,
				preset.fill.intensity,
				120
			);
			fillLight.position.set(
				preset.fill.position.x,
				preset.fill.position.y,
				preset.fill.position.z
			);
			this.scene.add(fillLight);
		}

		if (preset.rim.enabled) {
			const rimLight = new THREE.SpotLight(
				preset.rim.color,
				preset.rim.intensity,
				100,
				Math.PI / 6,
				0.4
			);
			rimLight.position.set(
				preset.rim.position.x,
				preset.rim.position.y,
				preset.rim.position.z
			);
			rimLight.target.position.set(0, 1, 0);
			this.scene.add(rimLight.target);
			this.scene.add(rimLight);
		}

		if (LIGHTS_CONFIG.helpers.enabled && this.mainLight) {
				const directionalHelper = new THREE.DirectionalLightHelper(
					this.mainLight,
					2
				);
				this.scene.add(directionalHelper);
				const shadowCameraHelper = new THREE.CameraHelper(
					this.mainLight.shadow.camera
				);
				this.scene.add(shadowCameraHelper);
		}
	}

	createObjects() {
		this.cube = new THREE.Mesh(
			new THREE.BoxGeometry(5, 5, 5),
			new THREE.MeshStandardMaterial({
				color: 0x00ff00,
				roughness: 0.45,
				metalness: 0.15
			})
		);
		this.cube.castShadow = true;
		this.scene.add(this.cube);

		this.sphere = new THREE.Mesh(
			new THREE.SphereGeometry(3, 32, 32),
			new THREE.MeshStandardMaterial({
				color: 0x2194ce,
				roughness: 0.35,
				metalness: 0.2
			})
		);
		this.sphere.castShadow = true;
		this.sphere.position.x = 8;
		this.scene.add(this.sphere);

		const floor = new THREE.Mesh(
			new THREE.PlaneGeometry(80, 80),
			new THREE.MeshStandardMaterial({
				color: 0x2a2a2a,
				roughness: 0.95,
				metalness: 0
			})
		);
		floor.rotation.x = -Math.PI / 2;
		floor.position.y = -5;
		floor.receiveShadow = true;
		this.scene.add(floor);
	}

	bindEvents() {
		window.addEventListener('resize', () => {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		});
	}

	animate = () => {
		requestAnimationFrame(this.animate);
		const time = Date.now() * 0.001;

		this.cube.position.x = Math.sin(time) * 5;
		this.cube.position.y = Math.cos(time) * 1.5 + 1;
		this.sphere.position.x = this.cube.position.x + 8;
		this.sphere.position.y = this.cube.position.y;

		this.cube.rotation.x += 0.01;
		this.cube.rotation.y += 0.01;
		this.sphere.rotation.y += 0.01;

		this.renderer.render(this.scene, this.camera);
	};
}

new Main();