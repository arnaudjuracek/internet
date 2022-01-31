import bindAPIButton from 'utils/bind-api-button'

bindAPIButton('button[data-archive]', {
  endpoint: '/api/article',
  method: 'DELETE',
  json: button => ({
    url: button.dataset.archive
  }),
  onSuccess: () => window.location.reload()
})
