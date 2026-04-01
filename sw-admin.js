const CACHE_NAME = 'admin-v3';
const REPO = '/timbratura-app';

const PRECACHE = [
  REPO + '/admin.html',
  REPO + '/manifest-admin.json',
  REPO + '/icons/icon-admin-192.png',
  REPO + '/icons/icon-admin-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (url.includes('firebasedatabase.app') || url.includes('googleapis.com') ||
      url.includes('gstatic.com') || url.includes('fonts.google') ||
      url.includes('firebaseapp.com')) {
    return;
  }
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok && url.includes('github.io')) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
