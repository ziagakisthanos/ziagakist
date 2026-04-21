import * as THREE from 'three'

export class ScreenManager {
  applyAll(sections, gltf) {
    Object.entries(sections).forEach(([cubeName, data]) => {
      if (data.videoOnly) return

      const screenMesh = cubeName.endsWith('_1') ? cubeName : `${cubeName}_1`
      let target = null
      gltf.scene.traverse(node => {
        if (node.isMesh && node.name === screenMesh) target = node
      })
      if (!target) return

      target.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x030a03),
        emissive: new THREE.Color(0x0d2010),
        emissiveIntensity: 0.6,
      })
    })
  }
}
