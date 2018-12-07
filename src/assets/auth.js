import decode from 'jwt-decode'

export const getTokenExpirationDate = (token) => {
  const decoded = getTokenHeader(token)
  if (!decoded.exp) {
    return null
  }
  const date = new Date(0)
  date.setUTCSeconds(decoded.exp)
  return date
}

export const isTokenExpired = (token) => {
  const date = getTokenExpirationDate(token)
  const offsetSeconds = 0
  if (date === null) {
    return false
  }
  return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)))
}

export const getTokenBody = (token) => {
  return decode(token)
}

export const getTokenHeader = (token) => {
  return decode(token, { header: true })
}

export const prettifyExpirationDate = (expiration) => {
  const _date = new Date(0)
  _date.setUTCSeconds(expiration)
  let date = _date.toLocaleDateString('en-GB', {
    weekday: 'long',
    hour12: true,
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const _time = new Date(0)
  _time.setUTCSeconds(expiration)
  let time = _time.toLocaleTimeString('en-GB', {
    hour: 'numeric',
    hour12: true,
    minute: 'numeric'
  })

  return `${time} on ${date}`
}
