const species = [
  {id:'pawpaw',name:'Pawpaw',latin:'Asimina triloba',type:['fruit','tree'],icon:'🥭',season:'Aug–Oct',likelihood:'High',habitat:'Moist, rich woods and creek bottoms; often grows in colonies beneath taller trees.',find:'Large drooping leaves, maroon spring flowers, and soft oblong fruit with custard-like flesh.',use:'Ripe pulp is eaten fresh or used in smoothies and baked goods. Seeds and skin are not eaten.',medicinal:'Pawpaw has a history of traditional plant use, but no safe home medicinal dose is established. Seeds, bark and leaves contain biologically active compounds and should not be swallowed or used for self-treatment.',handle:'Only collect fruit that yields slightly and smells fragrant. Refrigerate quickly.',warning:'Some people experience digestive upset. Never eat the seeds or skin.'},
  {id:'mulberry',name:'Mulberry',latin:'Morus spp.',type:['fruit','tree'],icon:'🫐',season:'May–Jul',likelihood:'High',habitat:'Edges, alleys, parks, fence lines, and disturbed sunny ground.',find:'Variable toothed leaves and clustered berries that ripen from pale to red, then dark purple or black.',use:'Fully ripe berries are used fresh, dried, or in preserves.',medicinal:'Mulberry fruit and leaves have traditional uses related to nutrition and blood-sugar support. Human evidence and preparations vary; leaf products may interact with diabetes medicines.',handle:'Use a clean sheet beneath the canopy and gently shake branches. Wash fruit well.',warning:'Unripe fruit and milky sap may cause stomach upset or skin irritation.'},
  {id:'persimmon',name:'American persimmon',latin:'Diospyros virginiana',type:['fruit','tree'],icon:'🟠',season:'Sep–Dec',likelihood:'Medium',habitat:'Open woods, old fields, roadsides, and woodland edges.',find:'Blocky dark bark, oval leaves, and orange fruit with a leafy four-part cap.',use:'Fully ripe, soft fruit is used in puddings, breads, and preserves.',medicinal:'Persimmon fruit and other plant parts appear in traditional digestive and respiratory preparations. Clinical evidence is limited, and highly tannic unripe fruit is not a substitute for medical treatment.',handle:'Wait until fruit is extremely soft; astringent unripe fruit can be unpleasant.',warning:'Confirm the tree and ripeness. Avoid roadside fruit exposed to heavy traffic pollution.'},
  {id:'blackberry',name:'Wild blackberry',latin:'Rubus spp.',type:['fruit'],icon:'🫐',season:'Jun–Aug',likelihood:'High',habitat:'Sunny thickets, field edges, trailsides, and disturbed ground.',find:'Arching thorny canes, compound leaves, white flowers, and berries with a solid core.',use:'Ripe berries can be eaten fresh or cooked into sauces and preserves.',medicinal:'Blackberry leaf and root have traditional astringent uses for minor diarrhea and sore-throat rinses. Evidence is limited; concentrated tannin-rich preparations are not appropriate for everyone.',handle:'Wear gloves, inspect for insects, and wash gently.',warning:'Distinguish from lookalikes and avoid sprayed or contaminated areas.'},
  {id:'violet',name:'Common blue violet',latin:'Viola sororia',type:['herb'],icon:'🌸',season:'Mar–May',likelihood:'High',habitat:'Lawns, gardens, open woods, and shaded moist ground.',find:'Heart-shaped leaves and five-petaled purple flowers arising separately from the base.',use:'Flowers and young leaves are sometimes used in salads, syrups, or as garnish.',medicinal:'Violets have traditional use in soothing teas, syrups and topical preparations. Evidence for treating illness is limited; correct species identification and unsprayed material are essential.',handle:'Harvest sparingly from unsprayed ground; rinse carefully.',warning:'Do not confuse foliage with toxic lookalikes. Roots are not used as food.'},
  {id:'nettle',name:'Stinging nettle',latin:'Urtica dioica',type:['herb'],icon:'🌿',season:'Mar–Jun',likelihood:'Medium',habitat:'Rich damp soil, stream margins, woodland edges, and disturbed ground.',find:'Opposite serrated leaves and fine stinging hairs on stems and leaves.',use:'Properly cooked young leaves are used like cooked greens or in tea.',medicinal:'Nettle leaf and root are used in herbal traditions for urinary symptoms, joint discomfort and seasonal allergies. Preparations differ and may interact with blood-pressure, diabetes, diuretic or blood-thinning medicines.',handle:'Wear gloves. Blanch or cook thoroughly to deactivate stinging hairs.',warning:'Never eat raw mature leaves. Confirm identification and consider medication interactions.'},
  {id:'chicken',name:'Chicken of the woods',latin:'Laetiporus spp.',type:['fungus'],icon:'🍄',season:'May–Oct',likelihood:'Medium',habitat:'Layered shelves on living or dead hardwoods; some species occur on conifers.',find:'Bright orange-to-yellow overlapping shelves with pores underneath and no gills.',use:'Young, tender portions are cooked thoroughly; texture is often compared with chicken.',medicinal:'Laboratory research has examined Laetiporus compounds, but there is no established home medicinal use or dose. Treat it as an expert-verified food only, not medicine.',handle:'Photograph the host tree and underside. Cook a small portion thoroughly if expert-verified.',warning:'Expert verification is essential. Some people react badly, especially to specimens on certain trees.'},
  {id:'morel',name:'Morel',latin:'Morchella spp.',type:['fungus'],icon:'🍄',season:'Mar–May',likelihood:'Low',habitat:'Woodlands, old orchards, and areas associated with particular trees and soil disturbance.',find:'Honeycombed cap whose pits and ridges attach continuously to the stem; hollow when cut lengthwise.',use:'Expert-verified true morels are eaten only after thorough cooking.',medicinal:'Morels are primarily culinary. Research on mushroom nutrients and compounds is preliminary and does not establish a safe medicinal preparation or dose.',handle:'Cut lengthwise during verification and preserve habitat notes.',warning:'False morels can be dangerously toxic. Never consume from image identification alone.'}
];

