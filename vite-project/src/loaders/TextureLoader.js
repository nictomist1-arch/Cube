import { ImageLoader } from 'three';
import { Loader } from 'three';
import { Texture } from 'three';

/**
 * Загрузчик текстур. Изображения загружаются через {@link ImageLoader}.
 *
 * ```js
 * const loader = new TextureLoader();
 * const texture = await loader.loadAsync( 'textures/land_ocean_ice_cloud_2048.jpg' );
 *
 * const material = new THREE.MeshBasicMaterial( { map: texture } );
 * ```
 *
 * TextureLoader не поддерживает события прогресса (onProgress) с r84.
 *
 * @augments Loader
 */
class TextureLoader extends Loader {

	/**
	 * @param {import('three').LoadingManager} [manager]
	 */
	constructor( manager ) {

		super( manager );

	}

	/**
	 * Загружает текстуру по URL. Возвращает объект Texture сразу;
	 * после загрузки изображения выставляется `texture.needsUpdate = true`.
	 *
	 * @param {string} url — путь или data URI
	 * @param {function(Texture)} [onLoad] — вызывается после загрузки
	 * @param {function} [onProgress] — не поддерживается
	 * @param {function} [onError] — при ошибке
	 * @returns {Texture}
	 */
	load( url, onLoad, onProgress, onError ) {

		const texture = new Texture();

		const loader = new ImageLoader( this.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.setPath( this.path );

		loader.load( url, function ( image ) {

			texture.image = image;
			texture.needsUpdate = true;

			if ( onLoad !== undefined ) {

				onLoad( texture );

			}

		}, onProgress, onError );

		return texture;

	}

}

export { TextureLoader };
