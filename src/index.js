/* global fetch */

/// #if DEVELOPMENT
require('webpack-hot-middleware/client?reload=true')
  .subscribe(({ reload }) => reload && window.location.reload())
/// #endif

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
}

// Search bar
const search = document.querySelector('input[type=search]')
if (search) {
  const bookmarks = document.querySelectorAll('.bookmark')
  const showAll = document.getElementById('showAll')
  search.addEventListener('input', e => {
    if (showAll) showAll.checked = !!search.value

    for (const bookmark of bookmarks) {
      const match = bookmark.dataset.search.toUpperCase().includes(search.value.toUpperCase())
      bookmark.classList.toggle('is-result', match)
    }
  })
}

// Delete buttons
const deletes = document.querySelectorAll('button[data-delete]')
for (const button of deletes) {
  button.addEventListener('click', async e => {
    e.stopPropagation()
    e.preventDefault()

    const response = await fetch(window.location.origin + '/api/bookmark', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: button.dataset.delete })
    })

    if (!response.ok) return window.alert(`[${response.status}] ${response.statusText}`)

    const data = await response.json()
    if (data.error) return window.alert(data.error)

    console.log(data)
    button.parentNode.parentNode.remove()
  })
}
