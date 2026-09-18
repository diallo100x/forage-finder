/* Forage Finder sighting-intelligence core.
 * Provider adapters intentionally consume only permitted/public data supplied to them.
 * Never attempt to reconstruct coordinates that a source has obscured or marked private.
 */
(function (global) {
  const DAY = 86400000;
  const clamp = n => Math.max(0, Math.min(1, Number(n) || 0));
  const sourceWeights = {inaturalist:0.95,plantnet:0.90,community:0.72,social:0.52,habitat:0.42,historical:0.38,ai:0.60};
  function recencyWeight(date, halfLifeDays=45){const age=Math.max(0,Date.now()-new Date(date||0).getTime())/DAY;return Math.pow(0.5,age/halfLifeDays);}
  function score(signal){const source=sourceWeights[signal.sourceType]||0.4;const identity=clamp(signal.identityConfidence??0.5);const location=clamp(signal.locationConfidence??0.5);const corroboration=clamp(signal.corroboration??0.35);const recent=recencyWeight(signal.observedAt,signal.historical?365:45);return clamp(source*identity*location*(0.65+0.35*corroboration)*(0.55+0.45*recent));}
  function privacySafe(signal){if(signal.geoprivacy==='private')return{...signal,lat:null,lng:null,locationPrecision:'hidden'};if(signal.geoprivacy==='obscured')return{...signal,lat:Number.isFinite(signal.lat)?Number(signal.lat.toFixed(2)):null,lng:Number.isFinite(signal.lng)?Number(signal.lng.toFixed(2)):null,locationPrecision:'obscured'};return{...signal,locationPrecision:signal.locationPrecision||'source supplied'};}
  function geographicEvidence(signal){return{declaredPlace:signal.declaredPlace||null,placeMentions:[...(signal.placeMentions||[])],hashtags:[...(signal.tags||[])],captionMentions:[...(signal.captionMentions||[])],coordinatesPublic:signal.geoprivacy==='open'&&Number.isFinite(signal.lat)&&Number.isFinite(signal.lng)};}
  function normalize(raw){const safe=privacySafe(raw);return{...safe,score:score(safe),tags:[...(safe.tags||[])],geographicEvidence:geographicEvidence(safe),photoVerification:safe.photoVerification||'not supplied'};}
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
  global.FFIntel={score,normalize,cluster,seasonalLikelihood,geographicEvidence,ProviderAdapter,providerCatalog};
})(window);
