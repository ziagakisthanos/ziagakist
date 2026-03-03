import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DECORATIVE_NODES } from '../data/content.js'

export class ModelLoader {
    constructor(scene) {
        this.scene = scene
        this.loader = new GLTFLoader()

        this.clickableNodes = []
    }

    load(path) {
        //wait for the model before starting
        return new Promise((resolve, reject) => {
            
        })
    }
}