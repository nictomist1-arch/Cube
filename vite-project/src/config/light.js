export const LIGHT_CONFIG = {

	// небесный свет (sky / ground) — HemisphereLight + HemisphereLightHelper
	hemisphere: {
		skyColor: 0x6a7cff,
		groundColor: 0x0a0618,
		intensity: 0.45,
		position: { x: 0, y: 50, z: 0 },
		helper: {
			enabled: true,
			size: 2,
		},
	},

    // основной свет
    main: {
        type: 'directional',
        color: 0xCA0533,
        intensity: 1.2,
        position: {x: 1, y: 1, z: 1},
        castShadow: true,
        shadowMapSize: 1024,
    },
    // направленный свет - лучи
    ambient: {
        type: 'directional',
        color: 0xFB0442,
        intensity: 0.8,
        position: {x: 0, y: 1, z: -5},
        castShadow: true,
        shadowMapSize: 1024,
    },
    // источник контрового цвета - свет сзади камеры
    rim: {
        type: 'directional',
        color: 0xFC3164,
        intensity: 0.7,
        position: {x: 0, y: -2, z: 0},
        castShadow: true,
        shadowMapSize: 1024,
    },
    // нижний свет - заполняющий
    fill: {
        type: 'point',
        color: 0xFD5E86,
        intensity: 0.6,
        position: {x: 0, y: -2, z: 0},
        castShadow: true,
        shadowMapSize: 1024,
    },
    // подсветка
    back: {
        type: 'point',
        color: 0xFEB9CA,
        intensity: 0.5,
        position: {x: 0, y: 1, z: -5},
        castShadow: true,
        shadowMapSize: 1024,
    }
}