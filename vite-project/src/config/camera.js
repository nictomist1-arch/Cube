export const CAMERA_CONFIG = {
	fov: 45,
	near: 0.1,
	far: 1000,
	position: { x: 5, y: 8, z: 20 },
	target: { x: 0, y: 0, z: 0 },

	orbit: {
		enableDamping: true,
		dampingFactor: 0.1,
		autoRotate: false,
		enableZoom: true,
		zoomSpeed: 1,
		enablePan: true,
		rotateSpeed: 0.5,
	},

	fly: {
		thrust: 34,
		maxSpeed: 26,
		drag: 3.2,
		strafeFactor: 0.65,
		verticalFactor: 0.45,
		lookSensitivity: 0.0018,
		bankAmount: 0.48,
		bankSpeed: 4.5,
		chase: {
			distance: 11,
			height: 3.2,
			lookAhead: 5,
			positionSmoothing: 0.1,
			lookSmoothing: 0.14,
		},
	},
};