const observations = [
  {species:'pawpaw',lat:37.5407,lng:-77.4308,label:'Creek-bottom habitat'},
  {species:'mulberry',lat:37.5569,lng:-77.4696,label:'Public observation'},
  {species:'violet',lat:37.5276,lng:-77.4474,label:'Seasonal report'},
  {species:'blackberry',lat:37.5702,lng:-77.5212,label:'Trail-edge habitat'},
  {species:'persimmon',lat:37.5139,lng:-77.4148,label:'Historic observation'},
  {species:'chicken',lat:37.5794,lng:-77.4551,label:'Approximate area'}
];

const regions = [
  {name:'Near me',level:'Current location',scope:'Uses your device location only after permission is granted',center:null,zoom:14,boost:[]},
  {name:'Richmond, Virginia',level:'Citywide',scope:'Richmond city and immediate urban habitat',center:[37.5407,-77.4360],zoom:12,boost:['mulberry','violet','blackberry','persimmon']},
  {name:'Richmond Metro, Virginia',level:'Metro area',scope:'Richmond, Henrico, Chesterfield, Hanover and nearby localities',center:[37.55,-77.46],zoom:10,boost:['pawpaw','mulberry','blackberry','persimmon']},
  {name:'Virginia Piedmont',level:'Geographic region',scope:'Rolling uplands between the Coastal Plain and Blue Ridge',center:[37.75,-78.2],zoom:7,boost:['pawpaw','persimmon','blackberry','violet']},
  {name:'Virginia Coastal Plain',level:'Geographic region',scope:'Tidewater and Atlantic coastal plain of Virginia',center:[37.2,-76.6],zoom:7,boost:['persimmon','blackberry','violet']},
  {name:'Shenandoah Valley, Virginia',level:'Geographic region',scope:'Great Valley between the Blue Ridge and Alleghenies',center:[38.25,-78.85],zoom:8,boost:['nettle','morel','blackberry']},
  {name:'Blue Ridge, Virginia',level:'Geographic region',scope:'Blue Ridge mountain corridor in Virginia',center:[37.9,-79.1],zoom:7,boost:['nettle','morel','chicken','blackberry']},
  {name:'Virginia',level:'Statewide',scope:'All physiographic regions within Virginia',center:[37.7,-78.5],zoom:7,boost:['pawpaw','persimmon','blackberry','violet','nettle']},
  {name:'Mid-Atlantic United States',level:'Multi-state region',scope:'Virginia, Maryland, DC, Delaware, West Virginia, Pennsylvania, New Jersey and adjoining transition areas',center:[39,-77],zoom:6,boost:['pawpaw','mulberry','persimmon','blackberry','nettle','morel','chicken']}
];

