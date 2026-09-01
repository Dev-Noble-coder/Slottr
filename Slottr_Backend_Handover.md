## Slottr Backend — Handover Document

Prepared by: Benjamin Dunu (Backend/Software Engineering Intern) Date: August 2026

Live API base URL: https://shlottr.onrender.com Repo: github.com/Benzone200/Event

(backend in /backend )

## 1. Tech Stack

- Runtime: Node.js + Express

- Database: PostgreSQL, hosted on Neon (free tier, no expiry)

- ORM: Sequelize

- Auth: JWT access tokens + httpOnly cookie refresh tokens

- Validation: Zod

- Email: Resend (transactional email for invites, password resets)

- Image storage: Cloudinary (avatars, listing photos)

- Hosting: Render (free tier — spins down after 15 min idle, ~30-60s cold start on first request after)

## 2. Authentication & Authorization

## How it works

- Every user (customer, provider, admin, super admin) lives in one Users table, distinguished by a role column.

- Regular signup ( POST /api/users/signup ) always creates a CUSTOMER — there is no way to self-select a different role through this endpoint.

- Providers are created through a dedicated onboarding flow (see §4) — never through regular signup.

- Admins cannot self-register at all — they must be invited by a Super Admin (see §5).


- Super Admin is seeded once via a local script ( node src/scripts/seedSuperAdmin.js ) — not exposed through any API endpoint.

## Tokens

- Access token — short-lived JWT (15 min default), returned in the response body on login/signup, sent by the frontend as Authorization: Bearer <token> on every protected request.

- Refresh token — long-lived (7 days default), stored in an httpOnly cookie (JS cannot read it), used to silently get a new access token when the old one expires.

- Frontend requirement: every request must include credentials: "include" (fetch) or withCredentials: true (axios), or the refresh cookie will never be sent/received.

## Key endpoints

| Endpoint | Method | Notes |
| --- | --- | --- |
| /api/users/signup | POST | Creates a CUSTOMER |
| /api/users/login | POST | Returns access token + sets refresh cookie |
| /api/users/refresh | POST | Reads refresh cookie, returns new access token |
| /api/users/logout | POST | Revokes refresh token, clears cookie |
| /api/users/forgot- |   | Sends reset code (customer/provider) or notifies |
| password | POST | Super Admin (admin) |
| /api/users/reset- |   |   |
| password | POST | Completes the reset |

## Password policy

Centralized in src/utils/passwordValidator.js — used by signup, provider signup,

accept-invite, and reset-password so rules can never drift between flows. Enforces minimum length (configurable), uppercase/lowercase/number/special character, and rejects a list of common passwords.

## 3. Roles


| Role | Created via | Notes |
| --- | --- | --- |
| CUSTOMER | /api/users/signup | Default for everyone |
| PROVIDER | /api/provider/signup | Combined signup + onboarding (see §4) |
| ADMIN | Invite → accept-invite flow | Never self-registers |
| SUPER_ADMIN | Seed script only | One-time setup, not exposed via API |

A user cannot hold more than one role. A provider who wants to book something needs a separate customer account.

## 4. Provider Flow

## Onboarding (combined signup)

POST /api/provider/signup creates the User (role PROVIDER ) and the ProviderProfile

in a single transaction — matches the Figma “Your details → What do you want to list → Where do you operate” wizard as one API call.

Required fields: fullName , username , email , password , phone , categories (array — allowed values: ITEMS , VENUE , RIDES , PROPERTY , SERVICE , OTHERS ), city , state ,

serviceRadius .

Returns an access token immediately — no separate login needed after onboarding.

## Avatar upload

POST /api/provider/avatar — multipart/form-data , field name avatar . Uploads to

Cloudinary, saves the resulting URL to the provider’s profile.

## Provider dashboard endpoints

| Endpoint | Method | Purpose |
| --- | --- | --- |
| /api/listings/mine | GET | Provider’s own listings, optional ?search= |
| /api/bookings/mine | GET | Bookings across provider’s listings, optional |
|   |   | ?status= |
|   |   | Accept/decline a pending booking ( { |
| /api/bookings/:id/respond | POST |   |
|   |   | "action": "accept" | "decline" } ) |


| /api/bookings/:id/complete | POST | Mark a confirmed booking completed — |
| --- | --- | --- |
|   |   | creates a Payout record |
| /api/provider/home | GET | Dashboard summary: available balance, next payout date, today’s schedule, 7-day |
|   |   | analytics |

