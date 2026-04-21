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
const container = document.getElementById('app')

const sm      = new SceneManager(container)
const loader  = new ModelLoader(sm.scene, SECTIONS)
const cam     = new CameraController(sm.camera)
const ray     = new RaycastManager(sm.camera, sm.renderer)
const screens = new ScreenManager()
const overlay = new ScreenOverlay(sm.cssScene)
new BottomTag(SECTIONS.Cube009)

let _overlayTimer = null

const bottomTag = document.getElementById('bottom-tag')

const zoomToSection = (mesh, sectionData) => {
  cam.zoomTo(mesh, sectionData)
  bottomTag.classList.add('hidden')
  if (_overlayTimer) clearTimeout(_overlayTimer)
  _overlayTimer = setTimeout(() => {
    overlay.setActive(mesh.userData.sectionKey)
    _overlayTimer = null
  }, 100)
}

// ── Load Models ───────────────────────────────────────────────
const modelPromise = loader.load('/models/test_unwrapped.glb')

const videos = new VideoManager()
  .add('/videos/late_night_with_the_devil.mp4', 'Cube116_1', [3.0, -3.4], [-1.0, 2.1])
  .add('/videos/tv_static.mp4',                 'Cube115_1', [3.0, -3.4], [-1.0, 2.1])
  .add('/videos/static4.mp4',                   'Cube076_1', [3.0, -3.4], [-1.0, 2.1])

Promise.all([modelPromise, videos.loadAll()]).then(([gltf, loadedVideos]) => {
  document.getElementById('loader').style.display = 'none'

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
ray.onHoverEnter = (mesh) => {}
ray.onHoverLeave = (mesh) => {}

ray.onClick = (mesh) => {
  const key = mesh.userData.sectionKey
  if (!key) return
  zoomToSection(mesh, SECTIONS[key])
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (_overlayTimer) { clearTimeout(_overlayTimer); _overlayTimer = null }
    cam.zoomOut()
    overlay.clearActive()
    bottomTag.classList.remove('hidden')
  }
})

// ── Animation Loop ────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate)
  cam.update()
  ray.update()
  sm.render()
}

animate()
