import * as THREE from 'three';
import { SKY_CONFIG } from './sky.js';
import { createStars } from '../utils/Stars.js';

export class SkySettings {

	constructor() {

		this.spheres = [];
		this.stars = null;
		this._root = null;
		this._loadId = 0;

	}

	/**
	 * Звёздное поле ({@link THREE.Points}).
	 *
	 * @param {THREE.Scene} scene
	 */
	addStars( scene ) {

		this.removeStars( scene );

		this.stars = createStars();
		scene.add( this.stars );

	}

	removeStars( scene ) {

		if ( this.stars ) {

			scene.remove( this.stars );
			this.stars.geometry.dispose();
			this.stars.material.dispose();
			this.stars = null;

		}

	}

	/**
	 * Сферы с envMap. Кубическая текстура передаётся из TextureLoader.
	 *
	 * @param {THREE.Scene} scene
	 * @param {THREE.CubeTexture} cubeTexture
	 */
	addAnimatedSpheres( scene, cubeTexture ) {

		this.removeFromScene( scene );

		if ( ! cubeTexture ) return;

		const loadId = this._loadId;

		if ( loadId !== this._loadId ) return;

		const { sphereCount, geometry, material } = SKY_CONFIG;

		this._root = new THREE.Group();
		scene.add( this._root );

		const sphereGeometry = new THREE.SphereGeometry(
			geometry.radius,
			geometry.widthSegments,
			geometry.heightSegments
		);

		const sphereMaterial = new THREE.MeshBasicMaterial( {
			color: material.color,
			envMap: cubeTexture,
			refractionRatio: material.refractionRatio,
		} );

		for ( let i = 0; i < sphereCount; i ++ ) {

			const mesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
			mesh.position.x = Math.random() * 10 - 5;
			mesh.position.y = Math.random() * 10 - 5;
			mesh.position.z = Math.random() * 10 - 5;
			mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;
			this._root.add( mesh );
			this.spheres.push( mesh );

		}

	}

	updateSpheres() {

		const timer = 0.0001 * Date.now();

		for ( let i = 0, il = this.spheres.length; i < il; i ++ ) {

			const sphere = this.spheres[ i ];
			sphere.position.x = 5 * Math.cos( timer + i );
			sphere.position.y = 5 * Math.sin( timer + i * 1.1 );

		}

	}

	removeFromScene( scene ) {

		this._loadId ++;

		if ( this._root ) {

			scene.remove( this._root );
			this._root = null;
			this.spheres.length = 0;

		}

	}

}
