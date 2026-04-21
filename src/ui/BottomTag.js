export class BottomTag {
  constructor(heroData) {
    const el = document.createElement('div')
    el.id = 'bottom-tag'

    const name = heroData.tittle ?? heroData.title ?? ''
    const roles = heroData.roles ?? []

    el.innerHTML = `
      <div class="bottom-tag-name">${name}</div>
      <div class="bottom-tag-roles">
        ${roles.map(r => `<span>${r}</span>`).join('')}
      </div>
    `

    document.body.appendChild(el)
  }
}
