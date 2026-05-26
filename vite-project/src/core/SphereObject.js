import * as THREE from 'three';
import { SPHERE_CONFIG } from '../config/sphere.js';
import { createStandardMaterial } from '../utils/TextureMaterials.js';

/**
 * @see https://threejs.org/docs/#api/en/geometries/SphereGeometry
 */
export class SphereObject {

	constructor() {

		this.mesh = null;

	}

	create( maps = {} ) {

		const { radius, widthSegments, heightSegments, position, material } = SPHERE_CONFIG;

		const geometry = new THREE.SphereGeometry(
			radius,
			widthSegments,
			heightSegments
		);

		const barkMaterial = createStandardMaterial(
			{
				map: maps.map,
				bumpMap: maps.bumpMap ?? maps.map,
				displacementMap: maps.displacementMap ?? maps.map,
			},
			{
				color: material.color,
				metalness: material.metalness,
				roughness: material.roughness,
				bumpScale: material.bumpScale,
				displacementScale: material.displacementScale,
			}
		);

		this.mesh = new THREE.Mesh( geometry, barkMaterial );
		this.mesh.name = 'barkSphere';
		this.mesh.castShadow = true;
		this.mesh.receiveShadow = true;
		this.mesh.position.set( position.x, position.y, position.z );

		return this.mesh;

	}

	getMesh() {

		return this.mesh;

	}

}
