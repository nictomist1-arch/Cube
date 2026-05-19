import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { MODELS_CONFIG } from "../config/model.js";

export class ModelLoader {
        constructor(scene) {
            this.
        }


    load(index) {
        const url = MODELS_CONFIG.url;
        const loader = new GLTFLoader();
        loader.load(
            url[index] ,
            ( gltf ) => {
                this.model = gltf.scene;
                console.log(this.model);
                this.scene.add( this.model );
            });
        }

        _updatePosition(){
            
        }

}