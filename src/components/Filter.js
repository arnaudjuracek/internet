const filter = document.querySelector('input[type=search].filter')

if (filter) {
  const items = document.querySelectorAll('[data-filter]')
  const showAll = document.getElementById('showAll')
  filter.addEventListener('input', e => {
    if (showAll) showAll.checked = !!filter.value

    for (const item of items) {
      const match = item.dataset.filter.toUpperCase().includes(filter.value.toUpperCase())
      item.classList.toggle('is-result', match)
    }
  })
}
