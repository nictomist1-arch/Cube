import * as THREE from 'three';

/**
 * Создаёт MeshStandardMaterial с картами diffuse / normal.
 */
export function createStandardMaterial( maps = {}, params = {} ) {

	const hasBump = Boolean( maps.bumpMap );
	const hasDisplacement = Boolean( maps.displacementMap );

	const material = new THREE.MeshStandardMaterial( {
		...params,
		map: maps.map ?? null,
		normalMap: maps.normalMap ?? null,
		bumpMap: maps.bumpMap ?? null,
		bumpScale: params.bumpScale ?? ( hasBump ? 0.02 : 0 ),
		displacementMap: maps.displacementMap ?? null,
		displacementScale: params.displacementScale ?? ( hasDisplacement ? 0.05 : 0 ),
	} );

	if ( maps.map ) {

		material.map.colorSpace = THREE.SRGBColorSpace;

	}

	return material;

}

/**
 * Назначает envMap всем MeshStandardMaterial в объекте.
 */
export function applyEnvMap( object, envMap, intensity = 1 ) {

	object.traverse( ( child ) => {

		if ( ! child.isMesh ) return;

		const materials = Array.isArray( child.material )
			? child.material
			: [ child.material ];

		for ( const material of materials ) {

			if ( ! material.isMeshStandardMaterial ) continue;

			material.envMap = envMap;
			material.envMapIntensity = intensity;
			material.needsUpdate = true;

		}

	} );

}
