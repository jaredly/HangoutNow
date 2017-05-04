
const container = document.getElementById('buttons')
window.pick = (events, user) => {
  document.getElementById('top-text').textContent = `Events for ${user.name} : ${user.email}`
  events.forEach(event => {
    const node = document.createElement('div')
    node.className = 'button'
    container.appendChild(node)
    node.textContent = event.summary
    node.onclick = () => {
      show(event.hangoutLink + '&authuser=' + user.email)
    }
  })
}

const show = link => {
  const back = document.createElement('div')
  document.body.appendChild(back)
  back.className = 'loading'
  const node = document.createElement('webview')
  node.src = link
  node.setAttribute('plugins', 'on')
  document.body.appendChild(node)
}
