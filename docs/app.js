const species = [
  {id:'pawpaw',name:'Pawpaw',latin:'Asimina triloba',type:['fruit','tree'],icon:'🥭',season:'Aug–Oct',likelihood:'High',habitat:'Moist, rich woods and creek bottoms; often grows in colonies beneath taller trees.',find:'Large drooping leaves, maroon spring flowers, and soft oblong fruit with custard-like flesh.',use:'Ripe pulp is eaten fresh or used in smoothies and baked goods. Seeds and skin are not eaten.',handle:'Only collect fruit that yields slightly and smells fragrant. Refrigerate quickly.',warning:'Some people experience digestive upset. Never eat the seeds or skin.'},
  {id:'mulberry',name:'Mulberry',latin:'Morus spp.',type:['fruit','tree'],icon:'🫐',season:'May–Jul',likelihood:'High',habitat:'Edges, alleys, parks, fence lines, and disturbed sunny ground.',find:'Variable toothed leaves and clustered berries that ripen from pale to red, then dark purple or black.',use:'Fully ripe berries are used fresh, dried, or in preserves.',handle:'Use a clean sheet beneath the canopy and gently shake branches. Wash fruit well.',warning:'Unripe fruit and milky sap may cause stomach upset or skin irritation.'},
  {id:'persimmon',name:'American persimmon',latin:'Diospyros virginiana',type:['fruit','tree'],icon:'🟠',season:'Sep–Dec',likelihood:'Medium',habitat:'Open woods, old fields, roadsides, and woodland edges.',find:'Blocky dark bark, oval leaves, and orange fruit with a leafy four-part cap.',use:'Fully ripe, soft fruit is used in puddings, breads, and preserves.',handle:'Wait until fruit is extremely soft; astringent unripe fruit can be unpleasant.',warning:'Confirm the tree and ripeness. Avoid roadside fruit exposed to heavy traffic pollution.'},
  {id:'blackberry',name:'Wild blackberry',latin:'Rubus spp.',type:['fruit'],icon:'🫐',season:'Jun–Aug',likelihood:'High',habitat:'Sunny thickets, field edges, trailsides, and disturbed ground.',find:'Arching thorny canes, compound leaves, white flowers, and berries with a solid core.',use:'Ripe berries can be eaten fresh or cooked into sauces and preserves.',handle:'Wear gloves, inspect for insects, and wash gently.',warning:'Distinguish from lookalikes and avoid sprayed or contaminated areas.'},
  {id:'violet',name:'Common blue violet',latin:'Viola sororia',type:['herb'],icon:'🌸',season:'Mar–May',likelihood:'High',habitat:'Lawns, gardens, open woods, and shaded moist ground.',find:'Heart-shaped leaves and five-petaled purple flowers arising separately from the base.',use:'Flowers and young leaves are sometimes used in salads, syrups, or as garnish.',handle:'Harvest sparingly from unsprayed ground; rinse carefully.',warning:'Do not confuse foliage with toxic lookalikes. Roots are not used as food.'},
  {id:'nettle',name:'Stinging nettle',latin:'Urtica dioica',type:['herb'],icon:'🌿',season:'Mar–Jun',likelihood:'Medium',habitat:'Rich damp soil, stream margins, woodland edges, and disturbed ground.',find:'Opposite serrated leaves and fine stinging hairs on stems and leaves.',use:'Properly cooked young leaves are used like cooked greens or in tea.',handle:'Wear gloves. Blanch or cook thoroughly to deactivate stinging hairs.',warning:'Never eat raw mature leaves. Confirm identification and consider medication interactions.'},
  {id:'chicken',name:'Chicken of the woods',latin:'Laetiporus spp.',type:['fungus'],icon:'🍄',season:'May–Oct',likelihood:'Medium',habitat:'Layered shelves on living or dead hardwoods; some species occur on conifers.',find:'Bright orange-to-yellow overlapping shelves with pores underneath and no gills.',use:'Young, tender portions are cooked thoroughly; texture is often compared with chicken.',handle:'Photograph the host tree and underside. Cook a small portion thoroughly if expert-verified.',warning:'Expert verification is essential. Some people react badly, especially to specimens on certain trees.'},
  {id:'morel',name:'Morel',latin:'Morchella spp.',type:['fungus'],icon:'🍄',season:'Mar–May',likelihood:'Low',habitat:'Woodlands, old orchards, and areas associated with particular trees and soil disturbance.',find:'Honeycombed cap whose pits and ridges attach continuously to the stem; hollow when cut lengthwise.',use:'Expert-verified true morels are eaten only after thorough cooking.',handle:'Cut lengthwise during verification and preserve habitat notes.',warning:'False morels can be dangerously toxic. Never consume from image identification alone.'}
];

const observations = [
  {species:'pawpaw',lat:37.5407,lng:-77.4308,label:'Creek-bottom habitat'},
  {species:'mulberry',lat:37.5569,lng:-77.4696,label:'Public observation'},
  {species:'violet',lat:37.5276,lng:-77.4474,label:'Seasonal report'},
  {species:'blackberry',lat:37.5702,lng:-77.5212,label:'Trail-edge habitat'},
  {species:'persimmon',lat:37.5139,lng:-77.4148,label:'Historic observation'},
  {species:'chicken',lat:37.5794,lng:-77.4551,label:'Approximate area'}
];

