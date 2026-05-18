import * as THREE from 'three';
import { PartsShip } from './PartsShip.js';


export class ShipGenerator {

	create() {

		return this.createShip( new PartsShip() );

	}

	createShip( partsShip ) {

		const ship = new THREE.Group();

		const mats = {
			hull: new THREE.MeshStandardMaterial( { color: 0xb8bcc4, metalness: 0.55, roughness: 0.38 } ),
			accent: new THREE.MeshStandardMaterial( { color: 0x3d7cff, metalness: 0.45, roughness: 0.42 } ),
			dark: new THREE.MeshStandardMaterial( { color: 0x2a2c32, metalness: 0.65, roughness: 0.48 } ),
		};

		partsShip.addPartsTo( ship, mats );

		const wingGeo = new THREE.BoxGeometry( 0.12, 0.06, 0.85 );
		const wingL = new THREE.Mesh( wingGeo, mats.accent );
		wingL.position.set( -0.72, 0, 0.15 );
		wingL.castShadow = true;
		ship.add( wingL );

		const wingR = wingL.clone();
		wingR.position.x = 0.72;
		ship.add( wingR );

		const tailFin = new THREE.Mesh(
			new THREE.BoxGeometry( 0.06, 0.55, 0.35 ),
			mats.hull
		);
		tailFin.position.set( 0, 0.32, -1.05 );
		tailFin.castShadow = true;
		ship.add( tailFin );

		return ship;

	}

}