const dataSources = [
  {name:'iNaturalist',use:'Community observations, taxon names, dates, locations and licensed observation media through its public API.',url:'https://www.inaturalist.org/pages/api+reference'},
  {name:'Pl@ntNet',use:'Plant-identification suggestions through its authorized API; suggestions remain evidence, never an edibility verdict.',url:'https://my.plantnet.org/'},
  {name:'GBIF',use:'Occurrence records, taxonomy, dataset provenance, maps and licensed occurrence imagery through GBIF APIs.',url:'https://techdocs.gbif.org/en/openapi/'},
  {name:'USDA PLANTS',use:'United States plant profiles, distribution and reference data under published access and reuse terms.',url:'https://plants.usda.gov/'},
  {name:'Apple Vision / Visual Intelligence',use:'Optional on-device photo classification and system handoff; no bulk ingestion of Apple private image catalogs.',url:'https://developer.apple.com/machine-learning/api/'},
  {name:'Google Lens / Images, TinEye & Pinterest Lens',use:'User-initiated reverse-search or authorized provider integrations for corroborating context. Forage Finder does not scrape these services.',url:'https://lens.google/'},
  {name:'Open vision models',use:'Replaceable OpenCV, YOLO, RAM/RAM++ and CLIP-family adapters can generate regions, tags and candidate matches without exposing private coordinates.',url:'https://opencv.org/'},
  {name:'Regional expert references',use:'University extension, herbaria and parks for safety review and local context.',url:'https://ext.vt.edu/'}
];

const sightingSignals = [
  {species:'pawpaw',sourceType:'inaturalist',identityConfidence:.96,locationConfidence:.92,corroboration:.8,observedAt:'2026-09-10',lat:37.54,lng:-77.43,geoprivacy:'open'},
  {species:'mulberry',sourceType:'social',identityConfidence:.72,locationConfidence:.45,corroboration:.62,observedAt:'2026-09-12',lat:37.56,lng:-77.47,geoprivacy:'obscured'},
  {species:'persimmon',sourceType:'historical',identityConfidence:.88,locationConfidence:.65,corroboration:.7,observedAt:'2025-10-02',lat:37.51,lng:-77.41,geoprivacy:'open'},
  {species:'chicken',sourceType:'community',identityConfidence:.68,locationConfidence:.2,corroboration:.4,observedAt:'2026-09-15',lat:null,lng:null,geoprivacy:'private'}
];

let currentFilter='all'; let currentRegion=regions[1]; let map; let markers=[]; let userMarker; let installPrompt; let currentPosition={lat:37.5407,lng:-77.4360};
const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];

function renderList(){
  const query=$('#searchInput').value.trim().toLowerCase();
  const found=species.filter(item=>(currentFilter==='all'||item.type.includes(currentFilter))&&(`${item.name} ${item.latin} ${item.habitat}`.toLowerCase().includes(query)));
  $('#resultCount').textContent=`${found.length} ${found.length===1?'find':'finds'}`;
  $('#speciesList').innerHTML=found.map(item=>`<button class="species-card" data-id="${item.id}"><span class="species-icon">${item.icon}</span><span><h3>${item.name}</h3><p>${item.season} · ${item.type.join(' / ')}</p></span><span class="likelihood">${regionalLikelihood(item)}</span></button>`).join('')||'<p>No regional guide entries match that search.</p>';
  $$('.species-card').forEach(button=>button.addEventListener('click',()=>showDetail(button.dataset.id)));
}

function regionalLikelihood(item){
  if(currentRegion.boost.includes(item.id)) return item.likelihood==='Low'?'Medium':'High';
  return item.likelihood==='High'?'Medium':item.likelihood;
}

function renderRegions(){
  $('#regionOptions').innerHTML=regions.map(region=>`<option value="${region.name}">${region.level}</option>`).join('');
  $('#sourceList').innerHTML=dataSources.map(source=>`<article class="source-item"><h3>${source.name}</h3><p>${source.use}</p><a href="${source.url}" target="_blank" rel="noopener">View source policy ↗</a></article>`).join('');
}

function renderRadarStatus(){
  const el=$('#radarStatus'); if(!el)return;
  if(!window.FFIntel){el.textContent='Signals ranked by source, identity, location, recency and corroboration';return;}
  const cluster=window.FFIntel.cluster(sightingSignals); const strong=cluster.signals.filter(signal=>signal.score>=.5).length;
  el.textContent=`${cluster.count} intelligence signals · ${strong} stronger leads · private/obscured locations protected`;
}

