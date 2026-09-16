# Forage Finder

An installable, mobile-first web app for discovering regional edible plants, fruiting trees, herbs, and fungi; reviewing responsible handling guidance; and keeping private field notes.

## Current MVP

- Richmond-region starter guide with seasonal and habitat information
- Interactive OpenStreetMap/Leaflet map with approximate observation areas
- Search and category filters
- Species detail and safety guidance
- Device-local field notes and geolocation
- Installable PWA shell with offline guide access

## Data-source policy

This project does **not** scrape Google Search, Google Images, Google Lens, or Google Maps. Production integrations should use authorized APIs and respect their storage, attribution, display, and licensing rules. Suggested adapters:

- Google Maps JavaScript API or Maps Embed API for a Google map deployment
- Google Places API for permitted place/context lookups
- A licensed plant-identification provider or a self-hosted model for image suggestions
- Curated sources such as USDA PLANTS, iNaturalist-compatible observations, university extension material, and local expert review

Identification output must remain a suggestion—not an edibility verdict. Fungi require especially prominent expert-verification warnings.

## Run locally

Serve `dist/` with any static web server. HTTPS is required for geolocation and install prompts outside localhost.

## Secrets

The MVP has no API keys and no user accounts. Do not commit credentials. Future private keys belong in server-side environment variables; browser map keys must be domain- and API-restricted. See `docs/AUTHENTICATION.md`.
