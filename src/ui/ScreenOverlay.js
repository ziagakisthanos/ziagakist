import { CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import * as THREE from 'three'

const DIV_W = 1300
const DIV_H = 800
const CANVAS_W = 512
const CANVAS_H = 320

export class ScreenOverlay {
  constructor(cssScene) {
    this.cssScene = cssScene
    this._items = {}   // key → { obj, div, mesh, sectionData }
    this._activeKey = null
  }

  openAll(clickableNodes, sections) {
    clickableNodes.forEach(mesh => {
      const key = mesh.userData.sectionKey
      const data = sections[key]
      if (!data || !this._hasContent(data)) return
      this._create(mesh, data)
    })
  }

  setActive(sectionKey) {
    if (this._activeKey && this._items[this._activeKey]) {
      const { obj, div, previewObj } = this._items[this._activeKey]
      this.cssScene.remove(obj)
      div.classList.remove('active')
      if (previewObj) this.cssScene.add(previewObj)
    }
    this._activeKey = sectionKey
    if (sectionKey && this._items[sectionKey]) {
      const { obj, div, previewObj } = this._items[sectionKey]
      if (previewObj) this.cssScene.remove(previewObj)
      this.cssScene.add(obj)
      div.classList.add('active')
    }
  }

  clearActive() {
    this.setActive(null)
  }

  _hasContent(data) {
    return !!(data.preview || data.body || data.links || data.skills || data.projects || data.carousel || data.label || data.title || data.tittle)
  }

  _create(mesh, sectionData) {
    const key = mesh.userData.sectionKey
    const targetMesh = mesh.userData.screenMesh ?? mesh

    const screenPos = new THREE.Vector3()
    targetMesh.getWorldPosition(screenPos)
    screenPos.y += 0.6

    const box = new THREE.Box3().setFromObject(targetMesh)
    const size = box.getSize(new THREE.Vector3())
    const cam = sectionData.camera ?? {}
    const off = cam.offset ?? { x: 0, y: 0, z: 4 }
    const autoW = Math.abs(off.z) >= Math.abs(off.x) ? size.x : size.z
    const autoH = size.y
    const worldSize = sectionData.worldSize ?? {}
    const screenW = worldSize.w ?? autoW
    const screenH = worldSize.h ?? autoH

    // ── CSS3D preview ──────────────────
    let previewObj = null
    if (sectionData.preview) {
      const previewDiv = document.createElement('div')
      previewDiv.className = 'screen-preview'
      previewDiv.textContent = sectionData.preview
      if (sectionData.previewFontSize) previewDiv.style.fontSize = sectionData.previewFontSize
      if (sectionData.previewColor) previewDiv.style.color = sectionData.previewColor
      if (sectionData.previewTextShadow) previewDiv.style.textShadow = sectionData.previewTextShadow

      const pOff = sectionData.previewOffset ?? {}
      previewObj = new CSS3DSprite(previewDiv)
      previewObj.position.set(
        screenPos.x + (pOff.x ?? 0),
        screenPos.y + (pOff.y ?? 0),
        screenPos.z + (pOff.z ?? 0)
      )
      const pScale = sectionData.previewScale ?? {}
      previewObj.scale.set(
        (screenW / DIV_W) * (pScale.x ?? 1),
        (screenH / DIV_H) * (pScale.y ?? 1),
        1
      )
      this.cssScene.add(previewObj)
    }

    // ── CSS3D full overlay ────────────
    const div = document.createElement('div')
    div.className = 'screen-overlay'
    div.innerHTML = this._buildHTML(sectionData)
    div.addEventListener('click', (e) => e.stopPropagation())
    if (sectionData.carousel) this._initCarousel(div)

    const divW = sectionData.overlayWidth  ?? DIV_W
    const divH = sectionData.overlayHeight ?? DIV_H

    if (sectionData.overlayWidth)  div.style.width  = divW + 'px'
    if (sectionData.overlayHeight) div.style.height = divH + 'px'

    const oOff = sectionData.overlayOffset ?? {}
    const obj = new CSS3DSprite(div)
    obj.position.set(
      screenPos.x + (oOff.x ?? 0),
      screenPos.y + (oOff.y ?? 0),
      screenPos.z + (oOff.z ?? 0)
    )
    obj.scale.set(
      screenW / divW,
      screenH / divH,
      1
    )

    this._items[key] = { obj, div, mesh, sectionData, previewObj }
    // obj not added to cssScene — only added in setActive()
  }

  // ── Canvas renderer ─────────────────────────────────────────────

  _renderToCanvas(data) {
    const canvas = document.createElement('canvas')
    canvas.width = CANVAS_W
    canvas.height = CANVAS_H
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#0A0F0A'
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

    const PAD = 28
    let y = 36

    if (data.label) {
      ctx.font = '11px "Jersey 10", sans-serif'
      ctx.fillStyle = 'rgba(100, 200, 100, 0.45)'
      ctx.fillText(data.label, PAD, y)
      y += 20
    }

    const title = data.title ?? data.tittle
    if (title) {
      ctx.font = 'bold 30px "Jersey 10", sans-serif'
      ctx.fillStyle = 'rgba(180, 255, 180, 0.9)'
      ctx.fillText(title, PAD, y)
      y += 42
    }

    if (data.body) {
      ctx.font = '13px "Courier New"'
      ctx.fillStyle = 'rgba(120, 210, 120, 0.6)'
      y += this._wrapText(ctx, data.body, PAD, y, CANVAS_W - PAD * 2, 19) + 10
    }

    if (data.links) {
      data.links.forEach(l => {
        ctx.font = '15px "Courier New"'
        ctx.fillStyle = 'rgba(140, 255, 140, 0.75)'
        ctx.fillText(`${l.label}  →`, PAD, y)
        y += 26
      })
    }

    if (data.skills) {
      data.skills.forEach(group => {
        ctx.font = '10px "Jersey 10"'
        ctx.fillStyle = 'rgba(100, 200, 100, 0.4)'
        ctx.fillText(group.category, PAD, y)
        y += 15
        ctx.font = '13px "Jersey 10"'
        ctx.fillStyle = 'rgba(140, 255, 140, 0.75)'
        ctx.fillText(group.items.join('  ·  '), PAD, y)
        y += 22
      })
    }

    if (data.projects) {
      data.projects.forEach(p => {
        ctx.font = 'bold 16px "Courier New"'
        ctx.fillStyle = 'rgba(160, 255, 160, 0.85)'
        ctx.fillText(p.name, PAD, y)
        y += 22
        ctx.font = '12px "Courier New"'
        ctx.fillStyle = 'rgba(100, 200, 100, 0.55)'
        y += this._wrapText(ctx, p.description, PAD, y, CANVAS_W - PAD * 2, 17) + 6
        if (p.link) {
          ctx.font = '13px "Courier New"'
          ctx.fillStyle = 'rgba(120, 255, 120, 0.65)'
          ctx.fillText('View  →', PAD, y)
          y += 22
        }
      })
    }

    return canvas
  }

  _wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ')
    let line = ''
    let height = 0
    words.forEach(word => {
      const test = line + word + ' '
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, y + height)
        line = word + ' '
        height += lineHeight
      } else {
        line = test
      }
    })
    ctx.fillText(line, x, y + height)
    return height + lineHeight
  }

  // ── HTML builder for CSS3D overlay ──────────────────────────────

  _buildHTML(data) {
    const title = data.title ?? data.tittle
    let html = `<div class="screen-tag">${data.label ?? ''}</div>`
    if (title) html += `<h2 class="screen-title">${title}</h2>`

    if (data.body) html += `<p class="screen-body">${data.body}</p>`

    if (data.projects) {
      html += '<div class="screen-projects">'
      data.projects.forEach(p => {
        html += `
          <div class="project-item">
            <div class="project-name">${p.name}</div>
            <div class="project-desc">${p.description}</div>
            <div class="project-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
            ${p.link ? `<a href="${p.link}" target="_blank" class="project-link">View →</a>` : ''}
          </div>`
      })
      html += '</div>'
    }

    if (data.skills) {
      html += '<div class="screen-skills">'
      data.skills.forEach(g => {
        html += `
          <div class="skill-group">
            <div class="skill-category">${g.category}</div>
            <div class="skill-items">${g.items.join(' · ')}</div>
          </div>`
      })
      html += '</div>'
    }

    if (data.links) {
      html += '<div class="screen-links">'
      data.links.forEach(l => {
        const dl = l.download ? ' download' : ''
        html += `<a href="${l.href}" target="_blank" class="contact-link"${dl}>${l.label} →</a>`
      })
      html += '</div>'
    }

    if (data.carousel) {
      html += '<div class="carousel-wrapper">'
      data.carousel.forEach((project, i) => {
        html += `<div class="carousel-slide${i === 0 ? ' carousel-slide--active' : ''}">`
        html += `<h2 class="screen-title">${project.title}</h2>`
        if (project.body) html += `<p class="screen-body">${project.body}</p>`
        if (project.links) {
          html += '<div class="screen-links">'
          project.links.forEach(l => {
            html += `<a href="${l.href}" target="_blank" class="contact-link">${l.label} →</a>`
          })
          html += '</div>'
        }
        html += '</div>'
      })
      html += `
        <div class="carousel-nav">
          <button class="carousel-prev">←</button>
          <span class="carousel-counter">1 / ${data.carousel.length}</span>
          <button class="carousel-next">→</button>
        </div>
      `
      html += '</div>'
    }

    return html
  }

  _initCarousel(div) {
    const slides = [...div.querySelectorAll('.carousel-slide')]
    const counter = div.querySelector('.carousel-counter')
    const prev = div.querySelector('.carousel-prev')
    const next = div.querySelector('.carousel-next')
    let current = 0
    const total = slides.length

    const go = (idx) => {
      slides[current].classList.remove('carousel-slide--active')
      current = ((idx % total) + total) % total
      slides[current].classList.add('carousel-slide--active')
      counter.textContent = `${current + 1} / ${total}`
    }

    prev.addEventListener('click', (e) => { e.stopPropagation(); go(current - 1) })
    next.addEventListener('click', (e) => { e.stopPropagation(); go(current + 1) })
  }
}
