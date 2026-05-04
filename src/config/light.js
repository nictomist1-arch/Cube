const PRESETS = {
	day: {
		ambient: { enabled: true, color: 0xffffff, intensity: 0.22 },
		hemisphere: {
			enabled: true,
			skyColor: 0xffffff,
			groundColor: 0x444444,
			intensity: 0.55
		},
		main: {
			enabled: true,
			color: 0xffffff,
			intensity: 1.1,
			position: { x: 10, y: 14, z: 8 },
			castShadow: true,
			shadowMapSize: { width: 1024, height: 1024 },
			shadowCamera: {
				near: 0.5,
				far: 80,
				left: -30,
				right: 30,
				top: 30,
				bottom: -30
			}
		},
		fill: {
			enabled: true,
			color: 0xa9c8ff,
			intensity: 0.3,
			position: { x: -8, y: 6, z: -10 }
		},
		rim: {
			enabled: true,
			color: 0xfff0d0,
			intensity: 0.2,
			position: { x: 0, y: 8, z: -14 }
		}
	},
	night: {
		ambient: { enabled: true, color: 0x8fa1ff, intensity: 0.08 },
		hemisphere: {
			enabled: true,
			skyColor: 0x2d3f7e,
			groundColor: 0x12141e,
			intensity: 0.25
		},
		main: {
			enabled: true,
			color: 0xbfd6ff,
			intensity: 0.7,
			position: { x: 8, y: 10, z: 5 },
			castShadow: true,
			shadowMapSize: { width: 1024, height: 1024 },
			shadowCamera: {
				near: 0.5,
				far: 80,
				left: -24,
				right: 24,
				top: 24,
				bottom: -24
			}
		},
		fill: {
			enabled: true,
			color: 0x6d85ff,
			intensity: 0.15,
			position: { x: -10, y: 4, z: -12 }
		},
		rim: {
			enabled: true,
			color: 0x89a1ff,
			intensity: 0.12,
			position: { x: 0, y: 7, z: -14 }
		}
	},
	studio: {
		ambient: { enabled: true, color: 0xffffff, intensity: 0.28 },
		hemisphere: {
			enabled: false,
			skyColor: 0xffffff,
			groundColor: 0x444444,
			intensity: 0.35
		},
		main: {
			enabled: true,
			color: 0xffffff,
			intensity: 1.3,
			position: { x: 12, y: 16, z: 10 },
			castShadow: true,
			shadowMapSize: { width: 2048, height: 2048 },
			shadowCamera: {
				near: 0.5,
				far: 120,
				left: -32,
				right: 32,
				top: 32,
				bottom: -32
			}
		},
		fill: {
			enabled: true,
			color: 0xffffff,
			intensity: 0.45,
			position: { x: -12, y: 8, z: 2 }
		},
		rim: {
			enabled: true,
			color: 0xffffff,
			intensity: 0.35,
			position: { x: 0, y: 10, z: -16 }
		}
	}
};

export const LIGHTS_CONFIG = {
	activePreset: 'day',
	helpers: { enabled: false },
	presets: PRESETS
};