import * as THREE from 'three'

export class CameraController {
  constructor(camera) {
    this.camera = camera

    this.basePosition = camera.position.clone()

    // Mouse position in normalized coordinates (-1 to +1)
    this.mouse = new THREE.Vector2(0, 0)

    this.isZoomed = false

    // Store the position to return to when user exits zoom
    this.homePosition = camera.position.clone()
    this.homeLookAt = new THREE.Vector3(-1, 2.5, 0)

    // Current look-at target
    this.currentLookAt = new THREE.Vector3(0, 0, 0)
    this.targetLookAt = new THREE.Vector3(0, -10, 0)

    // Target position for zoom animation
    this.targetPosition = camera.position.clone()

    this._introPlaying = false

    this.listenToMouse()
  }

  beginIntro() {
    this._introPlaying = true
    this.camera.position.set(0, 6, 26)
    this.currentLookAt.set(0, 2, 0)
    this.camera.lookAt(this.currentLookAt)
  }

  playIntro(onComplete) {
    const startPos  = this.camera.position.clone()
    const endPos    = this.homePosition.clone()
    const startLook = this.currentLookAt.clone()
    // const idleLook  = new THREE.Vector3()
    const endLook = this.homeLookAt.clone()
    const duration  = 1500
    const startTime = performance.now()

    const tick = (now) => {
      const raw  = Math.min((now - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - raw, 3)

      // Target the idle lookAt (z=-222) so hand-off to update() has no gap
      endLook.set(this.mouse.x * 0.15, this.mouse.y * 0.075, -222)

      this.camera.position.lerpVectors(startPos, endPos, ease)
      this.currentLookAt.lerpVectors(startLook, endLook, ease)
      this.camera.lookAt(this.currentLookAt)

      if (raw < 1) {
        requestAnimationFrame(tick)
      } else {
        this.targetPosition.copy(this.homePosition)
        this.targetLookAt.copy(this.currentLookAt)
        this._introPlaying = false
        if (onComplete) onComplete()
      }
    }

    requestAnimationFrame(tick)
  }

  listenToMouse() {
    window.addEventListener('mousemove', (e) => {
      // Convert pixel coordinates to -1..+1 range
      // At center of screen: (0, 0)
      // At top-left: (-1, 1)
      this.mouse.x = (e.clientX / window.innerWidth)  * 2 - 1
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    })
  }

  zoomTo(targetMesh, sectionData) {
    this.isZoomed = true

    const targetPos = new THREE.Vector3()
    targetMesh.getWorldPosition(targetPos)
   


    const cam = sectionData?.camera ?? {}
    const off = cam.offset      ?? { x: 0, y: 0, z: 4 }
    const look = cam.lookAtOffset ?? { x: 0, y: 0 }

    this.targetPosition.set(
      targetPos.x + off.x,
      targetPos.y + off.y,
      targetPos.z + off.z
    )

    this.targetLookAt.copy(targetPos)
    this.targetLookAt.x += look.x
    this.targetLookAt.y += look.y
  }

  // Call this when user presses ESC or clicks the back button
  zoomOut() {
    this.isZoomed = false
    this.targetPosition.copy(this.homePosition)
    this.targetLookAt.copy(this.homeLookAt)
  }

  // Called every frame from the animation loop
  update() {
    if (this._introPlaying) return
    if (!this.isZoomed) {
      // Parallax effect — camera drifts slightly following the mouse
      // The strength (0.3) controls how much it moves — tune to taste
      const parallaxX = this.mouse.x * 0.3
      const parallaxY = this.mouse.y * 0.15

      this.targetPosition.set(
        this.homePosition.x + parallaxX,
        this.homePosition.y + parallaxY,
        this.homePosition.z
      )

      this.targetLookAt.set(parallaxX * 0.5, parallaxY * 0.5, -222)
    }

    // Lerp = linear interpolation = smooth slide toward target
    // 0.05 = 5% of the distance each frame = smooth but responsive
    // Higher = snappier, lower = floatier
    this.camera.position.lerp(this.targetPosition, 0.015)
    this.currentLookAt.lerp(this.targetLookAt, 0.06)
    this.camera.lookAt(this.currentLookAt)
  }
}