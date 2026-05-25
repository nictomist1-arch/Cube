export const TEXTURES_CONFIG = {

	background: {
		url: 'https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg',
		mapping: 'EquirectangularReflectionMapping',
	},

	cube: {
		path: 'https://threejs.org/examples/textures/cube/Park3Med/',
		files: [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ],
		mapping: 'CubeRefractionMapping',
	},

	sphere: {
		bark: {
			// @see https://threejs.org/docs/#api/en/loaders/TextureLoader
			url: 'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg',
		},
		repeat: { x: 1, y: 1 },
	},

	envMapIntensity: 0.35,

};
