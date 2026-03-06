import * as THREE from 'three'
import { SceneManager } from './scene/SceneManager.js'
import { ModelLoader }   from './scene/ModelLoader.js'
import { CameraController } from './scene/CameraController.js'
import { RaycastManager }   from './interaction/RaycastManager.js'
import { Panel }            from './ui/Panel.js'
import { SECTIONS }         from './data/content.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

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

// ── Load Model ───────────────────────────────────────────────
loader.load('/models/old_computers.glb').then((gltf) => {
  console.log('Model loaded!')

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

// When cursor enters a clickable mesh — optional: add highlight
ray.onHoverEnter = (mesh) => {
  // You can change the mesh's emissive color here for a glow effect
  // We'll add this in a later step once you confirm the model loads
  console.log('Hovering:', mesh.name)
}

ray.onHoverLeave = (mesh) => {
  // Remove highlight
}

// When user clicks a TV
ray.onClick = (mesh) => {
  const key = mesh.userData.sectionKey
  if (!key) return

  cam.zoomTo(mesh)
  panel.open(key)
}

// When user closes the panel
panel.onClose = () => {
  panel.close()
  cam.zoomOut()
}

//debug controls
window.addEventListener('keydown', (e) => {
  if (e.key === 'd') {
    const p = sm.camera.position
    const t = cam.currentLookAt
    console.log(`position: set(${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)})`)
    console.log(`lookAt:   set(${t.x.toFixed(2)}, ${t.y.toFixed(2)}, ${t.z.toFixed(2)})`)
  }
})
// ── Animation Loop ────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate)
  // cam.update()
  ray.update()
  controls.update()
  sm.render()
}

animate()