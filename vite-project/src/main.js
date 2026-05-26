import * as THREE from 'three';
import { SceneManager } from './core/SceneManager.js';
import { CameraManager } from './core/CameraManager.js';
import { LightManager } from './core/LightManager.js';
import { TextureLoader } from './core/TextureLoader.js';
import { SphereObject } from './core/SphereObject.js';
import { PlayerShip } from './core/PlayerShip.js';
import { Asteroid } from './core/Asteroid.js';
import { SkySettings } from './config/SkySettings.js';
import { TEXTURES_CONFIG } from './config/texture.js';
import { TweakpaneUI, createDefaultParams } from './ui/TweakpaneUI.js';

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
		this.playerShip = null;
		this.asteroid = null;
		this.impactFlash = 0;
		this.shipKeys = {
			forward: false,
			back: false,
			left: false,
			right: false,
			up: false,
			down: false,
		};
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
				if ( this.playerShip?.loaded ) {

					this.textureLoader.applyEnvMapTo( this.playerShip.getObject() );

				}

				if ( this.asteroid?.loaded ) {

					this.textureLoader.applyEnvMapTo( this.asteroid.getObject() );

				}

			},
			onSphereBarkLoad: ( maps ) => {

				this._applySphereTexture( maps );

			},
		} );

		this.cameraManager = new CameraManager( this.renderer.domElement, scene );
		this.camera = this.cameraManager.create( window.innerWidth / window.innerHeight );
		this.cameraManager.createControls();

		this.playerShip = new PlayerShip();
		this.playerShip.load( scene ).then( () => {

			this.cameraManager.setPlayerShip( this.playerShip );
			this.textureLoader.applyEnvMapTo( this.playerShip.getObject() );

		} ).catch( ( err ) => {

			console.error( 'Не удалось загрузить scout.glb:', err );

		} );

		this.asteroid = new Asteroid();
		this.asteroid.load( scene ).then( () => {

			this.textureLoader.applyEnvMapTo( this.asteroid.getObject() );

		} ).catch( ( err ) => {

			console.error( 'Не удалось загрузить asteroid2.glb:', err );
			console.info( 'Положите модель в public/models/asteroid2.glb' );

		} );

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
			onControlModeToggle: () => this._toggleControlMode(),
		} );

		const grid = new THREE.GridHelper( 10, 20, 0x00ff00, 0x00aa00 );
		grid.position.y = -1;
		scene.add( grid );

		this._bindControlModeSwitch();
		this._bindFlyShipControls();

		window.addEventListener( 'resize', () => {

			this.cameraManager.onWindowResize();
			this.renderer.setSize( window.innerWidth, window.innerHeight );

		} );

	}

	_toggleControlMode() {

		this.cameraManager.toggleControlMode();
		this._clearShipKeys();
		this._updateControlModeHint();

	}

	_clearShipKeys() {

		for ( const key of Object.keys( this.shipKeys ) ) {

			this.shipKeys[ key ] = false;

		}

		this.playerShip?.setKeys( this.shipKeys );

	}

	_bindControlModeSwitch() {

		window.addEventListener( 'keydown', ( event ) => {

			if ( event.code === 'KeyM' || event.code === 'Tab' ) {

				event.preventDefault();
				this._toggleControlMode();

			}

		} );

		this._updateControlModeHint();

	}

	_updateControlModeHint() {

		const hint = document.getElementById( 'mode-hint' );
		const isFly = this.cameraManager.isFlyMode();

		this.ui?.setControlMode( isFly ? 'fly' : 'orbit' );

		if ( ! hint ) return;

		hint.textContent = isFly
			? 'Режим: полёт за scout — WASD/стрелки, R/F, ЛКМ+мышь. M или Tab — орбита'
			: 'Режим: орбита — мышь + колёсико. M или Tab — полёт за кораблём';

	}

	_bindFlyShipControls() {

		const keyMap = {
			KeyW: 'forward',
			KeyS: 'back',
			KeyA: 'left',
			KeyD: 'right',
			KeyR: 'up',
			KeyF: 'down',
			ArrowUp: 'forward',
			ArrowDown: 'back',
			ArrowLeft: 'left',
			ArrowRight: 'right',
		};

		const setKey = ( code, pressed ) => {

			if ( ! this.cameraManager?.isFlyMode() ) return;

			const prop = keyMap[ code ];
			if ( ! prop ) return;
			this.shipKeys[ prop ] = pressed;
			this.playerShip?.setKeys( this.shipKeys );

		};

		window.addEventListener( 'keydown', ( event ) => {

			if ( event.repeat || ! this.cameraManager?.isFlyMode() ) return;
			setKey( event.code, true );

		} );

		window.addEventListener( 'keyup', ( event ) => {

			if ( ! this.cameraManager?.isFlyMode() ) return;
			setKey( event.code, false );

		} );

	}

	_onAsteroidHitSphere() {

		this.impactFlash = 1;

	}

	_updateImpactFlash( delta ) {

		if ( ! this.sphere?.material ) return;

		const material = this.sphere.material;

		if ( this.impactFlash <= 0 ) {

			if ( material.emissive ) {

				material.emissive.setHex( 0x000000 );
				material.emissiveIntensity = 0;

			}

			return;

		}

		this.impactFlash = Math.max( 0, this.impactFlash - delta * 2.5 );
		const strength = this.impactFlash * 0.35;

		if ( material.emissive ) {

			material.emissive.setRGB( strength, strength * 0.35, 0 );
			material.emissiveIntensity = strength;

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

	}

	animate() {

		requestAnimationFrame( () => this.animate() );

		const delta = this.clock.getDelta();

		if ( this.sphere ) {

			this.sphere.rotation.y += this.params?.rotationSpeed ?? 0.004;

		}

		if ( this.cameraManager.isFlyMode() ) {

			this.playerShip?.setKeys( this.shipKeys );

		}

		this.asteroid?.update( delta, () => this._onAsteroidHitSphere() );
		this._updateImpactFlash( delta );

		this.cameraManager.update( delta );
		this.skySettings.updateSpheres();

		this.renderer.render(
			this.sceneManager.getScene(),
			this.cameraManager.getCamera()
		);

	}

}

const game = new Main();
game.animate();
