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
    this.isZoomingOut = false

    this.listenToMouse()
  }

  beginIntro() {
    this.camera.position.set(0, 6, 26)
    this.currentLookAt.set(0, 2, 0)
    this.camera.lookAt(this.currentLookAt)
  }

  playIntro(onComplete) {
    this._introStartPos   = this.camera.position.clone()
    this._introStartLook  = this.currentLookAt.clone()
    this._introDuration   = 1500
    this._introStartTime  = performance.now()
    this._introOnComplete = onComplete
    this._introPlaying    = true
  }

  snapToHome() {
    this.camera.position.copy(this.homePosition)
    this.currentLookAt.copy(this.homeLookAt)
    this.camera.lookAt(this.currentLookAt)
    this.targetPosition.copy(this.homePosition)
    this._introPlaying = false
  }

  _tickIntro(now) {
    const raw  = Math.min((now - this._introStartTime) / this._introDuration, 1)
    const ease = 1 - Math.pow(1 - raw, 3)

    const endPos  = this.homePosition
    const endLook = new THREE.Vector3(this.mouse.x * 0.15, this.mouse.y * 0.075, -222)

    this.camera.position.lerpVectors(this._introStartPos, endPos, ease)
    this.currentLookAt.lerpVectors(this._introStartLook, endLook, ease)
    this.camera.lookAt(this.currentLookAt)

    if (raw >= 1) {
      this.targetPosition.copy(this.homePosition)
      this.targetLookAt.copy(this.currentLookAt)
      this._introPlaying = false
      if (this._introOnComplete) this._introOnComplete()
    }
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
    this.isZoomingOut = false

    // Bring currentLookAt to just in front of the camera so the look lerp
    // and position lerp cover similar distances and finish at the same time.
    const forward = new THREE.Vector3()
    this.camera.getWorldDirection(forward)
    this.currentLookAt.copy(this.camera.position).addScaledVector(forward, 5)

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
    this.isZoomingOut = true
    this.targetPosition.copy(this.homePosition)
    // Target the idle parallax lookAt directly — homeLookAt (z=0) would cause
    // a swing as currentLookAt then has to travel to z=-222 on the next idle frame
    this.targetLookAt.set(this.mouse.x * 0.15, this.mouse.y * 0.075, -222)
  }

  // Called every frame from the animation loop
  update(delta = 16.67) {
    if (this._introPlaying) { this._tickIntro(performance.now()); return }
    if (!this.isZoomed && !this.isZoomingOut) {
      const parallaxX = this.mouse.x * 0.3
      const parallaxY = this.mouse.y * 0.15

      this.targetPosition.set(
        this.homePosition.x + parallaxX,
        this.homePosition.y + parallaxY,
        this.homePosition.z
      )

      this.targetLookAt.set(parallaxX * 0.5, parallaxY * 0.5, -222)
    }

    // Frame-rate independent lerp: same feel at 30fps, 60fps, or 120fps
    const t = delta / 16.67
    let posBase, lookBase
    if (this.isZoomed) {
      posBase = 0.05; lookBase = 0.09
    } else if (this.isZoomingOut) {
      posBase = 0.08; lookBase = 0.11
    } else {
      posBase = 0.015; lookBase = 0.06
    }

    const posAlpha  = 1 - Math.pow(1 - posBase,  t)
    const lookAlpha = 1 - Math.pow(1 - lookBase, t)

    this.camera.position.lerp(this.targetPosition, posAlpha)
    this.currentLookAt.lerp(this.targetLookAt, lookAlpha)
    this.camera.lookAt(this.currentLookAt)

    // Snap position to home and release to idle once close enough
    if (this.isZoomingOut && this.camera.position.distanceTo(this.homePosition) < 0.05) {
      this.camera.position.copy(this.homePosition)
      // Don't touch currentLookAt — it's already lerping toward the idle parallax target
      this.isZoomingOut = false
    }
  }
}