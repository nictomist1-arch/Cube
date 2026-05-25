import * as THREE from 'three';
import { TEXTURES_CONFIG } from '../config/texture.js';
import { applyEnvMap } from '../utils/TextureMaterials.js';

const MAPPING = {
	EquirectangularReflectionMapping: THREE.EquirectangularReflectionMapping,
	CubeRefractionMapping: THREE.CubeRefractionMapping,
	CubeReflectionMapping: THREE.CubeReflectionMapping,
	UVMapping: THREE.UVMapping,
};

/**
 * Загрузка текстур сцены через {@link THREE.TextureLoader}
 * и {@link THREE.CubeTextureLoader}.
 *
 * @see https://threejs.org/docs/#api/en/loaders/TextureLoader
 * @see https://threejs.org/docs/#api/en/loaders/CubeTextureLoader
 */
export class TextureLoader {

	constructor( scene ) {

		this.scene = scene;
		this.textures = {};
		this._textureLoader = new THREE.TextureLoader();
		this._cubeLoader = new THREE.CubeTextureLoader();

	}

	_resolveMapping( name ) {

		return MAPPING[ name ] ?? THREE.UVMapping;

	}

	/**
	 * Загружает 2D-текстуру по URL.
	 */
	load( url, options = {} ) {

		const { mapping, onLoad, onError } = options;

		return this._textureLoader.load(
			url,
			( texture ) => {

				if ( mapping !== undefined ) {

					texture.mapping = mapping;

				}

				texture.colorSpace = THREE.SRGBColorSpace;

				if ( onLoad ) {

					onLoad( texture );

				}

			},
			undefined,
			onError
		);

	}

	/**
	 * Promise-обёртка над {@link THREE.Loader#loadAsync}.
	 */
	loadAsync( url, options = {} ) {

		return new Promise( ( resolve, reject ) => {

			this.load( url, {
				...options,
				onLoad: resolve,
				onError: reject,
			} );

		} );

	}

	/**
	 * Загрузка по ключу из TEXTURES_CONFIG (background, ship.hull, …).
	 */
	loadFromConfig( key, options = {} ) {

		const entry = key.split( '.' ).reduce(
			( obj, part ) => obj?.[ part ],
			TEXTURES_CONFIG
		);

		if ( ! entry?.url ) {

			console.warn( `TextureLoader: нет url для "${ key }"` );
			return null;

		}

		const mapping = entry.mapping
			? this._resolveMapping( entry.mapping )
			: options.mapping;

		const texture = this.load( entry.url, {
			mapping,
			onLoad: ( tex ) => {

				this.textures[ key ] = tex;

				if ( options.onLoad ) {

					options.onLoad( tex );

				}

			},
		} );

		return texture;

	}

	loadBackground() {

		const { url, mapping } = TEXTURES_CONFIG.background;

		this.textures.background = this.load( url, {
			mapping: this._resolveMapping( mapping ),
			onLoad: ( texture ) => {

				this.scene.background = texture;

			},
		} );

		return this.textures.background;

	}

	loadCube( onLoad ) {

		const { path, files, mapping } = TEXTURES_CONFIG.cube;

		this.textures.cube = this._cubeLoader
			.setPath( path )
			.load(
				files,
				( cubeTexture ) => {

					cubeTexture.mapping = this._resolveMapping( mapping );

					if ( onLoad ) {

						onLoad( cubeTexture );

					}

				}
			);

		return this.textures.cube;

	}

	_configureSurfaceTexture( texture, repeat ) {

		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( repeat.x, repeat.y );

	}

	/**
	 * Текстура коры для сферы (map + bump + displacement из одного изображения).
	 */
	loadSphereBark( onLoad ) {

		const { url } = TEXTURES_CONFIG.sphere.bark;
		const repeat = TEXTURES_CONFIG.sphere.repeat ?? { x: 2, y: 2 };

		this.loadAsync( url ).then( ( map ) => {

			this._configureSurfaceTexture( map, repeat );

			const bumpMap = map.clone();
			this._configureSurfaceTexture( bumpMap, repeat );

			const displacementMap = map.clone();
			this._configureSurfaceTexture( displacementMap, repeat );

			this.textures[ 'sphere.bark' ] = map;

			if ( onLoad ) {

				onLoad( { map, bumpMap, displacementMap } );

			}

		} );

	}

	/**
	 * envMap на объект (корабль, модель).
	 */
	applyEnvMapTo( object ) {

		const cube = this.textures.cube;

		if ( ! cube ) return;

		applyEnvMap( object, cube, TEXTURES_CONFIG.envMapIntensity );

	}

	loadAll( callbacks = {} ) {

		this.loadBackground();

		this.loadCube( ( cubeTexture ) => {

			if ( callbacks.onCubeLoad ) {

				callbacks.onCubeLoad( cubeTexture );

			}

		} );

		if ( callbacks.onSphereBarkLoad ) {

			this.loadSphereBark( callbacks.onSphereBarkLoad );

		}

	}

	getTexture( name ) {

		return this.textures[ name ];

	}

}
