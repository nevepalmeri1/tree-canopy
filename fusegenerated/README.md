# FuseGenerated — interactive MVP

Campus-native creator marketplace concept. **This is an interactive browser prototype, not a deployed production marketplace.**

## Features
- Responsive student creator experience with campaign discovery, category filters and text search.
- Campaign briefs, creator applications and application status tracking.
- Creator profile editor and portfolio project manager.
- Brand workspace: create/remove demo campaigns, review applications, approve or decline.
- All changes persist **only in this browser** using localStorage.

## Run
No install or build required: open `fusegenerated/index.html` in a modern browser. Alternatively serve the directory locally using `python3 -m http.server 8000` from the repository root and open `http://localhost:8000/fusegenerated/`.

## Important limitations
- Initial campaigns and fictional companies are **sample data**, not live offers; no real payments, shipping, or brand connections exist.
- Creator and brand views deliberately share one browser-local demo dataset so founders can test both sides.
- There is no authentication, backend database, real multi-user sync, creator verification, media upload, moderation, payment processing, email, or deployment.
- Browser storage may be cleared; don't use this prototype for real customers or sensitive data.
- Portfolio projects are self-entered and not verified. Only post work you own or can share.

## Next engineering milestones
1. Move to Next.js app routes, durable database, and verified separate creator/brand identities with role-based permissions.
2. Add onboarding and school verification, campaign eligibility, application workflows and notifications.
3. Add secure asset uploads, content review/approval, analytics and private portfolio URLs.
4. Add contracts, payout integration, safety/moderation/privacy requirements and production deployment.

## Existing project
This prototype lives under `fusegenerated/` to avoid overwriting the preexisting personal task manager in the repository root.
