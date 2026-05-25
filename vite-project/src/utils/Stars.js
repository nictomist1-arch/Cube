import * as THREE from 'three';
import { SKY_CONFIG } from '../config/sky.js';

/**
 * Звёздное поле на сфере через {@link THREE.Points} и {@link THREE.PointsMaterial}.
 *
 * @see https://threejs.org/docs/#api/en/objects/Points
 * @see https://threejs.org/docs/#api/en/materials/PointsMaterial
 * @returns {THREE.Points}
 */
export function createStars() {

	const { count, radius, minRadius, color, size, opacity } = SKY_CONFIG.stars;
	const positions = new Float32Array( count * 3 );

	for ( let i = 0; i < count; i ++ ) {

		const r = minRadius + Math.random() * ( radius - minRadius );
		const theta = Math.random() * Math.PI * 2;
		const phi = Math.acos( 2 * Math.random() - 1 );

		positions[ i * 3 ] = r * Math.sin( phi ) * Math.cos( theta );
		positions[ i * 3 + 1 ] = r * Math.sin( phi ) * Math.sin( theta );
		positions[ i * 3 + 2 ] = r * Math.cos( phi );

	}

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

	const material = new THREE.PointsMaterial( {
		color,
		size,
		sizeAttenuation: true,
		transparent: true,
		opacity,
		depthWrite: false,
		fog: false,
	} );

	const stars = new THREE.Points( geometry, material );
	stars.name = 'stars';
	stars.frustumCulled = false;

	return stars;

}
