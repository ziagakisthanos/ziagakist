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
    this.homeLookAt = new THREE.Vector3(0, 0, 0)

    // Current look-at target
    this.currentLookAt = new THREE.Vector3(0, 0, 0)
    this.targetLookAt = new THREE.Vector3(0, 0, 0)

    // Target position for zoom animation
    this.targetPosition = camera.position.clone()

    this.listenToMouse()
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

  zoomTo(targetMesh) {
    this.isZoomed = true

    const targetPos = new THREE.Vector3()
    targetMesh.getWorldPosition(targetPos)

    // Position camera in front of the mesh
    // We move along the Z axis toward it — adjust the multiplier to taste
    this.targetPosition.set(
      targetPos.x,
      targetPos.y,
      targetPos.z + 2.0   // 2 units in front of the screen
    )

    this.targetLookAt.copy(targetPos)
  }

  // Call this when user presses ESC or clicks the back button
  zoomOut() {
    this.isZoomed = false
    this.targetPosition.copy(this.homePosition)
    this.targetLookAt.copy(this.homeLookAt)
  }

  // Called every frame from the animation loop
  update() {
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

      this.targetLookAt.set(parallaxX * 0.5, parallaxY * 0.5, 0)
    }

    // Lerp = linear interpolation = smooth slide toward target
    // 0.05 = 5% of the distance each frame = smooth but responsive
    // Higher = snappier, lower = floatier
    this.camera.position.lerp(this.targetPosition, 0.05)
    this.currentLookAt.lerp(this.targetLookAt, 0.05)
    this.camera.lookAt(this.currentLookAt)
  }
}