async function applyRegion(){
  const value=$('#regionInput').value.trim().toLowerCase();
  if(value==='near me'||value==='my location'){locateUser();return;}
  const region=regions.find(r=>r.name.toLowerCase()===value)||regions.find(r=>r.name.toLowerCase().includes(value)||value.includes(r.name.toLowerCase()));
  if(region){
    currentRegion=region; $('#regionInput').value=region.name; $('#regionEyebrow').textContent=region.name.toUpperCase(); $('#regionScope').textContent=`${region.level} · ${region.scope}`;
    if(map&&region.center)map.setView(region.center,region.zoom); renderList(); toast(`Showing ${region.name}`);return;
  }
  $('#regionScope').textContent='Searching OpenStreetMap geographic index…';
  try{
    const url=`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent($('#regionInput').value.trim())}`;
    const result=(await fetch(url,{headers:{Accept:'application/json'}})).json(); const places=await result;
    if(!places.length)throw new Error('not found');
    const place=places[0]; const center=[Number(place.lat),Number(place.lon)];
    currentRegion={name:place.display_name.split(',').slice(0,3).join(','),level:'Searched area',scope:place.display_name,center,zoom:10,boost:species.map(item=>item.id)};
    $('#regionEyebrow').textContent=currentRegion.name.toUpperCase(); $('#regionScope').textContent=`${currentRegion.level} · ${currentRegion.scope}`;
    if(map&&place.boundingbox){map.fitBounds([[Number(place.boundingbox[0]),Number(place.boundingbox[2])],[Number(place.boundingbox[1]),Number(place.boundingbox[3])]]);}else if(map){map.setView(center,10);}
    renderList(); toast(`Showing ${currentRegion.name}`);
  }catch(error){$('#regionScope').textContent='Region not found · try a city, state, Virginia Piedmont, or Mid-Atlantic';toast('Region not found');}
}

function showDetail(id){
  const item=species.find(entry=>entry.id===id); if(!item)return;
  $('#detailContent').innerHTML=`<div class="detail-hero"><span class="species-icon">${item.icon}</span><div><h2>${item.name}</h2><p class="latin">${item.latin}</p><span class="likelihood">${item.season}</span></div></div><p class="notice"><strong>Identification support only.</strong> Verify every field mark with multiple reliable sources and a qualified local expert before handling or consuming.</p><div class="detail-grid"><div><h3>Where to look</h3><p>${item.habitat}</p><h3>Field marks</h3><p>${item.find}</p></div><div><h3>Traditional / food uses</h3><p>${item.use}</p><h3>Medicinal use</h3><p>${item.medicinal}</p><p class="medical-note">Traditional-use context is not medical advice. Check interactions with a qualified clinician or pharmacist.</p><h3>Handling</h3><p>${item.handle}</p><h3>Important caution</h3><p>${item.warning}</p></div></div><div class="detail-actions"><button class="find-near-button" data-find-near="${item.id}">⌖ Find near me</button></div>`;
  $('#detailContent [data-find-near]').addEventListener('click',()=>findNearMe(item.id));
  $('#detailDialog').showModal();
}

function initMap(){
  if(!window.L){ $('#mapMessage').textContent='Map unavailable offline · guide still works'; return; }
  map=L.map('map',{zoomControl:false}).setView([37.5407,-77.4360],12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OpenStreetMap contributors'}).addTo(map);
  L.control.zoom({position:'bottomright'}).addTo(map); renderMarkers(); $('#mapMessage').hidden=true;
}

function renderMarkers(speciesId=null){
  if(!map)return; markers.forEach(marker=>marker.remove()); markers=[];
  observations.forEach(obs=>{const item=species.find(entry=>entry.id===obs.species); if(!item||(speciesId&&obs.species!==speciesId)||(currentFilter!=='all'&&!item.type.includes(currentFilter)))return;
    const icon=L.divIcon({className:'',html:`<div class="custom-marker"><span>${item.icon}</span></div>`,iconSize:[34,42],iconAnchor:[17,40]});
    markers.push(L.marker([obs.lat,obs.lng],{icon}).addTo(map).bindPopup(`<strong>${item.name}</strong><br>${obs.label}<br><small>Approximate location</small>`));
  });
}

function distanceMiles(a,b){const r=3958.8,toRad=value=>value*Math.PI/180;const dLat=toRad(b.lat-a.lat),dLng=toRad(b.lng-a.lng);const h=Math.sin(dLat/2)**2+Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLng/2)**2;return 2*r*Math.asin(Math.sqrt(h));}

