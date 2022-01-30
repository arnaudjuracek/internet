/* global self, fetch, caches */

const NS = '{{PACKAGE_NAME}}@{{PACKAGE_VERSION}}'
const CACHE = [
  '/',
  '/index.html',
  '/articles',
  '/articles.html',
  'bundle.css',
  'bundle.js'
]

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(NS)
    await cache.addAll(CACHE)
  })())
})

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (key === NS) { return }
      return caches.delete(key)
    }))
  }))
})

// Serve the online ressource if possible, fallback to cache
self.addEventListener('fetch', e => {
  e.respondWith((async () => {
    try {
      const response = await fetch(e.request)
      const cache = await caches.open(NS)
      cache.put(e.request, response.clone())
      return response
    } catch (error) {
      const cache = await caches.match(e.request)
      return cache || fetch(e.request)
    }
  })())
})
