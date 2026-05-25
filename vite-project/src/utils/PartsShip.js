import * as THREE from 'three';

function clampPartIndex( value ) {

	const n = Number( value );
	if ( Number.isNaN( n ) ) return 0;
	return Math.min( 2, Math.max( 0, Math.floor( n ) ) );

}

export class PartsShip {

	constructor( { hull = 0, cabin = 0, engine = 0 } = {} ) {

		this.hull = clampPartIndex( hull );
		this.cabin = clampPartIndex( cabin );
		this.engine = clampPartIndex( engine );

	}

	addPartsTo( ship, mats ) {

		const anchor = this._hullAnchor();
		this._addHull( ship, mats, anchor );
		this._addCabin( ship, mats, anchor );
		this._addEngines( ship, mats, anchor );

	}

	_hullAnchor() {

		switch ( this.hull ) {

			case 1:
				return { noseZ: 1.525, cabinY: 0.28, cabinZ: 0, engineZ: -1.28, halfWidth: 0.36 };
			case 2:
				return { noseZ: 1.25, cabinY: 0.32, cabinZ: 0.05, engineZ: -1.05, halfWidth: 0.32 };
			default:
				return { noseZ: 1.55, cabinY: 0.42, cabinZ: -0.12, engineZ: -1.22, halfWidth: 0.28 };

		}

	}

	_addHull( ship, mats, anchor ) {

		switch ( this.hull ) {

			case 1: {

				const body = new THREE.Mesh(
					new THREE.BoxGeometry( 0.72, 0.48, 2.3 ),
					mats.hull
				);
				body.name = 'hull';
				body.castShadow = true;
				ship.add( body );

				const nose = new THREE.Mesh(
					new THREE.ConeGeometry( 0.34, 0.75, 20 ),
					mats.hull
				);
				nose.name = 'hull';
				nose.rotation.x = -Math.PI / 2;
				nose.position.z = anchor.noseZ;
				nose.castShadow = true;
				ship.add( nose );
				break;

			}

			case 2: {

				const body = new THREE.Mesh(
					new THREE.CylinderGeometry( 0.58, 0.62, 1.85, 22 ),
					mats.hull
				);
				body.name = 'hull';
				body.rotation.x = Math.PI / 2;
				body.castShadow = true;
				ship.add( body );

				const nose = new THREE.Mesh(
					new THREE.ConeGeometry( 0.5, 0.7, 20 ),
					mats.hull
				);
				nose.name = 'hull';
				nose.rotation.x = -Math.PI / 2;
				nose.position.z = anchor.noseZ;
				nose.castShadow = true;
				ship.add( nose );
				break;

			}

			default: {

				const body = new THREE.Mesh(
					new THREE.CylinderGeometry( 0.42, 0.52, 2.2, 24 ),
					mats.hull
				);
				body.name = 'hull';
				body.rotation.x = Math.PI / 2;
				body.castShadow = true;
				ship.add( body );

				const nose = new THREE.Mesh(
					new THREE.ConeGeometry( 0.44, 0.9, 24 ),
					mats.hull
				);
				nose.name = 'hull';
				nose.rotation.x = -Math.PI / 2;
				nose.position.z = anchor.noseZ;
				nose.castShadow = true;
				ship.add( nose );
				break;

			}

		}

	}

	_addCabin( ship, mats, anchor ) {

		switch ( this.cabin ) {

			case 1: {

				const bubble = new THREE.Mesh(
					new THREE.ConeGeometry( 0.22, 0.38, 16 ),
					mats.accent
				);
				bubble.position.set( 0, anchor.cabinY + 0.12, anchor.cabinZ );
				bubble.castShadow = true;
				ship.add( bubble );
				break;

			}

			case 2: {

				const canopy = new THREE.Mesh(
					new THREE.CylinderGeometry( 0.18, 0.2, 0.32, 16 ),
					mats.accent
				);
				canopy.position.set( 0, anchor.cabinY + 0.18, anchor.cabinZ );
				canopy.castShadow = true;
				ship.add( canopy );
				break;

			}

			default: {

				const bridge = new THREE.Mesh(
					new THREE.BoxGeometry( 0.32, 0.2, 0.38 ),
					mats.accent
				);
				bridge.position.set( 0, anchor.cabinY + 0.1, anchor.cabinZ );
				bridge.castShadow = true;
				ship.add( bridge );
				break;

			}

		}

	}

	_addEngines( ship, mats, anchor ) {

		const z = anchor.engineZ;
		const x = anchor.halfWidth + 0.12;

		switch ( this.engine ) {

			case 1: {

				const geo = new THREE.CylinderGeometry( 0.12, 0.14, 0.45, 14 );
				const mk = () => {

					const m = new THREE.Mesh( geo, mats.dark );
					m.rotation.x = Math.PI / 2;
					m.castShadow = true;
					return m;

				};

				const left = mk();
				left.position.set( -x, 0, z );
				ship.add( left );

				const right = mk();
				right.position.set( x, 0, z );
				ship.add( right );
				break;

			}

			case 2: {

				const geo = new THREE.ConeGeometry( 0.14, 0.42, 12 );
				const mk = () => {

					const m = new THREE.Mesh( geo, mats.dark );
					m.rotation.x = Math.PI / 2;
					m.castShadow = true;
					return m;

				};

				const left = mk();
				left.position.set( -x, 0, z - 0.1 );
				ship.add( left );

				const right = mk();
				right.position.set( x, 0, z - 0.1 );
				ship.add( right );
				break;

			}

			default: {

				const geo = new THREE.BoxGeometry( 0.22, 0.22, 0.38 );
				const mk = () => {

					const m = new THREE.Mesh( geo, mats.dark );
					m.castShadow = true;
					return m;

				};

				const left = mk();
				left.position.set( -x, 0, z );
				ship.add( left );

				const right = mk();
				right.position.set( x, 0, z );
				ship.add( right );
				break;

			}

		}

	}

}
