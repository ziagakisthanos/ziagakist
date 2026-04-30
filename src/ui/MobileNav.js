const MENU_KEYS = ['Cube009', 'Cube014', 'Cube023', 'Cube037', 'Cube018', 'Cube027']

export class MobileNav {
  constructor(sections) {
    this._sections = sections

    this._el = document.createElement('div')
    this._el.id = 'mobile-nav'
    this._el.classList.add('hidden')

    this._menuPanel = document.createElement('div')
    this._menuPanel.className = 'mobile-nav-inner'

    this._detailPanel = document.createElement('div')
    this._detailPanel.className = 'mobile-nav-inner mobile-nav-detail'
    this._detailPanel.style.display = 'none'

    this._el.appendChild(this._menuPanel)
    this._el.appendChild(this._detailPanel)
    document.body.appendChild(this._el)

    this._buildMenu()
  }

  show() {
    this._el.classList.remove('hidden')
    this._showMenu()
  }

  _buildMenu() {
    const items = MENU_KEYS
      .filter(key => this._sections[key]?.preview)
      .map(key => `
        <button class="mobile-nav-item" data-key="${key}">
          <span class="mobile-nav-item-label">${this._sections[key].preview}</span>
          <span class="mobile-nav-item-arrow">→</span>
        </button>
      `).join('')

    this._menuPanel.innerHTML = `
      <div class="mobile-nav-header">
        <div class="mobile-nav-name">Ziagakis Athanasios</div>
        <div class="mobile-nav-roles">
          <span>Full-stack Developer</span>
          <span>Creative Technologist</span>
        </div>
      </div>
      <div class="mobile-nav-divider"></div>
      <nav class="mobile-nav-list">${items}</nav>
    `

    this._menuPanel.querySelectorAll('.mobile-nav-item').forEach(btn => {
      btn.addEventListener('click', () => this._showDetail(btn.dataset.key))
    })
  }

  _showMenu() {
    this._detailPanel.style.display = 'none'
    this._menuPanel.style.display = 'flex'
    this._menuPanel.scrollTop = 0
  }

  _showDetail(key) {
    const data = this._sections[key]

    this._detailPanel.innerHTML = `
      <button class="mobile-back-btn">← BACK</button>
      <div class="mobile-detail-content">
        ${this._buildDetailHTML(data)}
      </div>
    `
    this._detailPanel.querySelector('.mobile-back-btn')
      .addEventListener('click', () => this._showMenu())

    this._menuPanel.style.display = 'none'
    this._detailPanel.style.display = 'flex'
    this._detailPanel.scrollTop = 0
  }

  _buildDetailHTML(data) {
    let html = ''

    if (data.label) html += `<div class="mobile-detail-tag">${data.label}</div>`
    if (data.title) html += `<h2 class="mobile-detail-title">${data.title}</h2>`
    if (data.body)  html += `<p class="mobile-detail-body">${data.body}</p>`

    if (data.skills?.length) {
      html += `<div class="mobile-detail-skills">`
      for (const { category, items } of data.skills) {
        if (!items.length) continue
        html += `
          <div class="mobile-detail-skill-row">
            <div class="mobile-detail-skill-cat">${category}</div>
            <div class="mobile-detail-skill-items">${items.join(' · ')}</div>
          </div>`
      }
      html += `</div>`
    }

    if (data.links?.length) {
      html += `<div class="mobile-detail-links">`
      for (const link of data.links) {
        const extra = link.download ? 'download' : 'target="_blank" rel="noopener"'
        html += `<a href="${link.href}" ${extra} class="mobile-detail-link">${link.label}</a>`
      }
      html += `</div>`
    }

    if (data.carousel?.length) {
      html += `<div class="mobile-detail-slides">`
      for (const slide of data.carousel) {
        html += `
          <div class="mobile-detail-slide">
            <div class="mobile-detail-slide-title">${slide.title}</div>
            <p class="mobile-detail-slide-body">${slide.body}</p>
            ${(slide.links || []).map(l =>
              `<a href="${l.href}" target="_blank" rel="noopener" class="mobile-detail-link">${l.label}</a>`
            ).join('')}
          </div>`
      }
      html += `</div>`
    }

    return html
  }
}
