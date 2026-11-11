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

## Explore, For You and Friends visual polish

- Logo's neon-green asterisk is positioned **to the right** of the white F inside the midnight icon.
- Explore uses exclusively midnight/navy and neon-lime accents to match the mark (not the old purple highlights). The featured offer is itself a keyboard-accessible, tappable card; oversized full-width **See the offer** button removed.
- The Providence map is **shown by default**, below the featured card and above **Worth checking out**. Map pins use neon-lime.
- Dinner on Admiral Street is second among the six highlighted offers.
- The Nitro Bar offer uses a real iced-coffee photo sourced from a third-party business review photo; Poppy Table (fictional) uses a real bakery pastry-display photo sourced from Pexels. Remote image failures try backup photos before falling back to an illustration.
- For You is now a **vertical, playable video feed**, with video controls, save and like demo interactions, and descriptive captions. Video clips are *sample stock footage from Mixkit*, **not actual creator videos or videos of the named restaurants**. If video hosting is unavailable, the visual poster remains and an original sample-footage link is provided. Do not attribute sample stock footage to real merchants or creators.
- Friends shows example **restaurants friends visited** and content notes first, then searchable creators and add/remove friend controls. All friend visits are illustrative demo data, not actual activity.
- Existing business and creator offer claims, QR redemption, video submission and analytics remain browser-local demo workflows.

Video source pages:
- https://mixkit.co/free-stock-video/cup-being-filled-with-coffee-in-a-coffee-machine-41865/
- https://mixkit.co/free-stock-video/mug-with-sparkling-cappuccino-5072/
- https://mixkit.co/free-stock-video/pouring-coffee-grounds-into-a-chemex-filter-100343/

Image reference:
- Poppy bakery-display photo: https://www.pexels.com/photo/a-variety-of-breads-and-pastries-on-a-glass-display-counter-7405059/
- Nitro Bar coffee photo: https://www.corner.inc/place/8720

Confirm commercial rights and asset reliability before launching with actual businesses. Real named merchants have **not** agreed to join FuseGenerated.

## TikTok-only For You / My Town / Friends and restaurant brief update

Explore now opens to **New opportunities today**. This means newly featured **fictional demo opportunities**, not a verified live publication feed. The featured offer is a Nitro coffee opportunity with a real venue-related coffee photo sourced from The Food Lens; the card's actual restaurant brief is visible directly below the photo. The large payment/reward button is removed from Explore, and the original Providence opportunity map is retained. Primary brand colors are midnight navy, electric lime, and neutral white, with no purple dot accents.

### Adding real TikTok links in the demo

Open **For You** and choose **For You**, **My Town**, or **Friends**. Tap **Add video** and supply:
- A full public TikTok URL containing a video ID (e.g. `https://www.tiktok.com/@creator/video/1234567890123456789`)
- A short caption/title, creator handle, and the place shown
- The collection: **For You** for any topic, **My Town** for Providence, or **Friends** for videos found through friends

The app embeds the official TikTok Player by video ID, with the original source link and creator attribution. Posts are displayed in their original TikTok frame; local metadata and links persist in this demo browser only. Public availability and embedding permissions are controlled by TikTok and the video's owner. Short share URLs without a `/video/<ID>` segment are not currently resolved; open the TikTok link in a browser and paste its full URL. Friends profiles and categorization are not automatically verified.

The For You collection is seeded with a single **official TikTok developer documentation example** as proof of the player interface, clearly labeled as a sample, not a Providence creator video.

### Detailed restaurant briefs

Business → Create now requests:
- The objective of the offer, compensation as a covered visit, and 3 creator spots
- An explicit hook/opening line
- Must-show shots (e.g. store exterior, menu and price, dish closeups)
- Required factual talking points (hours, distance, price)
- Creator freedom/constraints, platform format, and posting timing

Created campaigns store these details and show them in the creator's offer view; the Explore brief preview shows the agreed creative brief. Restaurants may request accurate, original content, not require a positive review. Creators must disclose the provided meal.

### Sources and limitations

- Nitro Bar coffee photo: The Food Lens / Brian Samuels Photography, https://www.thefoodlens.com/boston/explore/escapes/providence-ri/the-nitro-bar/. Third-party rights not cleared; replace with approved partner imagery before public commercial use.
- Official TikTok Player: https://developers.tiktok.com/docs/en/embed-player

