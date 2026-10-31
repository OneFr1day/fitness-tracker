const CACHE='myfitness-v6.4.0';
const ASSETS=["./", "./index.html", "./manifest.webmanifest", "./version.json", "./icon-192.png?v=6.4.0", "./icon-512.png?v=6.4.0", "./icon-maskable-192.png?v=6.4.0", "./icon-maskable-512.png?v=6.4.0", "./logo.svg?v=6.4.0", "./apple-touch-icon.png?v=6.4.0", "./favicon.ico?v=6.4.0"];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>
    k!==CACHE&&(k.startsWith('onefriday-fitness-')||k.startsWith('myfitness-'))
  ).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(response=>{
      if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put('./index.html',copy)));}
      return response;
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
