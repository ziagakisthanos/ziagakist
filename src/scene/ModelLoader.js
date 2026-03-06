import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export class ModelLoader {
    constructor(scene, sections) {
        this.scene = scene
        this.sections = sections
        this.loader = new GLTFLoader()
        this.clickableNodes = []
    }

    load(path) {
        //wait for the model before starting
        return new Promise((resolve, reject) => {
            
            this.loader.load(
                path,

                (gltf) => {
                    this.scene.add(gltf.scene)

                    // Walk through every object in the scene
                    // traverse() visits every node recursively
                    gltf.scene.traverse((node) => {
                        
                        // care only about nodes that have geometry (Mesh objects)
                        if (!node.isMesh) return

                        //enable shadows on every mesh
                        node.castShadow = true
                        node.receiveShadow = true

                        // verify target nodes are found
                        console.log('Found node:', node.name)
                    })

                    //after traversal, find target nodes by name
                    this.registerClickables(gltf.scene)

                    const box = new THREE.Box3().setFromObject(gltf.scene)
                    const center = box.getCenter(new THREE.Vector3())
                    const size = box.getSize(new THREE.Vector3())

                    console.log('Model center:', center)
                    console.log('Model size:', size)
                    console.log('Model min:', box.min)
                    console.log('Model max:', box.max)

                    resolve(gltf)
                },

                // called as file downloads
                (progress) => {
                    const percent = Math.round((progress.loaded / progress.total) * 100)
                    console.log(`Loading: ${percent}%`)
                },

                (error) => {
                    console.error('Model failed to load:', error)
                    reject(error)
                }
            )
        })
    }

    registerClickables(root) {
        const targetNames = Object.keys(this.sections)

        targetNames.forEach(name => {

            //search the scene graph for node by name
            const node = root.getObjectByName(name)

            if (node) {
                //let the raycaster know that this node is reactive
                node.userData.isClickable = true
                node.userData.sectionKey = name
                this.clickableNodes.push(node)
                console.log('✓ Registered clickable:', name)
            } else {
                console.warn('✗ Node not found:', name)
            }
        })

        console.log(`Registered ${this.clickableNodes.length} clickable nodes`)
    }
}