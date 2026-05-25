import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import { CAMERA_CONFIG } from '../config/camera.js';
import { LENSFLARE_CONFIG } from '../config/lensflare.js';

export class CameraManager {

	constructor( renderDomElement ) {

		this.camera = null;
		this.controls = null;
		this.renderDomElement = renderDomElement;
		this.controlMode = 'orbit';

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

		return this.camera;

	}

	createControls() {

		return this.switchToOrbit();

	}

	_disposeControls() {

		if ( this.controls ) {

			this.controls.dispose();
			this.controls = null;

		}

	}

	switchToOrbit() {

		this._disposeControls();

		this.controlMode = 'orbit';

		this.camera.fov = CAMERA_CONFIG.fov;
		this.camera.near = CAMERA_CONFIG.near;
		this.camera.far = CAMERA_CONFIG.far;
		this.camera.position.set(
			CAMERA_CONFIG.position.x,
			CAMERA_CONFIG.position.y,
			CAMERA_CONFIG.position.z,
		);
		this.camera.updateProjectionMatrix();

		this.controls = new OrbitControls( this.camera, this.renderDomElement );
		this.controls.enablePan = CAMERA_CONFIG.controls.enablePan;
		this.controls.enableDamping = CAMERA_CONFIG.controls.enableDamping;
		this.controls.enableZoom = CAMERA_CONFIG.controls.enableZoom;
		this.controls.dampingFactor = CAMERA_CONFIG.controls.dampingFactor;
		this.controls.autoRotate = CAMERA_CONFIG.controls.autoRotate;
		this.controls.rotateSpeed = CAMERA_CONFIG.controls.rotateSpeed;
		this.controls.zoomSpeed = CAMERA_CONFIG.controls.zoomSpeed;
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

		const cfg = LENSFLARE_CONFIG.camera;
		const ctrl = LENSFLARE_CONFIG.controls;

		this.camera.fov = cfg.fov;
		this.camera.near = cfg.near;
		this.camera.far = cfg.far;
		this.camera.position.set( cfg.position.x, cfg.position.y, cfg.position.z );
		this.camera.updateProjectionMatrix();

		this.controls = new FlyControls( this.camera, this.renderDomElement );
		this.controls.movementSpeed = ctrl.movementSpeed;
		this.controls.rollSpeed = ctrl.rollSpeed;
		this.controls.autoForward = ctrl.autoForward;
		this.controls.dragToLook = ctrl.dragToLook;

		return this.controls;

	}

	onWindowResize() {

		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

	}

	update( delta ) {

		if ( ! this.controls ) return;

		if ( this.controlMode === 'fly' ) {

			this.controls.update( delta );

		} else {

			this.controls.update();

		}

	}

	getCamera() {

		return this.camera;

	}

	getControls() {

		return this.controls;

	}

	isFlyMode() {

		return this.controlMode === 'fly';

	}

}
