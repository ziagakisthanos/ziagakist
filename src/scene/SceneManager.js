import * as THREE from 'three'

export class SceneManager {
    constructor(container) {

        this.container = container

        this.createRenderer()
        this.createScene()
        this.createCamera()
        this.createLights()
        this.handleResize()
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false
        })

        // pixelRatio capped at 2 to avoid performance issues
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.setSize(window.innerWidth, window.innerHeight)
       
        // color output encoding
        this.renderer.outputEncoding = THREE.sRGBEncoding

        // tone mapping makes the scene more cinematic
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        this.renderer.toneMappingExposure = 1.0

        //append canvas to container div
        this.container.appendChild(this.renderer.domElement)
    }

    createScene() {
        this.scene = new THREE.Scene()

        this.scene.background = new THREE.Color(0x0a0a0a)


        // Fog fades objects into the background color as they get further away
        // THREE.Fog(color, near, far) — objects start fading at 'near' and are
        // fully invisible at 'far'
        this.scene.fog = new THREE.Fog(0x0a0a0a, 10, 30)
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
        90,                                         // field of view in degrees
        window.innerWidth / window.innerHeight,    // aspect ratio
        0.01,                                      // near clipping plane
        100                                        // far clipping plane
        )

        this.camera.positiom.set(0.904507, -6.59579, 1.12211)
        this.camera.rotation.set(97.5835, -1.92794, 5.39089)
    }

    createLights() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.3)
        this.scene.add(ambient)

        //artificial sunlight
        const key = new THREE.DirectionalLight(0xffffff, 0.8)
        key.position.set(5,8,5)
        this.scene.add(key)

        //second softer light to prevent pure black sides
        const fill = new THREE.DirectionalLight(0x4466aa, 0.3)
    }

    handleResize() {
        //update renderer and camera when window resizes
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(window.innerWidth, window.innerHeight)
        })
    }

    render() {
        this.renderer.render(this.scene, this.camera)
    }
}