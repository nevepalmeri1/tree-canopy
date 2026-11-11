# FuseGenerated — Providence creator pilot (hackathon demo)

A mobile-first, clickable prototype connecting Providence restaurants and student creators who publish TikToks and Instagram Reels. **This is a local browser demo; no real restaurant partnerships, free meals, payments or content data are connected.**

## New concept

- Opens directly to **Creator → Explore**, showing a featured covered-lunch opportunity and a large “Worth checking out” feed.
- Dark navy + fuchsia + purple identity; FuseGenerated F-and-asterisk mark.
- Creator / Business toggle.
- Every current opportunity has **three creator spots**. There are no paid-post opportunities: the only compensation is a promised covered meal, snack, drink or visit.
- Includes example offers named for **The Nitro Bar (134 Ives St), Espresso by Strive (365 Admiral St), and Strive Kitchen + Bar (383 Admiral St)** along with fictional merchants. Named places are real, but **all campaigns are hypothetical and these businesses have not agreed to participate**.
- Optional **Nearby map** using OpenStreetMap / Leaflet. The feed works even without map tiles or an internet connection. Fictional businesses have illustrative approximate map positions.
- Creator referral tab with a shareable demo code, copy button, simulated signup and milestones. Real signup/verification and rewards are not implemented.
- The previous “new to local content” profile card is removed; approved creator demo still starts ready to claim.
- Owner onboarding says **$0 FuseGenerated platform fee for the pilot**. The restaurant covers only the food/drinks it offers to up to three creators. Creator deliverables are separate original posts with disclosure, no guaranteed visits or search ranking.

## Test the full flow

1. Creator → Explore → featured lunch → Claim. Check that three spots become two. Preview a friend invite and accept as Leo. There is one spot left.
2. Creator → Profile → switch demo creator to Maya or Leo. My visits supports separate TikTok or Instagram links. My content groups posts and views by restaurant.
3. Business → Overview shows claimed creators, campaign results, videos, and restaurant-reported customer visits; Creator videos shows seeded two-campaign history.
4. Business → Create offer creates a covered-meal offer with three spots. The owner can review applicant video previews.
5. Creator → Refer shows a copyable referral code and simulated signup.
6. Reset restores the seeded data for the next hackathon interview.

## Local run

Open `index.html` or from the repo root run `python3 -m http.server 8000` and visit `http://localhost:8000/fusegenerated/`. Vercel deploys this subdirectory.

## Limitations

Browser localStorage only. No cross-device data sharing, backend database, real student or restaurant authentication, genuine referral redemption, QR check-in, real free-food entitlement, real customer tracking, creator media uploads, actual playback for seeded videos, or TikTok/Instagram API statistics. New post URLs show **Stats pending**. Historical video stats, merchant-reported visits, and creator follow-through figures are demo data.

This product is **independent of Providence College**.

## November 2026 demo refinements

- The six highlighted opportunities are Juniper & Rye lunch, The Nitro Bar coffee, Espresso by Strive coffee, Strive Kitchen + Bar dinner, Poppy Table pastry, and Harbor Bowl Co. dinner.
- Exactly three of the six featured offers (Juniper lunch, Nitro coffee, and Strive dinner) are marked **You + a friend**.
- On duo offers, select **Tag a Fuse friend & claim 2 spots**, enter the demo Fuse handle `@leo.pvd`, and reserve two of three spots. From Profile switch to Leo, then accept the invite in My visits. Both creators owe and submit separate videos.
- The default creator is **Neve Palmeri**, Fuse `@nevepalmeri`, TikTok `@nevedog101`.
- Real venue-specific food photography is referenced from Visit Rhode Island (The Nitro Bar), joe coffee (Espresso by Strive), and Buns & Bites (Strive Kitchen + Bar). Those third-party images are referenced remotely, not owned or licensed by FuseGenerated. Confirm image-use permissions before commercial launch. Fictional merchants use illustrative imagery or a graphical fallback.

## TikTok connection: developer setup required

The TikTok OAuth and public-video import endpoints are implemented under `api/tiktok/`. **They are not enabled until you register/obtain approval for a TikTok developer app and set private server environment variables.** This is a real authorization integration, not a mocked "Connected" badge.

Configure these variables privately in the Vercel project settings (do not place keys in GitHub or in chat):

- `TIKTOK_CLIENT_KEY` — developer app client key
- `TIKTOK_CLIENT_SECRET` — developer app client secret
- `TIKTOK_SESSION_SECRET` — unique cryptographically random secret at least 32 characters long
- `TIKTOK_REDIRECT_URI` — `https://fusegenerated.vercel.app/api/tiktok/callback` (register the *exact same* URL in TikTok Login Kit)

Request/obtain approval for TikTok Login Kit and Display API scopes `user.info.basic` and `video.list`. The OAuth start endpoint checks configuration and authenticates through TikTok; the callback validates state and exchanges a code on the server; tokens are stored in an encrypted, HttpOnly, secure short-lived browser cookie, never browser JavaScript. The API reads recent public TikToks and creator metrics. Users can select **Use for a visit** to attach a video to a restaurant campaign, so it appears in both creator and business views. A video not explicitly linked to a restaurant stays only in the connected creator's recent uploads.

Token refresh and durable multi-account identity are not implemented yet. Do not deploy as a production marketplace without backend accounts, persistent secure token storage, disconnection/revocation, data-retention policies, media-rights validation, security review, and user testing. Without credentials, the app says "Integration setup required" and the manual post URL flow still works.

TikTok developer documentation:
- https://developers.tiktok.com/docs/en/login-kit-web
- https://developers.tiktok.com/docs/en/display-api-get-started

## Electric lime / seven-day QR pilot update

The creator navigation is **Explore, For You, Friends, My Content, Profile**. My Content has **My Visits** and **My Posts** sections. For You shows curated fictional inspiration examples, not live TikTok videos. Friends allows searching simulated Providence creator profiles and adding/removing connections in local browser storage.

Brand palette: neon lime (`#C7FB43`), midnight indigo (`#202459`), pale neutral backgrounds. FuseGenerated retains the F/asterisk brand mark.

### Claimed visit: seven-day redemption

- Every new claim now receives a claim timestamp and expiry exactly seven days later, with a unique **demo redemption code**.
- The creator's My Content → My Visits screen shows a countdown and a **Show my meal QR code** button.
- The QR holds `FUSE-DEMO|<code>`. The demo uses an external QR rendering script (with a printed-code fallback).
- Business → Overview → select restaurant → Scan with camera (when supported) or type code → **Verify & redeem**. The browser validates business, one-time use, accepted invite, and expiry. Successful local redemption marks the visit as checked in for that creator, and their video submission is then unlocked.
- After a QR is redeemed once, the same code is rejected on subsequent attempts. Expired, unaccepted, or mismatched-restaurant codes are rejected.
- Each member of a duo has their own code; their videos and check-ins are tracked individually.
- This is intentionally **demo-only**. Browser localStorage is not shared between different users or devices; the restaurant and creator must use the same demo browser to see each other's claims. Codes are not secure tickets and cannot actually authorize a complimentary meal. A production system needs authenticated accounts, server-side code issuance and redemption, database transactions, merchant authorization and fraud prevention.

The existing TikTok developer approval/credential requirements still apply. Until connected, the creator can paste a published post URL manually after the demo QR check-in.
