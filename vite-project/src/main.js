import * as THREE from 'three';
import { SceneManager } from './core/SceneManager.js';
import { CameraManager } from './core/CameraManager.js';
import { LightManager } from './core/LightManager.js';
import { TextureLoader } from './core/TextureLoader.js';
import { SphereObject } from './core/SphereObject.js';
import { SkySettings } from './config/SkySettings.js';
import { TEXTURES_CONFIG } from './config/texture.js';
import { TweakpaneUI, createDefaultParams } from './ui/TweakpaneUI.js';
import { LensflareMode } from './modes/LensflareMode.js';
import { SceneModeManager } from './modes/SceneModeManager.js';

class Main {

	constructor() {

		this.sceneManager = null;
		this.cameraManager = null;
		this.renderer = null;
		this.camera = null;
		this.lightManager = null;
		this.controls = null;
		this.clock = new THREE.Clock();
		this.sphere = null;
		this.skySettings = null;
		this.params = null;
		this.ui = null;
		this.grid = null;
		this.sceneModeManager = null;
		this.lensflareMode = null;
		this.init();

	}

	init() {

		this.renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.shadowMap.enabled = true;
		this.renderer.setPixelRatio( window.devicePixelRatio );
		document.body.appendChild( this.renderer.domElement );

		this.skySettings = new SkySettings();

		this.sceneManager = new SceneManager();
		const scene = this.sceneManager.create();
		this.skySettings.addStars( scene );

		this.sphereObject = new SphereObject();
		this.sphere = this.sphereObject.create();
		scene.add( this.sphere );

		this.textureLoader = new TextureLoader( scene );
		this.textureLoader.loadAll( {
			onCubeLoad: ( cubeTexture ) => {

				this.skySettings.addAnimatedSpheres( scene, cubeTexture );
				this.textureLoader.applyEnvMapTo( this.sphere );
				this._registerDefaultVisibility();

			},
			onSphereBarkLoad: ( maps ) => {

				this._applySphereTexture( maps );

			},
		} );

		this.cameraManager = new CameraManager( this.renderer.domElement );
		this.camera = this.cameraManager.create( window.innerWidth / window.innerHeight );
		this.cameraManager.createControls();
		this.lightManager = new LightManager( scene );
		this.lightManager.createAll();

		this.params = createDefaultParams( {
			sphereMaterial: this.sphere.material,
			lightManager: this.lightManager,
			envMapIntensity: TEXTURES_CONFIG.envMapIntensity,
		} );

		this.ui = new TweakpaneUI( {
			params: this.params,
			getSphere: () => this.sphere,
			lightManager: this.lightManager,
			onEnvMapIntensityChange: ( intensity ) => {

				TEXTURES_CONFIG.envMapIntensity = intensity;
				this.textureLoader.applyEnvMapTo( this.sphere );

			},
			onModeToggle: () => this.sceneModeManager?.toggle(),
		} );

		this.grid = new THREE.GridHelper( 10, 20, 0x00ff00, 0x00aa00 );
		this.grid.position.y = -1;
		scene.add( this.grid );

		this.lensflareMode = new LensflareMode( scene );

		this.sceneModeManager = new SceneModeManager( {
			scene,
			cameraManager: this.cameraManager,
			lensflareMode: this.lensflareMode,
			defaultVisibility: [],
		} );

		this._registerDefaultVisibility();
		this._bindModeSwitch();

		window.addEventListener( 'resize', () => {

			this.cameraManager.onWindowResize();
			this.renderer.setSize( window.innerWidth, window.innerHeight );

		} );

	}

	_registerDefaultVisibility() {

		const scene = this.sceneManager.getScene();
		const hemiHelper = this.lightManager.getHelper( 'hemisphere' );

		this.sceneModeManager.defaultVisibility = [
			{ object: this.sphere },
			{ object: this.grid },
			{ object: this.skySettings.stars },
			{ object: this.skySettings._root },
			{ object: this.lightManager.getLight( 'hemisphere' ) },
			{ object: this.lightManager.getLight( 'main' ) },
			{ object: hemiHelper },
		].filter( ( item ) => item.object );

	}

	_bindModeSwitch() {

		const hint = document.getElementById( 'mode-hint' );

		window.addEventListener( 'keydown', ( event ) => {

			if ( event.code === 'KeyM' || event.code === 'Tab' ) {

				event.preventDefault();
				this.sceneModeManager.toggle();

			}

		} );

		this.sceneModeManager.onModeChange = ( mode ) => {

			this.ui?.setSceneMode( mode );

			if ( hint ) {

				hint.textContent = mode === 'lensflare'
					? 'Режим: Lens Flares — WASD/RF/QE + мышь. M или Tab — обратно'
					: 'Режим: сцена со сферой. M или Tab — Lens Flares + полёт';

			}

		};

		if ( hint ) {

			hint.textContent = 'Режим: сцена со сферой. M или Tab — Lens Flares + полёт';

		}

	}

	_applySphereTexture( maps ) {

		const scene = this.sceneManager.getScene();

		scene.remove( this.sphere );
		this.sphere.geometry.dispose();
		this.sphere.material.dispose();

		this.sphere = this.sphereObject.create( maps );
		scene.add( this.sphere );
		this.textureLoader.applyEnvMapTo( this.sphere );

		if ( this.params ) {

			const material = this.sphere.material;
			material.metalness = this.params.metalness;
			material.roughness = this.params.roughness;
			material.bumpScale = this.params.bumpScale;

		}

		this._registerDefaultVisibility();

	}

	animate() {

		requestAnimationFrame( () => this.animate() );

		const delta = this.clock.getDelta();
		const isLensflare = this.sceneModeManager?.isLensflare();

		if ( ! isLensflare && this.sphere ) {

			this.sphere.rotation.y += this.params?.rotationSpeed ?? 0.004;

		}

		if ( ! isLensflare ) {

			this.skySettings.updateSpheres();

		}

		this.cameraManager.update( delta );

		this.renderer.render(
			this.sceneManager.getScene(),
			this.cameraManager.getCamera()
		);

	}

}

const game = new Main();
game.animate();
