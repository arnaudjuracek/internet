/// #if DEVELOPMENT
require('webpack-hot-middleware/client?reload=true')
  .subscribe(({ reload }) => reload && window.location.reload())
/// #endif

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
