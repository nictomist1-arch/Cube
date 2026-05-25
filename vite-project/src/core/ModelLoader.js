import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MODELS_CONFIG } from '../config/model.js';

export class ModelLoader {

	constructor( scene ) {

		this.scene = scene;
		this.model = null;
		this.positions = new THREE.Vector3( 0, 0, 0 );

	}

	load( index ) {

		const url = MODELS_CONFIG.url;
		const loader = new GLTFLoader();
		loader.load(
			url[ index ],
			( gltf ) => {

				this.model = gltf.scene;
				this.model.position.set(
					this.positions.x,
					this.positions.y,
					this.positions.z,
				);
				this._updatePosition();
				console.log( this.model );
				this.scene.add( this.model );

			}
		);

	}

	_updatePosition() {

		this.positions.x += 4;

	}

}
