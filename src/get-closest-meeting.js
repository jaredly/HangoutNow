
const gcal = require('google-calendar')

const prom = fn => new Promise((res, rej) => fn((err, val) => err ? rej(err) : res(val)))

const HOUR_MS = 1000 * 60 * 60

const hoursFromNow = hours => {
  return new Date(Date.now() + hours * HOUR_MS).toISOString()
}

module.exports = user => {
  const api = new gcal.GoogleCalendar(user.token.access_token)
  return prom(done => api.calendarList.list({minAccessRole: 'reader'}, done))
    .then(({items}) => Promise.all(items.map(
      cal => prom(done => api.events.list(cal.id, {
        singleEvents: true,
        orderBy: 'startTime',
        timeMax: hoursFromNow(1),
        timeMin: hoursFromNow(-2),
      }, done)).then(({items}) => items)
    ))).then(nested => [].concat(...nested)).then(events => {
      console.log('got', events.length, 'events')
      const hangouts = events
        .filter(m => m.hangoutLink) // only w/ hangouts
        .filter(m => !m.start.date) // exclude all-day events
      console.log('got', hangouts.length, 'events with hangout')
      console.log(hangouts.map(m => m.summary))
      console.log(hangouts.slice(0, 20).map(m => JSON.stringify(m.start)))
      return hangouts
    })
}

