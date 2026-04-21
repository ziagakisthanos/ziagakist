import { SECTIONS } from '../data/content.js'

export class Panel {
  constructor() {
    this.ui = document.getElementById('ui')

    this.ui.innerHTML = `
      <div id="panel" class="panel panel--hidden">
        <button id="panel-close">✕ Back</button>
        <div id="panel-content"></div>
      </div>
    `

    this.panel   = document.getElementById('panel')
    this.content = document.getElementById('panel-content')
    this.closeBtn = document.getElementById('panel-close')

    // When close button is clicked, call callback
    this.onClose = null
    this.closeBtn.addEventListener('click', () => {
      this.close()
      if (this.onClose) this.onClose()
    })

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close()
        if (this.onClose) this.onClose()
      }
    })
  }

  open(sectionKey) {
    const data = SECTIONS[sectionKey]
    if (!data) return

    // Render the right content based on what's in this section
    this.content.innerHTML = this.buildHTML(data)

    // Remove the hidden class to trigger CSS transition
    this.panel.classList.remove('panel--hidden')
  }

  close() {
    this.panel.classList.add('panel--hidden')
  }

  buildHTML(data) {
    // header — always present
    let html = `
      <div class="panel-tag">${data.label}</div>
      <h2 class="panel-title">${data.title}</h2>
    `

    // Body text (for about, hero, contact)
    if (data.body) {
      html += `<p class="panel-body">${data.body}</p>`
    }

    // Projects list
    if (data.projects) {
      html += '<div class="panel-projects">'
      data.projects.forEach(p => {
        html += `
          <div class="project-item">
            <div class="project-name">${p.name}</div>
            <div class="project-desc">${p.description}</div>
            <div class="project-tags">
              ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
            ${p.link ? `<a href="${p.link}" target="_blank" class="project-link">View →</a>` : ''}
          </div>
        `
      })
      html += '</div>'
    }

    // Skills grid
    if (data.skills) {
      html += '<div class="panel-skills">'
      data.skills.forEach(group => {
        html += `
          <div class="skill-group">
            <div class="skill-category">${group.category}</div>
            <div class="skill-items">${group.items.join(' · ')}</div>
          </div>
        `
      })
      html += '</div>'
    }

    // Contact links
    if (data.links) {
      html += '<div class="panel-links">'
      data.links.forEach(l => {
        html += `<a href="${l.href}" target="_blank" class="contact-link">${l.label} →</a>`
      })
      html += '</div>'
    }

    return html
  }
}