function setUserLocation(position,message='Map centered on your location'){
  currentPosition={lat:position.coords.latitude,lng:position.coords.longitude};
  if(map){if(userMarker)userMarker.remove();userMarker=L.circleMarker([currentPosition.lat,currentPosition.lng],{radius:8,color:'#fff',weight:3,fillColor:'#246dd7',fillOpacity:1}).addTo(map).bindPopup('Your approximate location');map.setView([currentPosition.lat,currentPosition.lng],14);userMarker.openPopup();}
  $('#regionInput').value='Near me'; $('#regionEyebrow').textContent='NEAR ME'; $('#regionScope').textContent='Current location · exact coordinates stay in this browser session'; toast(message);
}

function locateUser(){
  if(!navigator.geolocation){toast('Location is not supported here');return;}
  navigator.geolocation.getCurrentPosition(position=>setUserLocation(position),()=>toast('Location permission was not granted'),{enableHighAccuracy:false,timeout:10000,maximumAge:300000});
}

function findNearMe(id){
  const item=species.find(entry=>entry.id===id); if(!item)return; $('#detailDialog').close(); $('#searchInput').value=item.name; renderList(); renderMarkers(id);
  if(!navigator.geolocation){toast(`Showing known approximate ${item.name} sightings`);return;}
  navigator.geolocation.getCurrentPosition(position=>{
    setUserLocation(position,`Finding ${item.name} near you…`); renderMarkers(id);
    const matches=observations.filter(obs=>obs.species===id); if(!matches.length){toast(`No public ${item.name} sightings nearby yet · showing habitat guidance`);return;}
    const nearest=matches.map(obs=>({...obs,miles:distanceMiles(currentPosition,obs)})).sort((a,b)=>a.miles-b.miles)[0];
    if(map){const points=[[currentPosition.lat,currentPosition.lng],...matches.map(obs=>[obs.lat,obs.lng])];map.fitBounds(points,{padding:[55,55],maxZoom:13});if(markers[0])markers[0].openPopup();}
    toast(`Closest approximate ${item.name} signal: ${nearest.miles.toFixed(1)} mi`);
  },()=>toast(`Location unavailable · showing known approximate ${item.name} sightings`),{enableHighAccuracy:false,timeout:10000,maximumAge:300000});
}

function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(el.timer);el.timer=setTimeout(()=>el.classList.remove('show'),2800)}
function openLog(){ $('#logSpecies').innerHTML=species.map(s=>`<option value="${s.id}">${s.name}</option>`).join(''); $('#logDialog').showModal(); }

$$('.filter').forEach(button=>button.addEventListener('click',()=>{$$('.filter').forEach(b=>b.classList.remove('active'));button.classList.add('active');currentFilter=button.dataset.filter;renderList();renderMarkers()}));
$('#searchInput').addEventListener('input',renderList); $$('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
$('#applyRegion').addEventListener('click',applyRegion); $('#regionInput').addEventListener('change',applyRegion); $('#regionInput').addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();applyRegion()}});
$('#sourceButton').addEventListener('click',()=>$('#sourceDialog').showModal());
$('#addFindButton').addEventListener('click',openLog);
$('#logForm').addEventListener('submit',event=>{if(event.submitter?.value==='cancel')return;const saved=JSON.parse(localStorage.getItem('forageFinds')||'[]');saved.push({species:$('#logSpecies').value,notes:$('#logNotes').value,position:currentPosition,private:$('#privateLocation').checked,createdAt:new Date().toISOString()});localStorage.setItem('forageFinds',JSON.stringify(saved));toast('Field note saved on this device');$('#logForm').reset()});
$('#locateButton').addEventListener('click',locateUser);
$('#identifyButton').addEventListener('click',()=>$('#photoInput').click()); $('#photoInput').addEventListener('change',()=>toast('Photo ready for permitted biological-ID and vision adapters. Never identify edibility from one image.'));
$('#savedButton').addEventListener('click',()=>{const count=JSON.parse(localStorage.getItem('forageFinds')||'[]').length;toast(count?`${count} field ${count===1?'note':'notes'} saved on this device`:'No field notes saved yet')});
$('#guideButton').addEventListener('click',()=>toast('Verify multiple field marks, avoid fungi without expert review, get permission, and leave enough for wildlife.'));
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;$('#installButton').hidden=false}); $('#installButton').addEventListener('click',async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$('#installButton').hidden=true});
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js?v=4'));
window.ForageRadar={signals:sightingSignals,providers:window.FFIntel?.providerCatalog||[],addSignals(items){sightingSignals.push(...items.map(item=>window.FFIntel?window.FFIntel.normalize(item):item));renderRadarStatus();}};
renderRegions(); renderRadarStatus(); renderList(); initMap();
