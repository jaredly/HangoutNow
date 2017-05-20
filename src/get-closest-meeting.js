
const gcal = require('google-calendar')

const prom = fn => new Promise((res, rej) => fn((err, val) => err ? rej(err) : res(val)))

const HOUR_MS = 1000 * 60 * 60

const now = Date.now()
Date.now = () => now - HOUR_MS * 6

const hoursFromNow = hours => {
  return new Date(Date.now() + hours * HOUR_MS).toISOString()
}

const cmp = (a, b) => a < b ? -1 : a > b ? 1 : 0

module.exports = user => {
  const api = new gcal.GoogleCalendar(user.token.access_token)
  const startTime = hoursFromNow(-1)
  const endTime = hoursFromNow(1)
  return prom(done => api.calendarList.list({minAccessRole: 'reader'}, done))
    .then(({items}) => Promise.all(items.map(
      cal => prom(done => api.events.list(cal.id, {
        singleEvents: true,
        orderBy: 'startTime',
        timeMax: endTime,
        timeMin: startTime,
      }, done)).then(({items}) => items)
    ))).then(nested => [].concat(...nested)).then(events => {
      console.log('got', events.length, 'events')
      const got = {}
      const hangouts = events
        .filter(m => m.hangoutLink) // only w/ hangouts
        .filter(m => !m.start.date) // exclude all-day events
        .filter(m => got[m.id] ? false : (got[m.id] = true)) // dedup
        .sort((a, b) => new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime())
      console.log('got', hangouts.length, 'events with hangout')
      return {events: hangouts, startTime, endTime}
    })
}

