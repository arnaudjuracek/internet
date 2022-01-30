import 'components/Filter'
import 'templates/articles'
import 'templates/bookmarks'

/// #if DEVELOPMENT
require('webpack-hot-middleware/client?reload=true')
  .subscribe(({ reload }) => reload && window.location.reload())
/// #endif

/// #if !DEVELOPMENT
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js')
/// #endif
