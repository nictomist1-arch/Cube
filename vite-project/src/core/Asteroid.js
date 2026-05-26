import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';
import { ASTEROID_CONFIG } from '../config/asteroid.js';
import { SPHERE_CONFIG } from '../config/sphere.js';

const _target = new THREE.Vector3();
const _direction = new THREE.Vector3();

export class Asteroid {

	constructor() {

		this.group = new THREE.Group();
		this.group.name = 'asteroid';
		this.model = null;
		this.loaded = false;
		this.collisionRadius = ASTEROID_CONFIG.collisionRadius;
		this.hasCollided = false;
		this.respawnTimer = 0;
		this._startPosition = new THREE.Vector3();
		this.lensflare = null;
		this.glowLight = null;

	}

	load( scene ) {

		const { url, scale, startPosition, lensflare } = ASTEROID_CONFIG;

		this._startPosition.set(
			startPosition.x,
			startPosition.y,
			startPosition.z
		);
		this.group.position.copy( this._startPosition );

		return new Promise( ( resolve, reject ) => {

			const loader = new GLTFLoader();
			loader.load(
				url,
				( gltf ) => {

					this._setupModel( gltf.scene, scale );
					this._addLensflare( lensflare );
					scene.add( this.group );
					this.loaded = true;
					resolve( this );

				},
				undefined,
				reject
			);

		} );

	}

	_setupModel( scene, scale ) {

		this.model = scene;
		this.model.scale.setScalar( scale );

		this.model.traverse( ( child ) => {

			if ( child.isMesh ) {

				child.castShadow = true;
				child.receiveShadow = true;

			}

		} );

		this.group.add( this.model );

		const box = new THREE.Box3().setFromObject( this.model );
		const size = box.getSize( new THREE.Vector3() );
		const approxRadius = Math.max( size.x, size.y, size.z ) * 0.5;

		if ( approxRadius > 0.01 ) {

			this.collisionRadius = approxRadius;

		}

	}

	_addLensflare( lensflareConfig ) {

		const textureLoader = new THREE.TextureLoader();

		this.glowLight = new THREE.PointLight( 0xffaa66, 1.2, 24 );
		this.glowLight.position.set( 0, 0, 0 );
		this.group.add( this.glowLight );

		this.lensflare = new Lensflare();

		for ( const entry of lensflareConfig.textures ) {

			const texture = textureLoader.load( entry.path );
			this.lensflare.addElement(
				new LensflareElement( texture, entry.size, entry.distance )
			);

		}

		this.glowLight.add( this.lensflare );

	}

	getObject() {

		return this.group;

	}

	_getSphereCenter( target = _target ) {

		const { position } = SPHERE_CONFIG;
		return target.set( position.x, position.y, position.z );

	}

	_getCollisionDistance() {

		return SPHERE_CONFIG.radius + this.collisionRadius;

	}

	_onCollision() {

		this.hasCollided = true;
		this.group.visible = false;
		this.respawnTimer = ASTEROID_CONFIG.respawnDelay;

	}

	_reset() {

		this.hasCollided = false;
		this.group.visible = true;
		this.group.position.copy( this._startPosition );
		this.group.rotation.set( 0, 0, 0 );

	}

	update( delta, onCollision ) {

		if ( ! this.loaded ) return;

		if ( this.hasCollided ) {

			this.respawnTimer -= delta;

			if ( this.respawnTimer <= 0 ) {

				this._reset();

			}

			return;

		}

		const sphereCenter = this._getSphereCenter();
		_direction.subVectors( sphereCenter, this.group.position );
		const distance = _direction.length();

		if ( distance <= this._getCollisionDistance() ) {

			this._onCollision();
			onCollision?.();
			return;

		}

		_direction.normalize().multiplyScalar( ASTEROID_CONFIG.speed * delta );
		this.group.position.add( _direction );

		const tumble = ASTEROID_CONFIG.tumbleSpeed * delta;
		this.group.rotation.x += tumble * 0.7;
		this.group.rotation.y += tumble;
		this.group.rotation.z += tumble * 0.4;

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
