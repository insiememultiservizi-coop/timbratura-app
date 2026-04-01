const CACHE = 'timbratura-v2';
const BASE = '/timbratura-app';
const ASSETS = [
  BASE + '/timbratura.html',
  BASE + '/icons/icon-timbratura-192.png',
  BASE + '/icons/icon-timbratura-512.png',
  BASE + '/manifest-timbratura.json'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (!e.request.url.startsWith('http')) return;
  if (e.request.url.includes('firebasedatabase') || e.request.url.includes('googleapis') || e.request.url.includes('gstatic') || e.request.url.includes('fonts.google')) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
