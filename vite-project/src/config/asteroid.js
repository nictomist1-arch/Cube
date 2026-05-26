export const ASTEROID_CONFIG = {

	url: '/models/asteroid2.glb',
	scale: 0.45,

	startPosition: { x: -14, y: 5, z: -12 },

	speed: 5.5,
	tumbleSpeed: 1.8,

	/** Радиус сферы столкновения (если не удаётся взять из bounding box модели) */
	collisionRadius: 0.55,

	respawnDelay: 2.5,

	lensflare: {
		textures: [
			{ path: '/textures/lensflare/lensflare0.png', size: 280, distance: 0 },
			{ path: '/textures/lensflare/lensflare3.png', size: 90, distance: 0.55 },
		],
	},

};
