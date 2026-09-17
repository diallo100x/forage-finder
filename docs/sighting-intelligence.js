/* Forage Finder sighting-intelligence core.
 * Only permitted/public signals are consumed. Never reconstruct private or obscured coordinates.
 */
(function (global) {
  const DAY=86400000, clamp=n=>Math.max(0,Math.min(1,Number(n)||0));
  const sourceWeights={inaturalist:.95,plantnet:.90,community:.72,social:.52,habitat:.42,historical:.38,ai:.60,reverse:.48};
  const forageTerms=['forage','foraging','wildfood','wild food','fruit','berry','berries','mushroom','mushroomhunting','pawpaw','persimmon','mulberry','morel','nettle'];
  const regionAliases={'mid-atlantic':['virginia','maryland','delaware','pennsylvania','new jersey','washington dc','west virginia'],'virginia piedmont':['richmond','charlottesville','fredericksburg','piedmont'],'central virginia':['richmond','henrico','chesterfield','hanover','goochland']};
  function recencyWeight(date,halfLifeDays=45){const age=Math.max(0,Date.now()-new Date(date||0).getTime())/DAY;return Math.pow(.5,age/halfLifeDays)}
  function textEvidence(signal){const text=[signal.caption,...(signal.tags||[]),signal.placeName,signal.region].filter(Boolean).join(' ').toLowerCase();const hits=forageTerms.filter(t=>text.includes(t)).length;return clamp(hits/3)}
  function score(signal){const source=sourceWeights[signal.sourceType]||.4,identity=clamp(signal.identityConfidence??.5),location=clamp(signal.locationConfidence??.5),corroboration=clamp(signal.corroboration??.35),recent=recencyWeight(signal.observedAt,signal.historical?365:45),context=textEvidence(signal);return clamp(source*identity*location*(.62+.38*corroboration)*(.52+.48*recent)*(.82+.18*context))}
  function privacySafe(signal){if(signal.geoprivacy==='private')return {...signal,lat:null,lng:null,locationPrecision:'hidden'};if(signal.geoprivacy==='obscured')return {...signal,lat:null,lng:null,locationPrecision:'obscured'};return signal}
  function normalize(raw){const safe=privacySafe(raw);return {...safe,score:score(safe),contextEvidence:textEvidence(safe),tags:[...(safe.tags||[])]}}
  function cluster(signals,speciesId){const items=signals.filter(s=>!speciesId||s.species===speciesId).map(normalize),visible=items.filter(s=>Number.isFinite(s.lat)&&Number.isFinite(s.lng)),confidence=items.length?items.reduce((a,b)=>a+b.score,0)/items.length:0;return {signals:items,visible,confidence,count:items.length}}
  function seasonalLikelihood(species,month=new Date().getMonth()+1){const windows=species.seasonMonths||[];if(!windows.length)return .5;if(windows.includes(month))return .9;if(windows.some(m=>Math.abs(m-month)===1||Math.abs(m-month)===11))return .55;return .2}
  function regionMatches(signal,query){if(!query)return true;const q=query.trim().toLowerCase(),hay=[signal.city,signal.area,signal.state,signal.region,signal.placeName].filter(Boolean).join(' ').toLowerCase();if(hay.includes(q))return true;return (regionAliases[q]||[]).some(term=>hay.includes(term))}
  function filterRegion(signals,query){return signals.filter(s=>regionMatches(s,query)).map(normalize)}
  function confidenceLabel(value){return value>=.7?'strong':value>=.45?'moderate':'exploratory'}
  function explain(signal){const n=normalize(signal);return {score:n.score,label:confidenceLabel(n.score),source:n.sourceType,identity:n.identityConfidence??.5,location:n.locationConfidence??.5,recency:recencyWeight(n.observedAt,n.historical?365:45),context:n.contextEvidence,privacy:n.locationPrecision||n.geoprivacy||'open'}}
  class ProviderAdapter{constructor(name,fetcher){this.name=name;this.fetcher=fetcher}async search(query){return (await this.fetcher(query)).map(normalize)}}
  const providerCatalog=[{id:'inaturalist',role:'domain observation + taxonomy',access:'public/approved API'},{id:'plantnet',role:'plant identification',access:'approved API'},{id:'ram',role:'open-set image tagging',access:'self-hosted'},{id:'yolo',role:'object detection/cropping',access:'self-hosted'},{id:'clip',role:'semantic image/text matching',access:'self-hosted'},{id:'opencv',role:'image preprocessing',access:'self-hosted'},{id:'google-lens',role:'reverse/web discovery',access:'link/approved integration only'},{id:'tineye',role:'reverse-image provenance',access:'approved API'},{id:'pinterest-lens',role:'visual discovery',access:'link/approved integration only'},{id:'social-public',role:'public captions, hashtags, place/time signals',access:'official/permitted APIs only'}];
  global.FFIntel={score,normalize,cluster,seasonalLikelihood,regionMatches,filterRegion,confidenceLabel,explain,ProviderAdapter,providerCatalog};
})(window);
