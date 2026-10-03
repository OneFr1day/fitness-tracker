const CACHE='myfitness-v6.1.1';
const ASSETS=["./", "./index.html", "./manifest.webmanifest", "./version.json", "./icon-192.png?v=6.1.1", "./icon-512.png?v=6.1.1", "./icon-maskable-192.png?v=6.1.1", "./icon-maskable-512.png?v=6.1.1", "./logo.svg?v=6.1.1", "./apple-touch-icon.png?v=6.1.1", "./favicon.ico?v=6.1.1"];
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
