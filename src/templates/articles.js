/* global fetch */

// Handle archive buttons
for (const button of document.querySelectorAll('button[data-archive]')) {
  button.addEventListener('click', async e => {
    e.stopPropagation()
    e.preventDefault()

    const response = await fetch(window.location.origin + '/api/article', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: button.dataset.archive })
    })

    if (!response.ok) return window.alert(`[${response.status}] ${response.statusText}`)

    const data = await response.json()
    if (data.error) return window.alert(data.error)

    console.log(data)
    window.location.reload()
  })
}