The app is a **browser-local hackathon demo** and is not a real-time feed of venue-posted campaigns or an automatic TikTok recommendation algorithm. No actual restaurant deals, TikTok user uploads, verified friend graph, or live analytics are implied.

## Founder-provided TikToks and simplified creator navigation (November 11)

The creator navigation has four tabs: **Explore, Friends, My Content, Profile**. There is no longer a standalone For You destination.

### Five provided video references

These links are included verbatim in the **Video inspiration** gallery on Explore:
- https://www.tiktok.com/t/ZTPMetHJu/
- https://www.tiktok.com/t/ZTPMenDwG/
- https://www.tiktok.com/t/ZPLtgVqdC/
- https://www.tiktok.com/t/ZPLtgfd2T/
- https://www.tiktok.com/t/ZTPMeMJ7D/

The demo attempts to retrieve the official TikTok embed video ID and metadata through a narrowly allowlisted server-side TikTok oEmbed endpoint, with a TikTok-only short-link redirect fallback. When a video cannot be embedded or metadata cannot be retrieved, the card links to the original TikTok; it does not fabricate a creator name, restaurant, or playable preview. These examples are **not assumed to show any particular restaurant**.

Each inspiration example has a restaurant selector. The demo user can associate the video with an appropriate restaurant after watching it; the selected examples then appear inside that restaurant's offer brief. Assignments persist in this browser's localStorage. Additional short TikTok links can be added through **Add another TikTok**.

**Friends** continues to show user-provided TikTok links categorized as friends' posts, along with discoverable demo creator profiles; the app does not infer that the five reference videos were posted by friends. These references, creator connections, and restaurant assignments are demo data, not authenticated multi-user content.

The app does not download or re-host TikTok videos. All playback uses the original TikTok player, where available, and rights/availability remain controlled by TikTok and the creator. This feature is not a TikTok recommendation algorithm and does not import your TikTok account without approval.

TikTok reference: https://developers.tiktok.com/docs/en/embed-videos

## Remove Juniper from Explore and feature the five provided TikToks

- The first Explore opportunity remains the fictional Nitro Bar demo; Juniper & Rye is excluded from Explore cards and map pins, from business selection defaults, from inspiration restaurant selectors, and from sample Friends activity. The old Juniper seed data remains internally for historical demo compatibility, but is not offered on Explore.
- Explore places **Your TikTok videos** directly after the first restaurant opportunity and before the nearby map, rather than hiding it at the bottom of the opportunities feed.
- All five original TikTok share links are displayed as clearly numbered video cards. When the optional server resolution succeeds, a TikTok-hosted embedded player appears. Otherwise, each card prominently offers **Watch actual TikTok**, opening the original user-provided video in TikTok. The app does not claim to have downloaded, re-hosted, or verified the videos.
- TikTok originals are not assigned to a restaurant unless manually selected after viewing. The restaurant matching control excludes the removed Juniper demo merchant.
- Versioned client assets and local demo state reset ensure the new Explore surface is loaded after this deployment.

## Espresso filming plan, Friends videos, and server fix

- **My Content → My Visits:** The Espresso by Strive filming plan includes a shot checklist and a video URL field. It is an independent visit, not an approved or sponsored free meal. The creator's pasted TikTok or Instagram Reel appears in **My Posts** without fabricated stats.
- Remove the seeded Juniper & Rye creator claims and mock videos. Data storage changes to v10, with migration of non-seeded, non-Juniper claims and videos from v9.
- **Explore:** Retains map and opportunity cards but no imported TikTok gallery.
- **Friends:** Shows five founder-provided TikTok examples. They are *not* falsely attributed to real Fuse friends. Existing friend-search and activity sections remain available.
- **Covers:** Use TikTok oEmbed or alternate public metadata. If the video ID resolves without a cover image, use the original TikTok player as fallback; if not, offer the direct original link. No unrelated fake cover imagery.
- **Backend:** Root repository JavaScript uses ESM, while Fuse TikTok functions are written in CommonJS. A new Fuse-specific package.json explicitly sets type to commonjs to avoid Vercel runtime module errors. Resolver also uses module.exports consistently with other TikTok routes.
- This remains a local-browser prototype, without real shared accounts, verified TikTok followers or secure real-world meal redemption.
