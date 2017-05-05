const fetch = require('node-fetch')
const login = require('./login')
const path = require('path')
const fs = require('fs')
const {apiKey} = require('./secret.json')

const saveData = (documentsDir /*: string*/, token /*: any*/) => {
  const savedPath = path.join(documentsDir, 'user.json')
  fs.writeFileSync(savedPath, JSON.stringify(token))
}

const getSavedData = documentsDir => {
  const savedPath = path.join(documentsDir, 'user.json')
  return new Promise((res, rej) => {
    fs.readFile(savedPath, 'utf8', (err, data) => {
      if (err) {
        console.log('nope load', err)
        return res(null) // assume not there
      }
      try {
        res(JSON.parse(data))
      } catch (e) {
        console.error('restoring user', e)
        return res(null)
      }
    })
  })
}

const addExpiresAt = token =>
  ((token.expires_at = Date.now() + token.expires_in * 1000), token)

const getProfile = token => {
  return fetch(
    `https://www.googleapis.com/plus/v1/people/me?key=${apiKey}`,
    {
      headers: {
        Authorization: 'Bearer ' + token.access_token
      }
    }
  )
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        console.log(JSON.stringify(data.error))
        console.error('failed to get user', data.error, apiKey, token)
        throw new Error('Unable to login w/ google')
      }
      return {
        name: data.displayName,
        profile: data.image.url,
        email: data.emails[0] && data.emails[0].value,
        token
      }
    })
}


const maybeRefreshToken = (token, documentsDir) => {
  if (token) {
    if (Date.now() > token.expires_at) {
      return login.refresh(token)
        .then(addExpiresAt)
        .then(token => (saveData(documentsDir, token), token))
        .then(getProfile)
    } else {
      return getProfile(token)
        .catch(err => {
          console.log('bad creds sounds like')
          return login.authorize()
            .then(addExpiresAt)
            .then(token => (saveData(documentsDir, token), token))
            .then(getProfile)
        })
    }
  }
  return login.authorize()
    .then(addExpiresAt)
    .then(token => (saveData(documentsDir, token), token))
    .then(getProfile)
}

const getSession = documentsDir => {
  return getSavedData(documentsDir)
    .then(token => maybeRefreshToken(token, documentsDir))
}

module.exports = getSession

