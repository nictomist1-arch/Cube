export const LENSFLARE_CONFIG = {

	camera: {
		fov: 40,
		near: 1,
		far: 15000,
		position: { x: 0, y: 0, z: 250 },
	},

	controls: {
		movementSpeed: 2500,
		rollSpeed: Math.PI / 6,
		autoForward: false,
		dragToLook: false,
	},

	scene: {
		backgroundHsl: { h: 0.51, s: 0.4, l: 0.01 },
		fogNear: 3500,
		fogFar: 15000,
	},

	world: {
		boxSize: 250,
		boxCount: 3000,
	},

	textures: {
		flare0: '/textures/lensflare/lensflare0.png',
		flare3: '/textures/lensflare/lensflare3.png',
	},

	lights: [
		{ h: 0.55, s: 0.9, l: 0.5, x: 5000, y: 0, z: -1000 },
		{ h: 0.08, s: 0.8, l: 0.5, x: 0, y: 0, z: -1000 },
		{ h: 0.995, s: 0.5, l: 0.9, x: 5000, y: 5000, z: -1000 },
	],

};
