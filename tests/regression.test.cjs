const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
function app(){
  const elements=new Map();
  const el=s=>{if(!elements.has(s))elements.set(s,{value:s==='#regionInput'?'Richmond, Virginia':'',textContent:'',innerHTML:'',classList:{add(){},remove(){}},addEventListener(){},showModal(){},close(){}});return elements.get(s);};
  const c={console,URL,Date,setTimeout:()=>0,clearTimeout(){},navigator:{},localStorage:{getItem:()=>null},document:{querySelector:el,querySelectorAll:()=>[]},fetch:async()=>({ok:true,json:async()=>[]})};
  c.window=c;c.addEventListener=()=>{};vm.createContext(c);
  vm.runInContext(read('sighting-intelligence.js'),c);vm.runInContext(read('app.js'),c);
  return {c,el,run:s=>vm.runInContext(s,c),intel:c.FFIntel};
}
test('private/obscured normalization removes every alternate location payload and stays idempotent',()=>{
  const {intel}=app();
  for(const geoprivacy of ['private','obscured','OBSCURED']){
    const n=intel.normalize({species:'pawpaw',geoprivacy,lat:37.12345,lng:-77.12345,latitude:37.12345,longitude:-77.12345,geojson:{coordinates:[-77.12345,37.12345]},position:{lat:37.12345},raw:{private_latitude:37.12345},city:'hidden city',declaredPlace:'hidden address',caption:'37.12345',state:'Virginia',region:'Mid-Atlantic',tags:['37.12345']});
    assert.equal(n.lat,null);assert.equal(n.lng,null);assert.equal(n.geographicEvidence.coordinatesPublic,false);
    assert.ok(!JSON.stringify(n).includes('37.12345'));assert.ok(!JSON.stringify(n).includes('hidden address'));
    assert.deepEqual(JSON.parse(JSON.stringify(intel.normalize(n))),JSON.parse(JSON.stringify(n)));
    assert.equal(intel.cluster([n]).visible.length,0);
    assert.equal(intel.filterRegion([n],'VA').length,1);
  }
});
test('provider adapter sanitizes output and public getters cannot return or acquire hidden coordinates',async()=>{
  const {intel,c}=app();const raw={species:'mulberry',state:'Virginia',geoprivacy:'obscured',lat:33.123456,lng:-77.123456,geojson:{coordinates:[-77.123456,33.123456]}};
  const adapter=new intel.ProviderAdapter('test',async()=>[raw]);assert.equal((await adapter.search({}))[0].lat,null);
  c.ForageRadar.addSignals([raw]);assert.ok(!JSON.stringify(c.ForageRadar.signals).includes('33.123456'));
  const copy=c.ForageRadar.signals;copy[0].lat=33;assert.notEqual(c.ForageRadar.signals[0].lat,33);
});
test('aliases have exact boundaries, keep West Virginia separate, and accept case/spacing variants',()=>{
  const {intel}=app();const va={state:'Virginia',city:'Richmond'},wv={state:'West Virginia',city:'Richmond'},nv={state:'Nevada',city:'Richmond Heights'};
  for(const q of ['VA',' Virginia ','statewide'])assert.equal(intel.filterRegion([va,wv,nv],q).length,1);
  for(const q of ['Richmond','RVA','Richmond, VA'])assert.equal(intel.filterRegion([va,wv,nv],q).length,1);
  for(const q of ['Mid-Atlantic','mid atlantic',' MID-ATLANTIC '])assert.equal(intel.filterRegion([va,wv,nv],q).length,2);
  assert.equal(intel.filterRegion([{state:'VA',region:'Virginia Piedmont'}],'Piedmont').length,1);
  assert.equal(intel.filterRegion([va],'Rich').length,0);
  assert.equal(intel.filterRegion([va], '  ').length,1);
});
test('confidence thresholds and explanation use the same scores, including invalid dates',()=>{
  const {intel}=app();for(const [score,label] of [[.7,'strong'],[.699999,'moderate'],[.45,'moderate'],[.449999,'exploratory']])assert.equal(intel.confidenceLabel(score),label);
  const n=intel.normalize({sourceType:'inaturalist',identityConfidence:1,locationConfidence:1,corroboration:1,observedAt:'bad-date'});assert.ok(Number.isFinite(n.score));assert.equal(intel.explain(n).label,intel.confidenceLabel(n.score));
});
test('searchRegion updates guide/status and every map layer; unknown areas get no unsupported guide matches',async()=>{
  const {c,run,el}=app();
  await c.ForageRadar.searchRegion('VA');assert.equal(run('currentRegion.name'),'Virginia');assert.equal(el('#regionInput').value,'Virginia');
  await c.ForageRadar.searchRegion('Mid-Atlantic');assert.equal(run('currentRegion.name'),'Mid-Atlantic United States');
  await c.ForageRadar.searchRegion('RVA');assert.equal(run('currentRegion.name'),'Richmond, Virginia');assert.ok(el('#radarStatus').textContent.includes('2 intelligence signals'));
  await c.ForageRadar.searchRegion('Central Virginia');assert.equal(run('currentRegion.name'),'Richmond Metro, Virginia');
  run("currentRegion={name:'Seattle',boost:[],bounds:[47,48,-123,-122]};refreshRegion()");assert.equal(el('#resultCount').textContent,'0 finds');assert.equal(el('#radarStatus').textContent.split(' ')[0],'0');
  const plotted=[];c.L={divIcon:()=>({}),marker:point=>({addTo(){plotted.push(point);return this},bindPopup(){return this},remove(){}})};
  run('map={setView(){}}');run('renderMarkers();renderReportLayer();renderOccurrenceLayer()');assert.equal(plotted.length,0);
  await c.ForageRadar.searchRegion('VA');assert.ok(plotted.length>0);assert.ok(plotted.every(p=>Number.isFinite(p[0])&&Number.isFinite(p[1])));
  assert.ok(!plotted.some(p=>p[0]===37.5569||p[0]===37.5794||p[0]===37.56));
});
test('live occurrence adapters reject taxon/obscured/generalized privacy paths and preserve open photos',()=>{
  const {c}=app();const obs={id:1,geojson:{coordinates:[-77,37]},photos:[{url:'https://example.org/photo.jpg'}]};
  assert.ok(c.normalizeINatObservation(obs).imageUrl);
  assert.equal(c.normalizeINatObservation(obs,{id:'chicken'}).species,'chicken');
  for(const extra of [{geoprivacy:'obscured'},{taxon_geoprivacy:'obscured'},{obscured:true},{geoprivacy:'private'}])assert.equal(c.normalizeINatObservation({...obs,...extra}),null);
  const record={key:1,decimalLatitude:37,decimalLongitude:-77};assert.ok(c.normalizeGBIFOccurrence(record));
  for(const extra of [{informationWithheld:'sensitive'},{dataGeneralizations:'coordinates rounded'},{decimalLatitude:100}])assert.equal(c.normalizeGBIFOccurrence({...record,...extra}),null);
});
test('root, dist and docs contain identical deployable assets with no obsolete coordinate payloads',()=>{
  for(const file of ['app.js','index.html','radar-ui.js','sighting-intelligence.js','sw.js','styles.css','manifest.webmanifest','favicon.svg'])for(const folder of ['dist','docs'])assert.equal(read(file),read(`${folder}/${file}`),`${folder}/${file}`);
  assert.ok(!read('radar-ui.js').includes('lat:'));
  assert.ok(read('index.html').includes('app.js?v=11'));assert.ok(!read('index.html').includes('radar-ui.js'));
});
test('service worker retires old app caches, claims clients and never returns HTML for missing JS',async()=>{
  const handlers={},deleted=[],stored=new Map();let skipped=false,claimed=false;
  const cache={addAll:async entries=>entries.forEach(x=>stored.set(x,new Response(x))),match:async request=>stored.get(typeof request==='string'?request:request.url),put:async(request,response)=>stored.set(request.url,response)};
  const c={URL,Response,caches:{open:async()=>cache,keys:async()=>['forage-finder-v10','forage-finder-v11','other-app'],delete:async key=>deleted.push(key)},fetch:async()=>{throw Error('offline')}};
  c.self={location:{origin:'https://test.example'},addEventListener:(name,fn)=>handlers[name]=fn,skipWaiting:async()=>{skipped=true},clients:{claim:async()=>{claimed=true}}};vm.createContext(c);vm.runInContext(read('sw.js'),c);
  let task;handlers.install({waitUntil:p=>task=p});await task;assert.ok(skipped);assert.ok(stored.has('sighting-intelligence.js?v=11'));
  handlers.activate({waitUntil:p=>task=p});await task;assert.deepEqual(deleted,['forage-finder-v10']);assert.ok(claimed);
  let response;handlers.fetch({request:{url:'https://test.example/missing.js',method:'GET',mode:'cors'},respondWith:p=>response=p});assert.equal((await response).type,'error');
  handlers.fetch({request:{url:'https://test.example/',method:'GET',mode:'navigate'},respondWith:p=>response=p});assert.equal(await (await response).text(),'index.html');
  let handled=false;handlers.fetch({request:{url:'https://api.inaturalist.org/v1/observations',method:'GET'},respondWith:()=>handled=true});assert.equal(handled,false);
});

