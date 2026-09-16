# Authentication, credentials, and request flow

## Current state

The MVP is a static, local-first PWA. It has no account authentication, backend session, OAuth flow, database credential, API token, or committed secret.

### Components

1. `dist/index.html` provides the application shell.
2. `dist/app.js` reads the curated species catalog, requests browser geolocation only after a user action, renders map observations, and stores field notes in browser `localStorage`.
3. Leaflet runs in the browser. OpenStreetMap raster tiles are requested directly from the configured public tile endpoint and require attribution.
4. `dist/sw.js` caches same-origin application files. It intentionally does not treat third-party responses as private application data.

### Request flow

1. The browser requests the static app shell.
2. The service worker serves cached same-origin assets when available.
3. Leaflet requests public map tiles; no application credential is attached.
4. When the user taps **My location**, the browser presents its own permission prompt. Coordinates remain in browser memory unless the user saves a field note.
5. A saved field note is written to that device's `localStorage`. It is not uploaded.

## Planned authenticated architecture

If accounts, shared observations, plant identification, or Google services are added, place a same-origin server/API between the browser and credentialed providers.

```text
Browser PWA → same-origin API → authorized plant/maps provider
             ↕
        user database
```

- Use an established identity provider with Authorization Code + PKCE.
- Keep the session in a `Secure`, `HttpOnly`, `SameSite=Lax` cookie. Do not store login tokens in `localStorage`.
- Validate the session and authorization on every write; ownership checks must not rely on a user ID sent by the browser.
- Protect state-changing cookie-authenticated routes against CSRF and restrict CORS to the production origin.
- Rate-limit photo identification and geocoding routes.

## Credential and token handling

| Credential | Location | Browser-visible? | Controls |
|---|---|---:|---|
| Google browser map key | Runtime configuration | Yes | Restrict to exact production origins and only required Maps APIs |
| Plant-identification key | Server environment secret | No | Proxy requests, rate-limit, rotate, and monitor usage |
| Database credential | Server binding/secret | No | Least privilege; never serialize into responses or logs |
| User session | Secure HttpOnly cookie | Cookie only | Short lifetime, rotation, logout invalidation, CSRF protection |
| Photo upload grant | Short-lived signed URL | Temporarily | Content-type/size limits and rapid expiration |

Never place unrestricted keys in JavaScript, the PWA manifest, source control, GitHub Actions logs, query strings, analytics events, or client error reports. Commit only an `.env.example` containing variable names—not values.

## Privacy and location safety

Exact locations can expose private property, vulnerable species, and a user's routines. Shared observations should default to obscured coordinates; sensitive species should use a wider randomized area. Users must explicitly choose to publish a location, and deletion/export controls should be provided with accounts.
