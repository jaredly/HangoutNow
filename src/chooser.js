
const setText = (id, text) => document.getElementById(id).textContent = text + ''

const container = document.getElementById('buttons')
window.pick = (events, user, startTime, endTime) => {
  setText('email', user.email)
  setText('user-name', user.name)
  setText('num-events', events.length)
  setText('start-time', new Date(startTime).toLocaleTimeString())
  setText('end-time', new Date(endTime).toLocaleTimeString())
  window.eventss = events
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
