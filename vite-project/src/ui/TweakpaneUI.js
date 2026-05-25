import { Pane } from 'tweakpane';
import './tweakpane.css';

/**
 * Панель настроек сцены на Tweakpane (закреплена сверху экрана).
 *
 * @see https://tweakpane.github.io/docs/
 */
export class TweakpaneUI {

	constructor( options ) {

		const {
			params,
			getSphere,
			lightManager,
			onEnvMapIntensityChange,
		} = options;

		this.params = params;
		this.getSphere = getSphere;
		this.lightManager = lightManager;
		this.onEnvMapIntensityChange = onEnvMapIntensityChange;

		const container = document.getElementById( 'tweakpane-root' );

		this.pane = new Pane( {
			title: 'Настройки',
			container: container ?? undefined,
			expanded: true,
		} );
		this._buildSphereFolder();
		this._buildLightsFolder();
		this._buildSceneFolder();

	}

	_getSphereMaterial() {

		const sphere = this.getSphere();

		if ( ! sphere?.material ) return null;

		return sphere.material;

	}

	_buildSphereFolder() {

		const folder = this.pane.addFolder( { title: 'Сфера', expanded: true } );

		folder.addBinding( this.params, 'rotationSpeed', {
			label: 'вращение',
			min: 0,
			max: 0.05,
			step: 0.001,
		} );

		folder.addBinding( this.params, 'metalness', {
			min: 0,
			max: 1,
			step: 0.01,
		} ).on( 'change', ( ev ) => {

			const material = this._getSphereMaterial();

			if ( material ) {

				material.metalness = ev.value;
				material.needsUpdate = true;

			}

		} );

		folder.addBinding( this.params, 'roughness', {
			min: 0,
			max: 1,
			step: 0.01,
		} ).on( 'change', ( ev ) => {

			const material = this._getSphereMaterial();

			if ( material ) {

				material.roughness = ev.value;
				material.needsUpdate = true;

			}

		} );

		folder.addBinding( this.params, 'bumpScale', {
			label: 'рельеф',
			min: 0,
			max: 0.3,
			step: 0.01,
		} ).on( 'change', ( ev ) => {

			const material = this._getSphereMaterial();

			if ( material ) {

				material.bumpScale = ev.value;
				material.needsUpdate = true;

			}

		} );

	}

	_buildLightsFolder() {

		const hemi = this.lightManager.getLight( 'hemisphere' );
		const main = this.lightManager.getLight( 'main' );

		if ( ! hemi && ! main ) return;

		const folder = this.pane.addFolder( { title: 'Свет', expanded: false } );

		if ( hemi ) {

			folder.addBinding( this.params, 'hemiIntensity', {
				label: 'небо',
				min: 0,
				max: 2,
				step: 0.01,
			} ).on( 'change', ( ev ) => {

				hemi.intensity = ev.value;

			} );

			folder.addBinding( this.params, 'hemiSkyColor', {
				label: 'небо цвет',
			} ).on( 'change', ( ev ) => {

				hemi.color.set( ev.value );

			} );

			folder.addBinding( this.params, 'hemiGroundColor', {
				label: 'земля цвет',
			} ).on( 'change', ( ev ) => {

				hemi.groundColor.set( ev.value );

			} );

		}

		if ( main ) {

			folder.addBinding( this.params, 'mainIntensity', {
				label: 'основной',
				min: 0,
				max: 3,
				step: 0.01,
			} ).on( 'change', ( ev ) => {

				main.intensity = ev.value;

			} );

			folder.addBinding( this.params, 'mainColor', {
				label: 'основной цвет',
			} ).on( 'change', ( ev ) => {

				main.color.set( ev.value );

			} );

		}

	}

	_buildSceneFolder() {

		const folder = this.pane.addFolder( { title: 'Сцена', expanded: false } );

		folder.addBinding( this.params, 'envMapIntensity', {
			label: 'отражение',
			min: 0,
			max: 2,
			step: 0.01,
		} ).on( 'change', ( ev ) => {

			if ( this.onEnvMapIntensityChange ) {

				this.onEnvMapIntensityChange( ev.value );

			}

		} );

	}

	dispose() {

		this.pane.dispose();

	}

}

/**
 * Начальные значения для панели из конфигов и объектов сцены.
 */
export function createDefaultParams( { sphereMaterial, lightManager, envMapIntensity } ) {

	const hemi = lightManager?.getLight( 'hemisphere' );
	const main = lightManager?.getLight( 'main' );

	return {
		rotationSpeed: 0.004,
		metalness: sphereMaterial?.metalness ?? 0.05,
		roughness: sphereMaterial?.roughness ?? 0.9,
		bumpScale: sphereMaterial?.bumpScale ?? 0.02,
		hemiIntensity: hemi?.intensity ?? 0.45,
		hemiSkyColor: colorToHex( hemi?.color ?? { getHexString: () => '6a7cff' } ),
		hemiGroundColor: colorToHex( hemi?.groundColor ?? { getHexString: () => '0a0618' } ),
		mainIntensity: main?.intensity ?? 1.2,
		mainColor: colorToHex( main?.color ?? { getHexString: () => 'ca0533' } ),
		envMapIntensity: envMapIntensity ?? 0.35,
	};

}

function colorToHex( color ) {

	return `#${ color.getHexString() }`;

}