let currentFilter='all'; let map; let markers=[]; let installPrompt; let currentPosition={lat:37.5407,lng:-77.4360};
const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];

function renderList(){
  const query=$('#searchInput').value.trim().toLowerCase();
  const found=species.filter(item=>(currentFilter==='all'||item.type.includes(currentFilter))&&(`${item.name} ${item.latin} ${item.habitat}`.toLowerCase().includes(query)));
  $('#resultCount').textContent=`${found.length} ${found.length===1?'find':'finds'}`;
  $('#speciesList').innerHTML=found.map(item=>`<button class="species-card" data-id="${item.id}"><span class="species-icon">${item.icon}</span><span><h3>${item.name}</h3><p>${item.season} · ${item.type.join(' / ')}</p></span><span class="likelihood">${item.likelihood}</span></button>`).join('')||'<p>No local guide entries match that search.</p>';
  $$('.species-card').forEach(button=>button.addEventListener('click',()=>showDetail(button.dataset.id)));
}

function showDetail(id){
  const item=species.find(entry=>entry.id===id); if(!item)return;
  $('#detailContent').innerHTML=`<div class="detail-hero"><span class="species-icon">${item.icon}</span><div><h2>${item.name}</h2><p class="latin">${item.latin}</p><span class="likelihood">${item.season}</span></div></div><p class="notice"><strong>Identification support only.</strong> Verify every field mark with multiple reliable sources and a qualified local expert before handling or consuming.</p><div class="detail-grid"><div><h3>Where to look</h3><p>${item.habitat}</p><h3>Field marks</h3><p>${item.find}</p></div><div><h3>Traditional / food uses</h3><p>${item.use}</p><h3>Handling</h3><p>${item.handle}</p><h3>Important caution</h3><p>${item.warning}</p></div></div>`;
  $('#detailDialog').showModal();
}

function initMap(){
  if(!window.L){ $('#mapMessage').textContent='Map unavailable offline · guide still works'; return; }
  map=L.map('map',{zoomControl:false}).setView([37.5407,-77.4360],12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OpenStreetMap contributors'}).addTo(map);
  L.control.zoom({position:'bottomright'}).addTo(map); renderMarkers(); $('#mapMessage').hidden=true;
}

function renderMarkers(){
  if(!map)return; markers.forEach(marker=>marker.remove()); markers=[];
  observations.forEach(obs=>{const item=species.find(entry=>entry.id===obs.species); if(!item||(currentFilter!=='all'&&!item.type.includes(currentFilter)))return;
    const icon=L.divIcon({className:'',html:`<div class="custom-marker"><span>${item.icon}</span></div>`,iconSize:[34,42],iconAnchor:[17,40]});
    markers.push(L.marker([obs.lat,obs.lng],{icon}).addTo(map).bindPopup(`<strong>${item.name}</strong><br>${obs.label}<br><small>Approximate location</small>`));
  });
}

function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(el.timer);el.timer=setTimeout(()=>el.classList.remove('show'),2800)}
function openLog(){ $('#logSpecies').innerHTML=species.map(s=>`<option value="${s.id}">${s.name}</option>`).join(''); $('#logDialog').showModal(); }

$$('.filter').forEach(button=>button.addEventListener('click',()=>{$$('.filter').forEach(b=>b.classList.remove('active'));button.classList.add('active');currentFilter=button.dataset.filter;renderList();renderMarkers()}));
$('#searchInput').addEventListener('input',renderList); $$('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
$('#addFindButton').addEventListener('click',openLog);
$('#logForm').addEventListener('submit',event=>{if(event.submitter?.value==='cancel')return;const saved=JSON.parse(localStorage.getItem('forageFinds')||'[]');saved.push({species:$('#logSpecies').value,notes:$('#logNotes').value,position:currentPosition,private:$('#privateLocation').checked,createdAt:new Date().toISOString()});localStorage.setItem('forageFinds',JSON.stringify(saved));toast('Field note saved on this device');$('#logForm').reset()});
$('#locateButton').addEventListener('click',()=>{if(!navigator.geolocation)return toast('Location is not supported here');navigator.geolocation.getCurrentPosition(pos=>{currentPosition={lat:pos.coords.latitude,lng:pos.coords.longitude};if(map){map.setView([currentPosition.lat,currentPosition.lng],14);L.circleMarker([currentPosition.lat,currentPosition.lng],{radius:8,color:'#fff',weight:3,fillColor:'#246dd7',fillOpacity:1}).addTo(map).bindPopup('Your approximate location').openPopup()}toast('Map centered on your location')},()=>toast('Location permission was not granted'))});
$('#identifyButton').addEventListener('click',()=>$('#photoInput').click()); $('#photoInput').addEventListener('change',()=>toast('Photo captured. Expert/API identification will be connected next.'));
$('#savedButton').addEventListener('click',()=>{const count=JSON.parse(localStorage.getItem('forageFinds')||'[]').length;toast(count?`${count} field ${count===1?'note':'notes'} saved on this device`:'No field notes saved yet')});
$('#guideButton').addEventListener('click',()=>toast('Verify multiple field marks, avoid fungi without expert review, get permission, and leave enough for wildlife.'));
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;$('#installButton').hidden=false}); $('#installButton').addEventListener('click',async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$('#installButton').hidden=true});
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));
renderList(); initMap();
