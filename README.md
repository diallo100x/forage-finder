# Forage Finder

An installable, mobile-first forage intelligence PWA: identify likely species, discover regional edible plants/fruit/herbs/fungi, combine public sightings with seasonal evidence, and keep private field notes.

## Current MVP

- Regional guide with seasonal/habitat information
- Interactive OpenStreetMap/Leaflet map with approximate observations
- **Forage Radar** region search (city, named geographic region, state, multi-state region)
- Confidence-weighted sighting intelligence: source reliability × identity × location × recency × corroboration
- Provider-adapter catalog for biological ID, self-hosted vision, reverse search, and permitted public/social signals
- Device-local field notes and geolocation
- Installable PWA shell with offline guide access

## Sighting-intelligence pipeline

`image → OpenCV → YOLO regions → RAM/RAM++ tags → CLIP semantic candidates → biological ID adapters → permitted reverse/web discovery → geospatial + seasonal evidence → ranked sighting signals`

Potential sources include iNaturalist and Pl@ntNet; self-hosted OpenCV, YOLO, RAM/RAM++, and CLIP-family models; and authorized integrations with reverse-image/discovery providers. Public social signals can contribute captions, hashtags, timestamps, public place names and publicly exposed coordinates when provider terms/API access permit it. Examples include forage/species/regional-fruit hashtags. Social evidence is intentionally weighted below strong biological observations.

`dist/sighting-intelligence.js` contains the provider contract, scoring model, recency decay, clustering primitives, seasonal-likelihood helper and geoprivacy enforcement. `dist/radar-ui.js` connects the current PWA to the intelligence layer. Provider network calls are deliberately adapters rather than hard-coded scrapers.

## Location/privacy policy

Forage Finder must **never reconstruct an intentionally hidden location**. A source marked private loses coordinates in normalization; obscured coordinates retain their source precision and must not be sharpened by cross-referencing other clues. Sensitive species can therefore remain regional/approximate signals. Private user field notes stay local in this MVP.

## Data-source policy

Do not scrape Google Search/Images/Lens, Pinterest, TikTok, Meta services, or other providers in violation of their terms. Use official/permitted APIs, licensed datasets, user-initiated links, or self-hosted open models. Credentials belong server-side. Image identification is evidence, never an edibility verdict; fungi require expert verification.

ImageNet/CIFAR are useful benchmark/training datasets, not live identification providers. Scientific repositories such as IDR are specialized evidence sources rather than general forage classifiers.

## Next production adapters

1. iNaturalist observations/taxonomy with source geoprivacy preserved.
2. Pl@ntNet plant-identification suggestions.
3. Server-hosted vision pipeline (OpenCV/YOLO/RAM++/CLIP).
4. Weather/phenology inputs for seasonal prediction.
5. Permitted public social/web discovery adapters for hashtag, place-name and recency signals.
6. Heatmap rendering based on confidence-weighted *approximate* clusters, never private coordinates.

## Run locally

Serve `dist/` with any static web server. HTTPS is required for geolocation and install prompts outside localhost.

## Secrets

The browser MVP has no private API keys. Do not commit credentials. Future private keys belong in server-side environment variables; browser keys must be domain/API restricted. See `docs/AUTHENTICATION.md`.
