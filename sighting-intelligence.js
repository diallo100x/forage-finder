/* Forage Finder sighting-intelligence core.
 * Provider adapters intentionally consume only permitted/public data supplied to them.
 * Never attempt to reconstruct coordinates that a source has obscured or marked private.
 */
(function (global) {
  const DAY = 86400000;
  const clamp = n => Math.max(0, Math.min(1, Number(n) || 0));
  const sourceWeights = {inaturalist:0.95,plantnet:0.90,community:0.72,social:0.52,habitat:0.42,historical:0.38,ai:0.60,reverse:0.48};
  function recencyWeight(date, halfLifeDays=45){const time=new Date(date||0).getTime(); if(!Number.isFinite(time))return 0;const age=Math.max(0,Date.now()-time)/DAY;return Math.pow(0.5,age/halfLifeDays);}
  function textEvidence(signal){const text=[signal.caption,...(signal.tags||[]),signal.placeName,signal.region].filter(Boolean).join(' ').toLowerCase();return clamp(['forage','foraging','wild food','fruit','berry','berries','mushroom','pawpaw','persimmon','mulberry','morel','nettle'].filter(term=>text.includes(term)).length/3);}
  function score(signal){const source=sourceWeights[signal.sourceType]||0.4;const identity=clamp(signal.identityConfidence??0.5);const location=clamp(signal.locationConfidence??0.5);const corroboration=clamp(signal.corroboration??0.35);const recent=recencyWeight(signal.observedAt,signal.historical?365:45);return clamp(source*identity*location*(0.65+0.35*corroboration)*(0.55+0.45*recent)*(0.82+0.18*textEvidence(signal)));}
  // Allowlist location-bearing records: never retain raw provider payloads/alternate coordinates.
  function privacySafe(signal){
    const keys=['id','label','species','regions','sourceType','provider','identityConfidence','locationConfidence','corroboration','observedAt','historical','tags','demo','photoVerification','city','area','state','region','declaredPlace','placeName','placeMentions','captionMentions','caption','lat','lng','geoprivacy','locationPrecision'];
    const safe=Object.fromEntries(keys.filter(key=>key in signal).map(key=>[key,signal[key]]));
    const privacy=String(signal.geoprivacy||signal.taxon_geoprivacy||'open').toLowerCase();
    const protectedLocation=Boolean(signal.obscured||signal.private)||privacy!=='open'||['hidden','obscured','private'].includes(signal.locationPrecision);
    safe.geoprivacy=protectedLocation?(privacy==='private'?'private':'obscured'):'open';
    if(protectedLocation){
      safe.lat=null; safe.lng=null; safe.locationPrecision=privacy==='private'?'hidden':'obscured';
      // Keep explicitly supplied broad region/state only; captions/place clues must not reconstruct location.
      for(const key of ['city','area','declaredPlace','placeName','placeMentions','captionMentions','caption'])delete safe[key];
      safe.tags=[];
    }else{
      safe.lat=Number.isFinite(signal.lat)&&Math.abs(signal.lat)<=90?signal.lat:null;
      safe.lng=Number.isFinite(signal.lng)&&Math.abs(signal.lng)<=180?signal.lng:null;
      safe.locationPrecision=signal.locationPrecision||'source supplied';
    }
    for(const key of Object.keys(safe)){if(Array.isArray(safe[key]))safe[key]=safe[key].filter(value=>typeof value==='string');else if(safe[key]&&typeof safe[key]==='object')delete safe[key];}
    return safe;
  }
  function geographicEvidence(signal){signal=privacySafe(signal);return{declaredPlace:signal.declaredPlace||null,placeMentions:[...(signal.placeMentions||[])],hashtags:[...(signal.tags||[])],captionMentions:[...(signal.captionMentions||[])],coordinatesPublic:signal.geoprivacy==='open'&&Number.isFinite(signal.lat)&&Number.isFinite(signal.lng)};}
  function normalize(raw){const safe=privacySafe(raw);return{...safe,score:score(safe),contextEvidence:textEvidence(safe),tags:[...(safe.tags||[])],geographicEvidence:geographicEvidence(safe),photoVerification:safe.photoVerification||'not supplied'};}
  function cluster(signals,speciesId){const items=signals.filter(s=>!speciesId||s.species===speciesId).map(normalize);const visible=items.filter(s=>Number.isFinite(s.lat)&&Number.isFinite(s.lng));const confidence=items.length?items.reduce((a,b)=>a+b.score,0)/items.length:0;return{signals:items,visible,confidence,count:items.length};}
  function seasonalLikelihood(species,month=new Date().getMonth()+1){const windows=species.seasonMonths||[];if(!windows.length)return 0.5;if(windows.includes(month))return 0.9;if(windows.some(m=>Math.abs(m-month)===1||Math.abs(m-month)===11))return 0.55;return 0.2;}
  class ProviderAdapter{constructor(name,fetcher){this.name=name;this.fetcher=fetcher;}async search(query){return(await this.fetcher(query)).map(normalize);}}
  const providerCatalog=[
    {id:'inaturalist',role:'domain observation + taxonomy',access:'public/approved API'},
    {id:'plantnet',role:'plant identification',access:'approved API'},
    {id:'ram',role:'open-set image tagging',access:'self-hosted'},
    {id:'yolo',role:'object detection/cropping',access:'self-hosted'},
    {id:'clip',role:'semantic image/text matching',access:'self-hosted'},
    {id:'opencv',role:'image preprocessing',access:'self-hosted'},
    {id:'google-lens',role:'reverse/web discovery',access:'link/approved integration only'},
    {id:'tineye',role:'reverse-image provenance',access:'approved API'},
    {id:'pinterest-lens',role:'visual discovery',access:'link/approved integration only'},
    {id:'meta-public',role:'public post/photo signals from permitted Meta APIs',access:'official API and authorized public data only'},
    {id:'tiktok-public',role:'public caption, hashtag, place/time and photo/video signals',access:'official Research/Display APIs where authorized'},
    {id:'pinterest-public',role:'public pin text, place context and image corroboration',access:'official API or user-submitted public links'},
    {id:'apple-vision',role:'on-device image analysis',access:'user-selected images only'},
    {id:'social-public',role:'public captions, hashtags, place/time signals',access:'official/permitted APIs only'}
  ];
  const regionNames={
    'richmond virginia':['richmond','richmond va','rva','richmond virginia'],
    'richmond metro virginia':['richmond metro','richmond metro virginia','central virginia'],
    'virginia piedmont':['piedmont','virginia piedmont'],
    'virginia coastal plain':['coastal plain','tidewater','virginia coastal plain'],
    'shenandoah valley virginia':['shenandoah','shenandoah valley','shenandoah valley virginia'],
    'blue ridge virginia':['blue ridge','blue ridge virginia'],
    'virginia':['va','virginia','statewide','statewide virginia'],
    'mid atlantic united states':['mid atlantic','mid atlantic united states'],
    'near me':['near me','my location']
  };
  const clean=value=>String(value||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  function canonicalRegion(query){const q=clean(query);return Object.keys(regionNames).find(key=>regionNames[key].includes(q))||q;}
  const stateNames={va:'virginia',wv:'west virginia',md:'maryland',dc:'washington dc',de:'delaware',pa:'pennsylvania',nj:'new jersey'};
  const canonicalState=value=>stateNames[clean(value)]||clean(value);
  function regionMatches(raw,query){
    const signal=privacySafe(raw),q=canonicalRegion(query);if(!q)return true;
    const state=canonicalState(signal.state),regions=[signal.region,...(signal.regions||[])].map(canonicalRegion);
    const places=[signal.city,signal.area,signal.declaredPlace,signal.placeName].map(canonicalRegion);
    if(q==='virginia')return state==='virginia'||regions.some(region=>region==='virginia'||['richmond metro virginia','virginia piedmont','virginia coastal plain','shenandoah valley virginia','blue ridge virginia'].includes(region));
    if(q==='mid atlantic united states')return ['virginia','west virginia','maryland','washington dc','delaware','pennsylvania','new jersey'].includes(state)||regions.includes(q);
    if(q==='richmond metro virginia')return regions.includes(q)||(state==='virginia'&&['richmond virginia','henrico','chesterfield','hanover','goochland'].some(place=>places.includes(place)));
    if(q==='richmond virginia')return state==='virginia'&&places.includes(q);
    return regions.includes(q)||places.includes(q)||state===q;
  }
  function filterRegion(signals,query){return signals.map(normalize).filter(signal=>regionMatches(signal,query));}
  function confidenceLabel(value){return value>=.70?'strong':value>=.45?'moderate':'exploratory';}
  function explain(signal){const n=normalize(signal);return {score:n.score,label:confidenceLabel(n.score),source:n.sourceType,identity:clamp(n.identityConfidence??.5),location:clamp(n.locationConfidence??.5),recency:recencyWeight(n.observedAt,n.historical?365:45),context:n.contextEvidence,privacy:n.locationPrecision,geographicEvidence:n.geographicEvidence};}
  global.FFIntel={score,normalize,privacySafe,cluster,seasonalLikelihood,geographicEvidence,canonicalRegion,regionMatches,filterRegion,confidenceLabel,explain,ProviderAdapter,providerCatalog};
})(window);
