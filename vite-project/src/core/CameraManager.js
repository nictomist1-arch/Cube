import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CAMERA_CONFIG } from '../config/camera.js';

const _lookAt = new THREE.Vector3();
const _smoothLookAt = new THREE.Vector3();
const _desiredPos = new THREE.Vector3();
const _behind = new THREE.Vector3();

export class CameraManager {

	constructor( renderDomElement, scene ) {

		this.camera = null;
		this.controls = null;
		this.renderDomElement = renderDomElement;
		this.scene = scene;
		this.controlMode = 'orbit';
		this.playerShip = null;
		this._flyLookActive = false;
		this._onFlyPointerDown = null;
		this._onFlyPointerUp = null;
		this._onFlyPointerMove = null;
		this._chaseInitialized = false;

	}

	create( aspect ) {

		this.camera = new THREE.PerspectiveCamera(
			CAMERA_CONFIG.fov,
			aspect,
			CAMERA_CONFIG.near,
			CAMERA_CONFIG.far
		);

		this.camera.position.set(
			CAMERA_CONFIG.position.x,
			CAMERA_CONFIG.position.y,
			CAMERA_CONFIG.position.z,
		);

		this.camera.lookAt(
			CAMERA_CONFIG.target.x,
			CAMERA_CONFIG.target.y,
			CAMERA_CONFIG.target.z
		);

		_smoothLookAt.set(
			CAMERA_CONFIG.target.x,
			CAMERA_CONFIG.target.y,
			CAMERA_CONFIG.target.z
		);

		return this.camera;

	}

	createControls() {

		return this.switchToOrbit();

	}

	setPlayerShip( playerShip ) {

		this.playerShip = playerShip;
		this._updateShipVisibility();

	}

	_updateShipVisibility() {

		if ( ! this.playerShip?.loaded ) return;

		this.playerShip.setVisible( this.controlMode === 'fly' );

	}

	_disposeControls() {

		this._unbindFlyLook();

		if ( this.controls ) {

			this.controls.dispose();
			this.controls = null;

		}

	}

	_bindFlyLook() {

		if ( this._onFlyPointerDown || ! this.playerShip?.loaded ) return;

		const dom = this.renderDomElement;

		this._onFlyPointerDown = ( event ) => {

			if ( event.button !== 0 ) return;

			this._flyLookActive = true;
			dom.setPointerCapture( event.pointerId );

		};

		this._onFlyPointerUp = ( event ) => {

			this._flyLookActive = false;

			if ( dom.hasPointerCapture( event.pointerId ) ) {

				dom.releasePointerCapture( event.pointerId );

			}

		};

		this._onFlyPointerMove = ( event ) => {

			if ( ! this._flyLookActive ) return;

			this.playerShip.applyFlyLook( event.movementX, event.movementY );

		};

		dom.addEventListener( 'pointerdown', this._onFlyPointerDown );
		dom.addEventListener( 'pointerup', this._onFlyPointerUp );
		dom.addEventListener( 'pointercancel', this._onFlyPointerUp );
		dom.addEventListener( 'pointermove', this._onFlyPointerMove );

	}

	_unbindFlyLook() {

		if ( ! this._onFlyPointerDown ) return;

		const dom = this.renderDomElement;

		dom.removeEventListener( 'pointerdown', this._onFlyPointerDown );
		dom.removeEventListener( 'pointerup', this._onFlyPointerUp );
		dom.removeEventListener( 'pointercancel', this._onFlyPointerUp );
		dom.removeEventListener( 'pointermove', this._onFlyPointerMove );

		this._onFlyPointerDown = null;
		this._onFlyPointerUp = null;
		this._onFlyPointerMove = null;
		this._flyLookActive = false;

	}

	_initFlyChaseCamera() {

		if ( ! this.playerShip?.loaded ) return;

		const chase = CAMERA_CONFIG.fly.chase;

		this.playerShip.getChaseLookAt( _smoothLookAt );

		_behind.set( 0, chase.height, chase.distance );
		_behind.applyQuaternion( this.playerShip.getObject().quaternion );

		this.camera.position.copy( this.playerShip.getPosition() ).add( _behind );
		this.camera.lookAt( _smoothLookAt );
		this._chaseInitialized = true;

	}

	_updateFlyChaseCamera( delta ) {

		if ( ! this.playerShip?.loaded ) return;

		const chase = CAMERA_CONFIG.fly.chase;
		const ship = this.playerShip.getObject();

		this.playerShip.getChaseLookAt( _lookAt );

		_behind.set( 0, chase.height, chase.distance );
		_behind.applyQuaternion( ship.quaternion );
		_desiredPos.copy( ship.position ).add( _behind );

		const posT = 1 - Math.exp( -chase.positionSmoothing * 60 * delta );
		const lookT = 1 - Math.exp( -chase.lookSmoothing * 60 * delta );

		this.camera.position.lerp( _desiredPos, posT );
		_smoothLookAt.lerp( _lookAt, lookT );
		this.camera.lookAt( _smoothLookAt );

	}

	switchToOrbit() {

		this._disposeControls();
		this.controlMode = 'orbit';
		this._chaseInitialized = false;
		this._updateShipVisibility();
		this.renderDomElement.style.cursor = '';

		const orbit = CAMERA_CONFIG.orbit;

		this.controls = new OrbitControls( this.camera, this.renderDomElement );
		this.controls.enablePan = orbit.enablePan;
		this.controls.enableDamping = orbit.enableDamping;
		this.controls.enableZoom = orbit.enableZoom;
		this.controls.dampingFactor = orbit.dampingFactor;
		this.controls.autoRotate = orbit.autoRotate;
		this.controls.rotateSpeed = orbit.rotateSpeed;
		this.controls.zoomSpeed = orbit.zoomSpeed;
		this.controls.target.set(
			CAMERA_CONFIG.target.x,
			CAMERA_CONFIG.target.y,
			CAMERA_CONFIG.target.z
		);

		return this.controls;

	}

	switchToFly() {

		this._disposeControls();
		this.controlMode = 'fly';
		this._updateShipVisibility();
		this.renderDomElement.style.cursor = 'crosshair';

		this._bindFlyLook();
		this._initFlyChaseCamera();

		return null;

	}

	toggleControlMode() {

		if ( this.controlMode === 'orbit' ) {

			this.switchToFly();

		} else {

			this.switchToOrbit();

		}

		return this.controlMode;

	}

	isFlyMode() {

		return this.controlMode === 'fly';

	}

	isOrbitMode() {

		return this.controlMode === 'orbit';

	}

	onWindowResize() {

		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

	}

	update( delta ) {

		if ( this.controlMode === 'fly' && this.playerShip?.loaded ) {

			this.playerShip.updateFly( delta );
			this._updateFlyChaseCamera( delta );
			return;

		}

		if ( ! this.controls ) return;

		this.controls.update();

	}

	getCamera() {

		return this.camera;

	}

	getControls() {

		return this.controls;

	}

	getControlMode() {

		return this.controlMode;

	}

}
