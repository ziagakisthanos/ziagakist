// src/scene/VideoManager.js
import * as THREE from 'three'

export class VideoManager {
  constructor(scene) {
    this.scene = scene
    this.configs = []
  }

  add(src, meshName, repeat, offset) {
    this.configs.push({ src, meshName, repeat, offset })
    return this // allows chaining
  }

  loadAndApplyAll(gltf) {
    this.configs.forEach(config => {
      const video = document.createElement('video')
      video.src = config.src
      video.loop = true
      video.muted = true
      video.playsInline = true
      video.preload = 'auto'
      video.addEventListener('canplaythrough', () => {
        const texture = new THREE.VideoTexture(video)
        texture.colorSpace = THREE.SRGBColorSpace
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.generateMipmaps = false
        texture.repeat.set(...config.repeat)
        texture.offset.set(...config.offset)

        gltf.scene.traverse((node) => {
          if (node.name === config.meshName) {
            node.material = new THREE.MeshStandardMaterial({
              map: texture,
              emissiveMap: texture,
              emissive: new THREE.Color(0xffffff),
              emissiveIntensity: 1.3
            })
          }
        })

        video.play()
      }, { once: true })
      video.load()
    })
  }
}