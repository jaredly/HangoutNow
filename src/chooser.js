
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
  container.innerHTML = ''
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
      showForEmail(event.hangoutLink, user.email)
    }
  })
  window.show = link => showForEmail(link, user.email)
  document.getElementById('input').onpaste = e => {
    [...e.clipboardData.items].some(item => {
      if (item.kind === 'string' && item.type === 'text/plain') {
        item.getAsString(str => {
          if (str.trim().match(/^https?:\/\//)) {
            showForEmail(str.trim(), user.email)
          }
        })
        return true
      }
    })
  }
}

const showForEmail = (link, email) => {
  if (link.includes('?')) {
    show(link + '&authuser=' + email)
  } else {
    show(link + '?authuser=' + email)
  }
}

const show = link => {
  const mute = document.getElementById('mute')
  const home = document.getElementById('home')
  home.style.display = 'block'
  mute.style.display = 'block'
  mute.className = ''
  mute.onclick = () => {
    node.setAudioMuted(!node.isAudioMuted())
    mute.className = node.isAudioMuted() ? 'muted' : ''
    mute.textContent = node.isAudioMuted() ? 'unmute' : 'mute'
  }
  const back = document.createElement('div')
  document.body.appendChild(back)
  back.className = 'loading'
  const node = document.createElement('webview')
  node.src = link
  node.setAttribute('plugins', 'on')
  document.body.appendChild(node)
  home.onclick = () => {
    home.style.display = 'none'
    mute.style.display = 'none'
    node.parentNode.removeChild(node)
    back.parentNode.removeChild(back)
  }
}