All provider endpoints are ownership-checked server-side — a provider can never act on another provider’s listing or booking, even by guessing an ID.

## 5. Admin Flow

## Invite → Activate

- 1. Super Admin: POST /api/admin/invite ( email , firstName , lastName , phone ) — generates a secure token, emails an activation link, invalidates any previous pending invite to the same email.

- 2. Frontend, before showing the password form: GET /api/admin/validate- invite/:token → { status: "valid" | "expired" | "used" | "invalid" } .

- 3. New admin: POST /api/admin/accept-invite ( token , password , confirmPassword ) — creates the User with role ADMIN .

Activation link format: {FRONTEND_URL}/accept-invitation/activate?token=xxxxxxxx —

confirm this matches your actual route.

## Admin password reset (approval-gated)

Unlike customer/provider resets, an admin’s reset request does not generate a token immediately — a Super Admin must approve it first (security requirement — a stolen/guessed admin email alone can’t trigger a reset link).

- 1. Admin: POST /api/users/forgot-password — creates a bare pending request, notifies Super Admin. No token exists yet.

- 2. Super Admin: POST /api/admin/approve-reset/:requestId — only now is the reset token generated (1hr expiry from this moment) and emailed to the admin.

- 3. Frontend, before showing the reset form: GET /api/admin/validate-reset/:requestId .

- 4. Admin: POST /api/users/reset-password — no code required for admins (the approval step already vetted them); customers/providers must supply the emailed code.


## 6. Listings & Bookings (current model — events/simple bookings)

- One Listing table covers all types ( type field: EVENT , ROOM , VEHICLE , ITEM , SERVICE , OTHERS ), with a JSON attributes field for category-specific data.

- capacity / bookedCount on the listing itself tracks availability — booking creation uses a database transaction with row-level locking to guarantee two concurrent requests can never overbook the same listing.

- Bookings support both authenticated users and guest checkout — customerId is nullable; attendee details ( attendeeFirstName , attendeeLastName , attendeeEmail , attendeeCountry , attendeePhone ) are always required regardless of login status, and can represent someone other than the person booking.

- Phone numbers are validated per-country using attendeeCountry (two-letter ISO code, e.g. NG ) paired with libphonenumber-js .

In progress / not finished: a newer specification was introduced for equipment/room/vehicle-type listings requiring recurring weekly availability, date blocks, and special-date overrides (a full availability calculation engine), separate from the simpler event-booking model above. This was scoped into models ( AvailabilitySchedule , AvailabilityException ) but implementation was not completed before handover. Events and simple listings are unaffected and fully working.

## 7. Payments

- Payment model exists, linked one-to-one with Booking .

- Squad payment integration was scoped but not implemented — sandbox credentials were never obtained. This is the largest outstanding gap.

- Payout model exists and is auto-created when a provider marks a booking completed , with status ELIGIBLE . No actual payout processing/transfer logic exists yet — tracking only.

## 8. Known Gaps / Not Built

- Squad payment integration (initiate payment, webhook handling)


- QR code generation/validation for event check-in

- Full availability engine for room/equipment/vehicle listings (§6)

- Deny endpoint + queue endpoint for admin reset requests

- Email delivery-failure tracking/recording

- Chat (Conversation/Message models were scoped, not built)

- In-app Notification system (model scoped, not built)

- Real-time features generally

## 9. Environment Variables (structure only — see .env.example / Render dashboard for real values)

```
DATABASE_URL
JWT_SECRET
ACCESS_TOKEN_EXPIRY
REFRESH_TOKEN_EXPIRY_DAYS
RESEND_API_KEY
FRONTEND_URL
CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET
INVITE_TOKEN_EXPIRY_HOURS
RESET_TOKEN_EXPIRY_HOURS
PASSWORD_MIN_LENGTH
NODE_ENV
PORT
```

## 10. API Documentation

Full endpoint reference with example requests/responses is maintained in Postman — published documentation link and exported collection should be shared separately alongside this document.

## 11. Deployment

- Backend: Render, auto-deploys on push to main . Free tier — cold starts after inactivity.


- Database: Neon, free tier, no expiry.

- Both services’ dashboards are accessible to [whoever inherits backend ownership] — credentials to be handed off separately, not in this document.

This document reflects the state of the backend as of the last day of the authoring intern’s tenure. For anything unclear, the Postman collection and inline code comments are the next best reference.
