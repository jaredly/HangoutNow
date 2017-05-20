
const {app, dialog, BrowserWindow} = require('electron')
const getSession = require('./session')
const getClosestMeeting = require('./get-closest-meeting')
let mainWindow

app.on('window-all-closed', function() {
  if (mainWindow) {
    mainWindow = null
    app.quit();
  }
});

const openWindow = (events, user, startTime, endTime) => {
  console.log('open', events)
  mainWindow = new BrowserWindow({
    width: 800,
    alwaysOnTop: true,
    titleBarStyle: 'hidden',
    title: 'Hangouts it up',
    height: 600,
    webPreferences: {
      plugins: true,
    },
  });
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.executeJavaScript(
      `pick(
        ${JSON.stringify(events)},
        ${JSON.stringify(user)},
        ${JSON.stringify(startTime)},
        ${JSON.stringify(endTime)}
      )`)
  })
}

app.on('ready', () => {
  getSession(app.getPath('userData')).then(user => {
    return getClosestMeeting(user).then(
      ({events, startTime, endTime}) => openWindow(events, user, startTime, endTime)
    )
  }).catch(err => {
    console.log('failure')
    console.error(err)
    app.quit()
  })
})

