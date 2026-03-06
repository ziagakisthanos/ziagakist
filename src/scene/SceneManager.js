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

        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.outputEncoding = THREE.sRGBEncoding
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        this.renderer.toneMappingExposure = 1.0

        // ← Add these two lines
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

        this.container.appendChild(this.renderer.domElement)
    }

    createScene() {
        this.scene = new THREE.Scene()

        this.scene.background = new THREE.Color(0x000000)


        // Fog fades objects into the background color as they get further away
        // THREE.Fog(color, near, far) — objects start fading at 'near' and are
        // fully invisible at 'far'
        this.scene.fog = new THREE.Fog(0x0a0a0a, 10, 30)
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
        60,                                         // field of view in degrees
        window.innerWidth / window.innerHeight,    // aspect ratio
        0.01,                                      // near clipping plane
        100                                        // far clipping plane
        )

        this.camera.position.set(0.63,1.5,10)
    }

    createLights() {
        const ambient = new THREE.AmbientLight(0x000000, 0)
        this.scene.add(ambient)

        const spotlight = new THREE.SpotLight(0XFFF1E0, 700)
        spotlight.position.set(4, 6, -1.1)
        spotlight.target.position.set(0,-0.1,0)
        this.scene.add(spotlight.target)
        this.scene.add(spotlight)

        spotlight.angle = Math.PI / 4.5
        spotlight.penumbra = 0.9
        spotlight.distance = 10
        spotlight.decay = 2

          // ── Shadows ────────────────────────────────────────────────
        spotlight.castShadow = true

        spotlight.shadow.bias = -0.001
        spotlight.shadow.normalBias =  0.02

        // // Temporary — remove once you're happy with the position
        const helper = new THREE.SpotLightHelper(spotlight)
        this.scene.add(helper)

        // // Store reference so render() can update it every frame
        this.spotlightHelper = helper

        const pointLight2 = new THREE.PointLight(0x2d0a4e, 70, 200, 2)
        pointLight2.position.set(0, 2, 1)
        this.scene.add(pointLight2)

        // Temporary helper — shows a wireframe sphere at the light position
        const pointHelper2 = new THREE.PointLightHelper(pointLight2, 0.3)

        // 0.3 is the size of the helper sphere — purely visual
        this.scene.add(pointHelper2)

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
        if (this.spotlightHelper) this.spotlightHelper.update()

        this.renderer.render(this.scene, this.camera)
    }
}