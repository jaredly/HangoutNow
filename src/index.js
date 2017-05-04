
const {app, BrowserWindow} = require('electron')
const getSession = require('./session')
const getClosestMeeting = require('./get-closest-meeting')
let mainWindow


app.on('window-all-closed', function() {
  mainWindow = null
  app.quit();
});

const openWindow = (events, user) => {
  console.log('opening', events)
  if (!events.length) {
    console.log('nothing')
  } else {
    mainWindow = new BrowserWindow({
      width: 800,
      // skipTaskBar: true,
      alwaysOnTop: true,
      titleBarStyle: 'hidden',
      // frame: false,
      title: 'Hangouts it up',
      height: 600,
      webPreferences: {
        plugins: true,
      },
    });
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.webContents.executeJavaScript(
        `pick(${JSON.stringify(events)}, ${JSON.stringify(user)})`)
    })
  }
}

app.on('ready', () => {
  getSession(app.getPath('userData')).then(user => {
    return getClosestMeeting(user).then(events => openWindow(events, user))
  })
})

