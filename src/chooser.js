
const setText = (id, text) => document.getElementById(id).textContent = text + ''

const div = (className, ...children) => {
  const node = document.createElement('div')
  node.className = className
  children.map(child => typeof child === 'string' ? document.createTextNode(child) : child).forEach(child => node.appendChild(child))
  return node
}

const container = document.getElementById('buttons')
window.pick = (events, user, startTime, endTime) => {
  setText('email', user.email)
  setText('user-name', user.name)
  setText('num-events', events.length)
  setText('start-time', new Date(startTime).toLocaleTimeString())
  setText('end-time', new Date(endTime).toLocaleTimeString())
  window.eventss = events
  events.forEach(event => {
    const node = div(
      'button',
      div('event-name', event.summary),
      div('spring'),
      div('event-start time', new Date(event.start.dateTime).toLocaleTimeString()),
      div('event-end time', new Date(event.end.dateTime).toLocaleTimeString())
    )
    container.appendChild(node)
    node.onclick = () => {
      show(event.hangoutLink + '&authuser=' + user.email)
    }
  })
}

const show = link => {
  const home = document.getElementById('home')
  home.style.display = 'block'
  const back = document.createElement('div')
  document.body.appendChild(back)
  back.className = 'loading'
  const node = document.createElement('webview')
  node.src = link
  node.setAttribute('plugins', 'on')
  document.body.appendChild(node)
  home.onclick = () => {
    home.style.display = 'none'
    node.parentNode.removeChild(node)
    back.parentNode.removeChild(back)
  }
}
