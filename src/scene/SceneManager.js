import * as THREE from 'three'
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

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

        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.outputEncoding = THREE.sRGBEncoding
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        this.renderer.toneMappingExposure = 1.0

        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

        this.container.appendChild(this.renderer.domElement)

        this.cssRenderer = new CSS3DRenderer()
        this.cssRenderer.setSize(window.innerWidth, window.innerHeight)
        this.cssRenderer.domElement.style.position = 'absolute'
        this.cssRenderer.domElement.style.top = '0'
        this.cssRenderer.domElement.style.left = '0'
        this.cssRenderer.domElement.style.pointerEvents = 'none'
        this.container.appendChild(this.cssRenderer.domElement)
    }

    createScene() {
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0x000000)
        this.scene.fog = new THREE.Fog(0x0a0a0a, 10, 30)

        this.cssScene = new THREE.Scene()
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
        45,                                         // field of view in degrees
        window.innerWidth / window.innerHeight,    // aspect ratio
        0.01,                                      // near clipping plane
        100                                        // far clipping plane
        )

        this.camera.position.set(0, 2.5, 10)
    }

    createLights() {
        const ambient = new THREE.AmbientLight(0x000000, 0)
        this.scene.add(ambient)

        const spotlight = new THREE.SpotLight(0XFFF1E0, 1000)
        spotlight.position.set(1, 18, 0)
        spotlight.target.position.set(0,-0.1,0)
        this.scene.add(spotlight.target)
        this.scene.add(spotlight)

        spotlight.angle = Math.PI / 7
        spotlight.penumbra = 0.9
        spotlight.distance = 102
        spotlight.decay = 2

          // ── Shadows ────────────────────────────────────────────────
        spotlight.castShadow = true

        spotlight.shadow.bias = -0.001
        spotlight.shadow.normalBias =  0.02


        const pointLight2 = new THREE.PointLight(0x2d0a4e, 50, 100, 2)
        pointLight2.position.set(0, 2, 1)
        this.scene.add(pointLight2)

        

    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(window.innerWidth, window.innerHeight)
            this.cssRenderer.setSize(window.innerWidth, window.innerHeight)
        })
    }

    render() {
        this.renderer.render(this.scene, this.camera)
        this.cssRenderer.render(this.cssScene, this.camera)
    }
}