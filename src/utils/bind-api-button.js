/* global fetch */
import noop from 'utils/noop'

export default function (selector, {
  endpoint = '/api/',
  method = 'POST',
  json = button => {},
  onSuccess = noop,
  onError = error => window.alert(error)
} = {}) {
  for (const button of document.querySelectorAll(selector)) {
    button.addEventListener('click', async e => {
      e.stopPropagation()
      e.preventDefault()

      const body = json(button)
      if (!body) return

      const response = await fetch(window.location.origin + endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) return window.alert(`[${response.status}] ${response.statusText}`)

      const data = await response.json()
      if (data.error) return onError(data.error)

      console.log(data)
      onSuccess(button, data)
    })
  }
}
