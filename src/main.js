import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {SceneManager} from './core/SceneManager.js';
import {CameraManager} from './core/CameraManager.js';
import {LightManager} from './core/LightManager.js';
import {ShipGenerator} from './utils/ShipGenerator.js';
import {PartsShip} from './utils/PartsShip.js';
import {SkySettings} from './config/SkySettings.js';

class Main{
    constructor(){
        this.sceneManager = null;
        this.cameraManager = null;
        this.renderer = null;
        this.camera = null;
        this.lightManager = null;
        this.controls = null;
        this.time = 0;
        this.ship = null;
        this.skySettings = null;
        this.init();
    }
    init(){
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(this.renderer.domElement);

        this.skySettings = new SkySettings();

        this.sceneManager = new SceneManager(this.renderer.domElement);
        const scene = this.sceneManager.create();
        this.skySettings.addAnimatedSpheres( scene );
        new THREE.TextureLoader().load(
            'https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg',
            ( texture ) => {

                texture.mapping = THREE.EquirectangularReflectionMapping;
                scene.background = texture;

            }
        );
        this.cameraManager = new CameraManager(this.renderer.domElement);
        this.camera = this.cameraManager.create(window.innerWidth / window.innerHeight);
        scene.add(this.camera);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.lightManager = new LightManager(scene);
        this.lightManager.createAll();
        this.modelLoader = new this.ModelLoader(scene);
        this.modelLoader.load(1);

        this.ship = new ShipGenerator().createShip(
            new PartsShip( { hull: 2, cabin: 2, engine: 2 } )
        );
        this.ship.position.set( 0, 0.5, 0 );
        scene.add( this.ship );

        const grid = new THREE.GridHelper(10, 20, 0x00ff00, 0x00aa00);
        grid.position.y = -1;
        scene.add(grid);

        window.addEventListener( 'resize', () => {

            const cam = this.cameraManager.getCamera();
            cam.aspect = window.innerWidth / window.innerHeight;
            cam.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );

        } );
    }
    animate(){
        requestAnimationFrame(() => this.animate());
        this.time += 0.016;
        if ( this.ship ) {

            this.ship.rotation.y += 0.008;

        }
        if (this.controls) {
            this.controls.update();
        }

        this.skySettings.updateSpheres();

        this.renderer.render(
            this.sceneManager.getScene(),
            this.cameraManager.getCamera()
        );
    }
}

const game = new Main();
game.animate();