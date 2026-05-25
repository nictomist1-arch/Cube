import * as THREE from 'three';
import { LIGHT_CONFIG } from '../config/light.js';

export class LightManager {

	constructor( scene ) {

		this.scene = scene;
		this.lights = {};
		this.helpers = {};

	}

	createAll() {

		this._createHemisphereLight();
		this._createMainLight();
		return this.lights;

	}

	/**
	 * @see https://threejs.org/docs/#api/en/lights/HemisphereLight
	 * @see https://threejs.org/docs/#api/en/helpers/HemisphereLightHelper
	 */
	_createHemisphereLight() {

		const config = LIGHT_CONFIG.hemisphere;
		const light = new THREE.HemisphereLight(
			config.skyColor,
			config.groundColor,
			config.intensity
		);

		light.position.set(
			config.position.x,
			config.position.y,
			config.position.z
		);

		this.scene.add( light );
		this.lights.hemisphere = light;

		if ( config.helper?.enabled ) {

			const helper = new THREE.HemisphereLightHelper(
				light,
				config.helper.size
			);

			this.scene.add( helper );
			this.helpers.hemisphere = helper;

		}

	}

	_createMainLight() {

		const config = LIGHT_CONFIG.main;
		const light = new THREE.DirectionalLight( config.color, config.intensity );
		light.position.set( config.position.x, config.position.y, config.position.z );

		if ( config.castShadow ) {

			light.castShadow = true;
			light.shadow.mapSize.width = config.shadowMapSize;
			light.shadow.mapSize.height = config.shadowMapSize;
			light.shadow.camera.near = 0.001;
			light.shadow.camera.far = 100;
			light.shadow.camera.left = -100;
			light.shadow.camera.right = 100;
			light.shadow.camera.top = 100;
			light.shadow.camera.bottom = -100;

		}

		this.scene.add( light );
		this.lights.main = light;

	}

	getLight( name ) {

		return this.lights[ name ];

	}

	getHelper( name ) {

		return this.helpers[ name ];

	}

}
