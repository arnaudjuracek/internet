const filter = document.querySelector('input[type=search].filter')
const filterable = document.querySelector('[data-filterable]')
const items = filterable && filterable.querySelectorAll('[data-filter]')
const showAll = document.getElementById('showAll')

if (filter) {
  filter.addEventListener('input', e => {
    if (showAll) showAll.checked = !!filter.value
    filterable.classList.toggle('is-filtered', !!filter.value)

    for (const item of items) {
      const match = item.dataset.filter.toUpperCase().includes(filter.value.toUpperCase())
      item.classList.toggle('is-result', match)
    }
  })
}
