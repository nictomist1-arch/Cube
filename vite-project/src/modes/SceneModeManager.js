import * as THREE from 'three';
import { SCENE_CONFIG } from '../config/scene.js';

/**
 * Переключение между обычной сценой (OrbitControls) и lens flares (FlyControls).
 */
export class SceneModeManager {

	constructor( {
		scene,
		cameraManager,
		lensflareMode,
		defaultVisibility,
		onModeChange,
	} ) {

		this.scene = scene;
		this.cameraManager = cameraManager;
		this.lensflareMode = lensflareMode;
		this.defaultVisibility = defaultVisibility;
		this.onModeChange = onModeChange;
		this.mode = 'default';

	}

	getMode() {

		return this.mode;

	}

	isLensflare() {

		return this.mode === 'lensflare';

	}

	toggle() {

		this.setMode( this.mode === 'default' ? 'lensflare' : 'default' );

	}

	setMode( mode ) {

		if ( mode === this.mode ) return;

		if ( mode === 'lensflare' ) {

			this._enterLensflare();

		} else {

			this._enterDefault();

		}

		this.mode = mode;

		if ( this.onModeChange ) {

			this.onModeChange( mode );

		}

	}

	_enterLensflare() {

		this._setDefaultVisible( false );
		this.lensflareMode.activate();
		this.cameraManager.switchToFly();

	}

	_enterDefault() {

		this.lensflareMode.deactivate();
		this._setDefaultVisible( true );
		this.cameraManager.switchToOrbit();
		this._restoreDefaultScene();

	}

	_restoreDefaultScene() {

		this.scene.background = new THREE.Color( SCENE_CONFIG.background );

		if ( SCENE_CONFIG.fog.enable ) {

			this.scene.fog = new THREE.FogExp2(
				SCENE_CONFIG.fog.color,
				SCENE_CONFIG.fog.density
			);

		} else {

			this.scene.fog = null;

		}

	}

	_setDefaultVisible( visible ) {

		for ( const item of this.defaultVisibility ) {

			if ( item?.object ) {

				item.object.visible = visible;

			}

		}

	}

}
