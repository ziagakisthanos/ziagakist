import * as THREE from 'three'

export class RaycastManager {
  constructor(camera, renderer) {
    this.camera = camera
    this.renderer = renderer

    this.raycaster = new THREE.Raycaster()

    this.mouse = new THREE.Vector2(-10, -10)
    this._mouseDirty = false
    this._hits = []

    this.hoveredMesh = null

    this.onHoverEnter = null
    this.onHoverLeave = null
    this.onClick      = null

    this._listen()
  }

  _listen() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x =  (e.clientX / window.innerWidth)  * 2 - 1
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
      this._mouseDirty = true
    })

    window.addEventListener('click', () => {
      if (this.hoveredMesh && this.onClick) {
        this.onClick(this.hoveredMesh)
      }
    })
  }


  setClickables(meshes) {
    this.clickables = meshes
    // Pre-flatten to actual mesh objects so intersectObjects doesn't recurse every frame
    this._flatMeshes = []
    meshes.forEach(node => {
      node.traverse(child => { if (child.isMesh) this._flatMeshes.push(child) })
    })
  }

  update() {
    if (!this._flatMeshes || this._flatMeshes.length === 0) return
    if (!this._mouseDirty) return
    this._mouseDirty = false

    this.raycaster.setFromCamera(this.mouse, this.camera)

    this._hits.length = 0
    this.raycaster.intersectObjects(this._flatMeshes, false, this._hits)

    const hit = this._hits.length > 0 ? this._hits[0].object : null

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