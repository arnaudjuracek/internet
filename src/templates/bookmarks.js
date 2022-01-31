import bindAPIButton from 'utils/bind-api-button'

bindAPIButton('button[data-delete]', {
  endpoint: '/api/bookmark',
  method: 'DELETE',
  json: button => ({ url: button.dataset.delete }),
  onSuccess: button => button.parentNode.parentNode.remove()
})

bindAPIButton('button[data-rename]', {
  endpoint: '/api/bookmark',
  method: 'PATCH',
  json: button => {
    const title = window.prompt('Rename bookmark', button.dataset.default)
    return title && { title, url: button.dataset.rename }
  },
  onSuccess: (button, data) => {
    const title = button.parentNode.parentNode.querySelector('.list__item-title')
    if (title) title.textContent = data.renamed.title
  }
})
