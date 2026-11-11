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
