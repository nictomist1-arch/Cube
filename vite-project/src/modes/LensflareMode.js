import * as THREE from 'three';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';
import { LENSFLARE_CONFIG } from '../config/lensflare.js';

/**
 * Сцена как в three.js examples/webgl_lensflares.html
 */
export class LensflareMode {

	constructor( scene ) {

		this.scene = scene;
		this.group = new THREE.Group();
		this.group.name = 'LensflareMode';
		this.group.visible = false;
		this._built = false;
		this._savedScene = null;
		this.pointLights = [];

	}

	build() {

		if ( this._built ) return;

		const cfg = LENSFLARE_CONFIG;
		const s = cfg.world.boxSize;
		const geometry = new THREE.BoxGeometry( s, s, s );
		const material = new THREE.MeshPhongMaterial( {
			color: 0xffffff,
			specular: 0xffffff,
			shininess: 50,
		} );

		for ( let i = 0; i < cfg.world.boxCount; i ++ ) {

			const mesh = new THREE.Mesh( geometry, material );
			mesh.position.x = 8000 * ( 2.0 * Math.random() - 1.0 );
			mesh.position.y = 8000 * ( 2.0 * Math.random() - 1.0 );
			mesh.position.z = 8000 * ( 2.0 * Math.random() - 1.0 );
			mesh.rotation.x = Math.random() * Math.PI;
			mesh.rotation.y = Math.random() * Math.PI;
			mesh.rotation.z = Math.random() * Math.PI;
			mesh.matrixAutoUpdate = false;
			mesh.updateMatrix();
			this.group.add( mesh );

		}

		const dirLight = new THREE.DirectionalLight( 0xffffff, 0.15 );
		dirLight.position.set( 0, - 1, 0 ).normalize();
		dirLight.color.setHSL( 0.1, 0.7, 0.5 );
		this.group.add( dirLight );

		const textureLoader = new THREE.TextureLoader();
		const textureFlare0 = textureLoader.load( cfg.textures.flare0 );
		const textureFlare3 = textureLoader.load( cfg.textures.flare3 );

		for ( const spec of cfg.lights ) {

			this._addLight( spec, textureFlare0, textureFlare3 );

		}

		this.scene.add( this.group );
		this._built = true;

	}

	_addLight( spec, textureFlare0, textureFlare3 ) {

		const light = new THREE.PointLight( 0xffffff, 1.5, 2000, 0 );
		light.color.setHSL( spec.h, spec.s, spec.l );
		light.position.set( spec.x, spec.y, spec.z );
		this.group.add( light );
		this.pointLights.push( light );

		const lensflare = new Lensflare();
		lensflare.addElement( new LensflareElement( textureFlare0, 700, 0, light.color ) );
		lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.6 ) );
		lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.7 ) );
		lensflare.addElement( new LensflareElement( textureFlare3, 120, 0.9 ) );
		lensflare.addElement( new LensflareElement( textureFlare3, 70, 1 ) );
		light.add( lensflare );

	}

	activate() {

		this.build();

		this._savedScene = {
			background: this.scene.background,
			fog: this.scene.fog,
		};

		const { backgroundHsl, fogNear, fogFar } = LENSFLARE_CONFIG.scene;
		const bg = new THREE.Color().setHSL(
			backgroundHsl.h,
			backgroundHsl.s,
			backgroundHsl.l,
			THREE.SRGBColorSpace
		);

		this.scene.background = bg;
		this.scene.fog = new THREE.Fog( bg, fogNear, fogFar );
		this.group.visible = true;

	}

	deactivate() {

		if ( this._savedScene ) {

			this.scene.background = this._savedScene.background;
			this.scene.fog = this._savedScene.fog;
			this._savedScene = null;

		}

		this.group.visible = false;

	}

}
