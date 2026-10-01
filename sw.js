const CACHE='forage-finder-v11';
const SHELL=['./','index.html','styles.css?v=11','app.js?v=11','sighting-intelligence.js?v=11','manifest.webmanifest?v=11','favicon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('forage-finder-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    try{
      const response=await fetch(event.request);
      if(response.ok)await cache.put(event.request,response.clone());
      return response;
    }catch(error){
      const cached=await cache.match(event.request);if(cached)return cached;
      if(event.request.mode==='navigate')return await cache.match('index.html')||Response.error();
      return Response.error();
    }
  })());
});

