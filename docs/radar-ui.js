(function(){
  const signals=[
    {species:'pawpaw',sourceType:'inaturalist',identityConfidence:.96,locationConfidence:.92,corroboration:.8,observedAt:'2026-09-10',lat:37.54,lng:-77.43,tags:['pawpaw','foraging'],caption:'Pawpaw patch near creek bottom',city:'Richmond',state:'Virginia',region:'Central Virginia',placeName:'James River area',geoprivacy:'open'},
    {species:'mulberry',sourceType:'social',identityConfidence:.72,locationConfidence:.45,corroboration:.62,observedAt:'2026-09-12',lat:37.56,lng:-77.47,tags:['foraging','mulberry','regional-fruit'],caption:'Wild fruit find',city:'Richmond',state:'Virginia',region:'Virginia Piedmont',placeName:'Richmond area',geoprivacy:'obscured'},
    {species:'persimmon',sourceType:'historical',identityConfidence:.88,locationConfidence:.65,corroboration:.7,observedAt:'2025-10-02',lat:37.51,lng:-77.41,tags:['persimmon'],city:'Richmond',state:'Virginia',region:'Mid-Atlantic',geoprivacy:'open',historical:true},
    {species:'chicken',sourceType:'community',identityConfidence:.68,locationConfidence:.2,corroboration:.4,observedAt:'2026-09-15',lat:null,lng:null,tags:['mushroomhunting'],caption:'Chicken of the woods sighting',state:'Virginia',region:'Mid-Atlantic',geoprivacy:'private'}
  ];
  const intel=window.FFIntel,region=document.querySelector('#regionInput'),status=document.querySelector('#radarStatus');let scoped=signals;
  function summarize(){const c=intel.cluster(scoped),strong=c.signals.filter(s=>s.score>=.7).length,moderate=c.signals.filter(s=>s.score>=.45&&s.score<.7).length;status.textContent=`${c.count} signals · ${strong} strong · ${moderate} moderate · hidden locations protected`;window.dispatchEvent(new CustomEvent('forage:signals',{detail:c}))}
  function applyRegion(){const q=region?.value.trim()||'';scoped=intel.filterRegion(signals,q);document.querySelector('#regionLabel').textContent=q?q.toUpperCase():'FORAGE RADAR';summarize()}
  region?.addEventListener('input',applyRegion);
  document.querySelector('#photoInput')?.addEventListener('change',e=>{if(!e.target.files?.length)return;status.textContent='Photo pipeline: preprocess → detect/crop → tag/semantic match → biological IDs → permitted reverse-search evidence'});
  window.ForageRadar={signals,providers:intel.providerCatalog,searchRegion(q){if(region)region.value=q;applyRegion();return scoped},addSignals(items){signals.push(...items.map(intel.normalize));applyRegion()},explainSpecies(id){return intel.cluster(scoped,id).signals.map(intel.explain)}};summarize();
})();
