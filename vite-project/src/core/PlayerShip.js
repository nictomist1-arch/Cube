import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PLAYER_SHIP_CONFIG } from '../config/playerShip.js';
import { CAMERA_CONFIG } from '../config/camera.js';

const _forward = new THREE.Vector3();
const _right = new THREE.Vector3();
const _up = new THREE.Vector3( 0, 1, 0 );
const _accel = new THREE.Vector3();
const _lookAt = new THREE.Vector3();

export class PlayerShip {

	constructor() {

		this.group = new THREE.Group();
		this.group.name = 'playerShip';
		this.model = null;
		this.loaded = false;
		this.velocity = new THREE.Vector3();
		this.flyPitch = 0;
		this.flyRoll = 0;
		this.targetBank = 0;
		this.keys = {
			forward: false,
			back: false,
			left: false,
			right: false,
			up: false,
			down: false,
		};

		const { position } = PLAYER_SHIP_CONFIG;
		this.group.position.set( position.x, position.y, position.z );
		this.group.visible = false;

	}

	setVisible( visible ) {

		this.group.visible = visible;

		if ( ! visible ) {

			this.velocity.set( 0, 0, 0 );
			this.flyRoll = 0;
			this.targetBank = 0;

			for ( const key of Object.keys( this.keys ) ) {

				this.keys[ key ] = false;

			}

		}

	}

	isVisible() {

		return this.group.visible;

	}

	load( scene ) {

		const { url, scale, position } = PLAYER_SHIP_CONFIG;

		return new Promise( ( resolve, reject ) => {

			const loader = new GLTFLoader();
			loader.load(
				url,
				( gltf ) => {

					this.model = gltf.scene;
					this.model.scale.setScalar( scale );
					this.model.position.set( position.x, position.y, position.z );

					this.model.traverse( ( child ) => {

						if ( child.isMesh ) {

							child.castShadow = true;
							child.receiveShadow = true;

						}

					} );

					this.group.add( this.model );
					scene.add( this.group );
					this.loaded = true;
					resolve( this );

				},
				undefined,
				reject
			);

		} );

	}

	getPosition() {

		return this.group.position;

	}

	getObject() {

		return this.group;

	}

	setKeys( keys ) {

		Object.assign( this.keys, keys );

	}

	applyFlyLook( deltaX, deltaY ) {

		const { lookSensitivity } = CAMERA_CONFIG.fly;

		this.group.rotation.y -= deltaX * lookSensitivity;
		this.flyPitch -= deltaY * lookSensitivity;

	}

	/** Точка взгляда камеры — чуть впереди носа корабля */
	getChaseLookAt( target = _lookAt ) {

		const { lookAhead } = CAMERA_CONFIG.fly.chase;
		const off = PLAYER_SHIP_CONFIG.lookAtOffset ?? { x: 0, y: 0.35, z: 0 };

		_forward.set( 0, 0, -1 ).applyQuaternion( this.group.quaternion );

		return target.set(
			this.group.position.x + off.x + _forward.x * lookAhead,
			this.group.position.y + off.y + _forward.y * lookAhead,
			this.group.position.z + off.z + _forward.z * lookAhead
		);

	}

	updateFly( delta ) {

		if ( ! this.loaded ) return;

		const fly = CAMERA_CONFIG.fly;

		_forward.set( 0, 0, -1 ).applyQuaternion( this.group.quaternion );
		_right.set( 1, 0, 0 ).applyQuaternion( this.group.quaternion );

		_accel.set( 0, 0, 0 );

		if ( this.keys.forward ) _accel.add( _forward );
		if ( this.keys.back ) _accel.sub( _forward );
		if ( this.keys.right ) _accel.addScaledVector( _right, fly.strafeFactor );
		if ( this.keys.left ) _accel.addScaledVector( _right, -fly.strafeFactor );
		if ( this.keys.up ) _accel.addScaledVector( _up, fly.verticalFactor );
		if ( this.keys.down ) _accel.addScaledVector( _up, -fly.verticalFactor );

		if ( _accel.lengthSq() > 0 ) {

			_accel.normalize().multiplyScalar( fly.thrust * delta );
			this.velocity.add( _accel );

		}

		const speed = this.velocity.length();

		if ( speed > fly.maxSpeed ) {

			this.velocity.multiplyScalar( fly.maxSpeed / speed );

		}

		const drag = Math.max( 0, 1 - fly.drag * delta );
		this.velocity.multiplyScalar( drag );
		this.group.position.addScaledVector( this.velocity, delta );

		this.targetBank = 0;

		if ( this.keys.left ) this.targetBank = fly.bankAmount;
		if ( this.keys.right ) this.targetBank = -fly.bankAmount;

		const bankT = 1 - Math.exp( -fly.bankSpeed * delta );
		this.flyRoll += ( this.targetBank - this.flyRoll ) * bankT;

		this.group.rotation.x = this.flyPitch;
		this.group.rotation.z = this.flyRoll;

	}

	applyEnvMap( envMap, intensity ) {

		if ( ! this.model ) return;

		this.model.traverse( ( child ) => {

			if ( child.isMesh && child.material ) {

				const materials = Array.isArray( child.material )
					? child.material
					: [ child.material ];

				for ( const mat of materials ) {

					if ( mat.isMeshStandardMaterial ) {

						mat.envMap = envMap;
						mat.envMapIntensity = intensity;
						mat.needsUpdate = true;

					}

				}

			}

		} );

	}

}
