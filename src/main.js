import * as THREE from 'three'
import { SceneManager }      from './scene/SceneManager.js'
import { ModelLoader }        from './scene/ModelLoader.js'
import { CameraController }   from './scene/CameraController.js'
import { RaycastManager }     from './interaction/RaycastManager.js'
import { SECTIONS }           from './data/content.js'
import { VideoManager }       from './scene/VideoManager.js'
import { ScreenManager }      from './scene/ScreenManager.js'
import { ScreenOverlay }      from './ui/ScreenOverlay.js'
import { BottomTag }          from './ui/BottomTag.js'

// ── Bootstrap ────────────────────────────────────────────────
const startEl  = document.getElementById('start')
const startBtn = document.getElementById('start-btn')
const container = document.getElementById('app')

const sm      = new SceneManager(container)
const loader  = new ModelLoader(sm.scene, SECTIONS)
const cam     = new CameraController(sm.camera)
const ray     = new RaycastManager(sm.camera, sm.renderer)
const screens = new ScreenManager()
const overlay = new ScreenOverlay(sm.cssScene)
new BottomTag(SECTIONS.Cube009)

let _overlayTimer = null
let _sceneReady   = false

const bottomTag = document.getElementById('bottom-tag')
const backBtn   = document.getElementById('back-btn')

const zoomOut = () => {
  if (_overlayTimer) { clearTimeout(_overlayTimer); _overlayTimer = null }
  cam.zoomOut()
  overlay.clearActive()
  backBtn.classList.add('hidden')
  bottomTag.classList.remove('hidden')
}

const zoomToSection = (mesh, sectionData) => {
  cam.zoomTo(mesh, sectionData)
  bottomTag.classList.add('hidden')
  if (_overlayTimer) clearTimeout(_overlayTimer)
  _overlayTimer = setTimeout(() => {
    overlay.setActive(mesh.userData.sectionKey)
    backBtn.classList.remove('hidden')
    _overlayTimer = null
  }, 200)
}

cam.beginIntro()

// ── Load Models ───────────────────────────────────────────────
const modelPromise = loader.load('/models/test_unwrapped.glb')

const videos = new VideoManager()
  .add('/videos/late_night_with_the_devil.mp4', 'Cube116_1', [3.0, -3.4], [-1.0, 2.1])
  .add('/videos/tv_static.mp4',                 'Cube115_1', [3.0, -3.4], [-1.0, 2.1])
  .add('/videos/static4.mp4',                   'Cube076_1', [3.0, -3.4], [-1.0, 2.1])

// ── Loader animation state ────────────────────────────────────
const loaderEl   = document.getElementById('loader')
const loaderText = loaderEl.querySelector('.loader-text')
const loaderDots = [...loaderEl.querySelectorAll('.loader-dots span')]
let   _loaderActive = true

const minLoadTime = new Promise(resolve => setTimeout(resolve, 1000))

Promise.all([modelPromise, videos.loadAll(), minLoadTime]).then(([gltf, loadedVideos]) => {
  _loaderActive = false
  loaderEl.classList.add('fade-out')
  loaderEl.addEventListener('transitionend', () => { loaderEl.style.display = 'none' }, { once: true })
  startEl.style.display = 'flex'

  screens.applyAll(SECTIONS, gltf)
  videos.applyAll(gltf, loadedVideos)

  const sectionNames = Object.keys(SECTIONS)
  const clickableNodes = []

  gltf.scene.traverse((node) => {
    if (sectionNames.includes(node.name)) {
      node.userData.sectionKey = node.name

      // Find the _1 screen surface mesh to use as the overlay anchor
      const screenName = `${node.name}_1`
      gltf.scene.traverse((child) => {
        if (child.isMesh && child.name === screenName) {
          node.userData.screenMesh = child
        }
      })

      clickableNodes.push(node)
    }
  })

  ray.setClickables(clickableNodes)
  overlay.openAll(clickableNodes, SECTIONS)
}).catch(console.error)

// ── Wire Up Interactions ──────────────────────────────────────
startBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  startEl.classList.add('fade-out')
  cam.playIntro(() => {
    _sceneReady = true
    bottomTag.classList.remove('hidden')
  })
})

ray.onHoverEnter = (mesh) => {}
ray.onHoverLeave = (mesh) => {}

ray.onClick = (mesh) => {
  if (!_sceneReady) return
  const key = mesh.userData.sectionKey
  if (!key) return
  zoomToSection(mesh, SECTIONS[key])
}

backBtn.addEventListener('click', (e) => { e.stopPropagation(); zoomOut() })

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') zoomOut()
})

// ── Animation Loop ────────────────────────────────────────────
function animate(t = 0) {
  requestAnimationFrame(animate)

  if (_loaderActive) {
    const s = t / 500
    const pulse = 0.45 + 0.4 * (0.5 + 0.5 * Math.sin(s * 2.0))
    loaderText.style.opacity = pulse
    loaderText.style.textShadow = `0 0 ${8 + 12 * pulse}px rgba(80,255,80,${0.15 + 0.35 * pulse})`
    loaderDots.forEach((dot, i) => {
      const wave = 0.8 + 0.5 * Math.sin(s * 4.0 - i * 0.7)
      dot.style.transform = `scale(${0.6 + 0.6 * wave})`
      dot.style.opacity = 0.3 + 0.7 * wave
    })
  }

  cam.update()
  ray.update()
  sm.render()
}

animate()
