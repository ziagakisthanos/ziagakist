import * as THREE from 'three'
import { SceneManager } from './scene/SceneManager.js'
import { ModelLoader }   from './scene/ModelLoader.js'
import { CameraController } from './scene/CameraController.js'
import { RaycastManager }   from './interaction/RaycastManager.js'
import { Panel }            from './ui/Panel.js'
import { SECTIONS }         from './data/content.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { VideoManager } from './scene/VideoManager.js'

// ── Bootstrap ────────────────────────────────────────────────
const container = document.getElementById('app')

// core systems
const sm     = new SceneManager(container)
const loader = new ModelLoader(sm.scene, SECTIONS)
const cam    = new CameraController(sm.camera)
const ray    = new RaycastManager(sm.camera, sm.renderer)
const panel  = new Panel()
const controls = new OrbitControls(sm.camera, sm.renderer.domElement)
controls.enableDamping = true 

// ── Load Models ───────────────────────────────────────────────

const modelPromise = loader.load('/models/test_unwrapped.glb')

const videos = new VideoManager()
.add('/videos/late_night_with_the_devil.mp4', 'Cube116_1', [3.0, -3.4], [-1.0, 2.1])
.add('/videos/tv_static.mp4',                 'Cube115_1', [3.0, -3.4], [-1.0, 2.1])
.add('/videos/static4.mp4',                'Cube076_1', [3.0, -3.4], [-1.0, 2.1])



Promise.all([modelPromise, videos.loadAll()]).then(([gltf, loadedVideos]) => {
  document.getElementById('loader').style.display = 'none'
  videos.applyAll(gltf, loadedVideos)


  // Find clickable nodes by name from your content map
  const sectionNames = Object.keys(SECTIONS)
  const clickableNodes = []

  gltf.scene.traverse((node) => {
    if (sectionNames.includes(node.name)) {
      node.userData.sectionKey = node.name
      clickableNodes.push(node)
      console.log('Registered:', node.name)
    }
  })

  // Give the raycaster its list of clickable objects
  ray.setClickables(clickableNodes)

}).catch(console.error)

// ── Wire Up Interactions ──────────────────────────────────────

ray.onHoverEnter = (mesh) => {
  // You can change the mesh's emissive color here for a glow effect
  // We'll add this in a later step once you confirm the model loads
  console.log('Hovering:', mesh.name)
}

ray.onHoverLeave = (mesh) => {
  // Remove highlight
}

ray.onClick = (mesh) => {
  const key = mesh.userData.sectionKey
  if (!key) return

  cam.zoomTo(mesh, SECTIONS[key])
  panel.open(key)
}

panel.onClose = () => {
  panel.close()
  cam.zoomOut()
}

// ── Animation Loop ────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate)

  cam.update()
  ray.update()
  // controls.update()
  sm.render()
}

animate()