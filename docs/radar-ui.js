(function(){
  const signals=[
    {species:'pawpaw',sourceType:'inaturalist',identityConfidence:.96,locationConfidence:.92,corroboration:.8,observedAt:'2026-09-10',lat:37.54,lng:-77.43,tags:['pawpaw','foraging'],geoprivacy:'open'},
    {species:'mulberry',sourceType:'social',identityConfidence:.72,locationConfidence:.45,corroboration:.62,observedAt:'2026-09-12',lat:37.56,lng:-77.47,tags:['foraging','mulberry','regional-fruit'],geoprivacy:'obscured'},
    {species:'persimmon',sourceType:'historical',identityConfidence:.88,locationConfidence:.65,corroboration:.7,observedAt:'2025-10-02',lat:37.51,lng:-77.41,tags:['persimmon'],geoprivacy:'open'},
    {species:'chicken',sourceType:'community',identityConfidence:.68,locationConfidence:.2,corroboration:.4,observedAt:'2026-09-15',lat:null,lng:null,tags:['mushroomhunting'],geoprivacy:'private'}
  ];
  const intel=window.FFIntel;
  const region=document.querySelector('#regionInput'), status=document.querySelector('#radarStatus');
  function summarize(){
    const c=intel.cluster(signals); const strong=c.signals.filter(s=>s.score>=.5).length;
    status.textContent=`${c.count} intelligence signals · ${strong} stronger leads · private/obscured locations protected`;
  }
  region?.addEventListener('change',()=>{
    const q=region.value.trim(); if(!q)return;
    document.querySelector('#regionLabel').textContent=q.toUpperCase();
    status.textContent=`Regional scope: ${q} · combining observations, seasonal evidence and permitted public signals`;
  });
  document.querySelector('#photoInput')?.addEventListener('change',e=>{
    if(!e.target.files?.length)return;
    setTimeout(()=>{status.textContent='Identification pipeline ready: OpenCV → YOLO → RAM++ → CLIP → biological/reverse-search adapters';},20);
  });
  window.ForageRadar={signals,providers:intel.providerCatalog,addSignals(items){signals.push(...items.map(intel.normalize));summarize();}};
  summarize();
})();
