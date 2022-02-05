/* global fetch */
import 'components/Filter'

// Ensure <Swiper> buttons are hidden by default
window.addEventListener('load', () => {
  for (const swiper of document.querySelectorAll('.swiper')) {
    swiper.scrollLeft = 0
  }
})

// Bind all API buttons
for (const button of document.querySelectorAll('button[data-endpoint][data-method]')) {
  const container = button.parentNode.parentNode
  const item = container && container.querySelector('a[href]')
  if (!item) continue

  // Extract relevant API options from DOM
  const endpoint = button.dataset.endpoint
  const method = button.dataset.method
  const input = button.dataset.input && {
    key: button.dataset.inputKey,
    message: button.dataset.inputMessage
  }

  // Bind button
  button.addEventListener('click', async e => {
    e.stopPropagation()
    e.preventDefault()

    // Create body
    const body = { url: item.getAttribute('href') }
    if (input) {
      const value = window.prompt(input.message, item.dataset[input.key])
      if (!value) return
      body[input.key] = value
    }

    // Call API
    const response = await fetch(window.location.origin + endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    // Handle error
    if (!response.ok) return window.alert(`[${response.status}] ${response.statusText}`)
    const data = await response.json()
    if (data.error) return window.alert(data.error)

    // Handle success
    console.log(data)
    window.location.reload()
  })
}
