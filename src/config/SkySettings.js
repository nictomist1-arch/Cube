import * as THREE from 'three';


const REFRACTION_CUBE_PATH = 'https://threejs.org/examples/textures/cube/Park3Med/';

const SPHERE_COUNT = 100;


export class SkySettings {

	constructor() {

		this.spheres = [];
		this._root = null;
		this._cubeLoadId = 0;

	}

	addAnimatedSpheres( scene ) {

		this.removeFromScene( scene );

		const loadId = this._cubeLoadId;

		new THREE.CubeTextureLoader()
			.setPath( REFRACTION_CUBE_PATH )
			.load(
				[ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ],
				( cubeTexture ) => {

					if ( loadId !== this._cubeLoadId ) return;

					cubeTexture.mapping = THREE.CubeRefractionMapping;

					this._root = new THREE.Group();
					scene.add( this._root );

					const geometry = new THREE.SphereGeometry( 0.1, 32, 16 );
					const material = new THREE.MeshBasicMaterial( {
						color: 0xffffff,
						envMap: cubeTexture,
						refractionRatio: 0.95,
					} );

					for ( let i = 0; i < SPHERE_COUNT; i ++ ) {

						const mesh = new THREE.Mesh( geometry, material );
						mesh.position.x = Math.random() * 10 - 5;
						mesh.position.y = Math.random() * 10 - 5;
						mesh.position.z = Math.random() * 10 - 5;
						mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;
						this._root.add( mesh );
						this.spheres.push( mesh );

					}

				}
			);

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

		this._cubeLoadId++;

		if ( this._root ) {

			scene.remove( this._root );
			this._root = null;
			this.spheres.length = 0;

		}

	}

}
