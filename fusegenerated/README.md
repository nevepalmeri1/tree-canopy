# FuseGenerated — Providence local creator pilot

An interactive, mobile-first hackathon prototype for a **local student-to-restaurant content exchange**. Not affiliated with Providence College. Merchants, campaigns and seeded analytics are fictional demo data.

## The demo flow

1. Open Explore on the student side (Maya Chen, approved creator). Tap “Lunch near PC for under $15,” inspect exact meal + post terms, and claim a spot.
2. Preview a friend invitation, accept it as Leo Park, and see 0 spots remaining. Each claim belongs to a separate student. Or continue solo.
3. In My visits, mark a visit complete and paste an actual TikTok or Instagram link. Open My content to find the video under Juniper & Rye with **Stats pending**.
4. In Profile, switch demo student identities (Maya / Leo), so the two students can submit individually. My visits displays “1 of 2 posts submitted” when only one has posted.
5. Flip the Student / Business switch. The restaurant sees new claims, follow-through, video URLs grouped by campaign, and a separate “Customer visits reported by you” +1 counter.
6. Review sample creators and their two illustrative local post thumbnails, approve a new applicant, and create a short offer in the business flow.
7. Return to My content to explore **two seeded past Juniper & Rye campaigns**, creator-only performance totals, and post-level views, likes, comments, saves, and briefs.
8. Use Reset to restore all sample data.

## Run

Open `index.html` directly in a browser, or from the repo root run `python3 -m http.server 8000` and visit `http://localhost:8000/fusegenerated/`.

Vercel uses the repository's `fusegenerated` root directory and publishes it as a static site when main is updated.

## Product intent

- One creator = one claim + one post link. Friend posts never count toward the original creator's totals.
- No follower minimum. Applicants may submit two local posts or try a starter brief.
- Individual videos appear on student portfolio and restaurant owner views in the same browser session.
- No guaranteed customers, discoverability, or rankings; agreed video deliverables only.
- Pilot platform fee is shown as $0.

## Scope and limitations

This is **not a live marketplace**. It has no real user authentication, server database, cross-device sync, invitations sent by a backend, real booking/fulfillment verification, payment processing, uploaded media storage, real video embeds, or automatic social analytics. Demo submissions and counters persist in localStorage in the browser, and reset on command. An invitation preview is simulated using Leo's account. Submitted URLs are validated as TikTok/Instagram links and opened on the respective platform; seeded links are platform placeholders and seeded thumbnails are illustrative photos. Analytics marked “demo data” are fictional; newly submitted videos display “Stats pending.” Do not treat local demo data as real results.

## Suggested next step

Build a durable multi-user version with a database, genuine invite tokens, school-agnostic onboarding, role-based authorization and owner-managed business accounts, visit confirmation, social link validation, secure analytics connections, content rights and disclosure handling, and payout or reimbursement support.
