import * as THREE from 'three'

export class RaycastManager {
  constructor(camera, renderer) {
    this.camera = camera
    this.renderer = renderer

    this.raycaster = new THREE.Raycaster()

    // Current normalized mouse position
    this.mouse = new THREE.Vector2(-10, -10) // start offscreen

    this.hoveredMesh = null

    // Callback functions — set these from outside
    // This pattern (callbacks instead of hardcoded actions) keeps this class reusable
    this.onHoverEnter = null  // called when cursor enters a clickable mesh
    this.onHoverLeave = null  // called when cursor leaves a clickable mesh
    this.onClick      = null  // called when user clicks a clickable mesh

    this._listen()
  }

  _listen() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    })

    window.addEventListener('click', () => {
      if (this.hoveredMesh && this.onClick) {
        this.onClick(this.hoveredMesh)
      }
    })
  }


  setClickables(meshes) {
    this.clickables = meshes
  }

  // Called every frame
  update() {
    if (!this.clickables || this.clickables.length === 0) return

    this.raycaster.setFromCamera(this.mouse, this.camera)

    // Test intersections — returns array sorted by distance (closest first)
    const hits = this.raycaster.intersectObjects(this.clickables, true)
    // The 'true' argument means check children recursively
    // Important for GLB models where a click target may have child meshes

    const hit = hits.length > 0 ? hits[0].object : null

    // Hover enter — cursor moved onto a new mesh
    if (hit && hit !== this.hoveredMesh) {
      if (this.hoveredMesh && this.onHoverLeave) {
        this.onHoverLeave(this.hoveredMesh)
      }
      this.hoveredMesh = hit
      if (this.onHoverEnter) this.onHoverEnter(hit)
      document.body.style.cursor = 'pointer'
    }

    // Hover leave — cursor moved off all meshes
    if (!hit && this.hoveredMesh) {
      if (this.onHoverLeave) this.onHoverLeave(this.hoveredMesh)
      this.hoveredMesh = null
      document.body.style.cursor = 'default'
    }
  }
}