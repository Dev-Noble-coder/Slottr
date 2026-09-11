# Handover: Booking, Availability & Provider Dashboard (Final, Tested)

**Base URL:** `https://shlottr.onrender.com`
**Status:** Fully tested end-to-end as of handover.

**⚠️ Route correction:** booking endpoints live under `/api/booking` (singular), not `/api/bookings`. This differs from earlier drafts of this doc — use singular going forward.

---

## 1. Listing Categories

`type` on a listing is one of: `ITEMS`, `VENUE`, `RIDES`, `PROPERTY`, `SERVICE`, `OTHERS`.

The old `EVENT` type is deprecated — venues (halls, event spaces) now use `VENUE` with the full availability-engine flow described below, not a single fixed date.

---

## 2. Create Listing

`POST /api/listings/create`
**Auth:** Provider token. **Body type:** `form-data` (images uploaded in the same request).

| Field | Type | Required |
|---|---|---|
| `title` | Text | ✅ |
| `description` | Text | ✅ (min 10 chars) |
| `streetAddress` / `state` / `country` | Text | Optional |
| `price` | Text (numeric) | ✅ |
| `type` | Text | ✅ — one of the enum values above |
| `pricingUnit` | Text | Optional — `HOUR`, `DAY`, `WEEK`, `MONTH`. Drives how `price` is interpreted per booking. |
| `minDuration` / `maxDuration` | Text (numeric, hours) | Optional — enforced at booking time |
| `date` / `capacity` | Text | Only relevant for legacy single-date listings; leave blank for `VENUE` and similar |
| `images` | File | Up to 6 |

New listings start as `status: "draft"` — not publicly visible until published.

---

## 3. Listing Lifecycle (provider-only, ownership-checked)

| Endpoint | Method |
|---|---|
| `/api/provider/listings/:id` | PATCH — partial update |
| `/api/provider/listings/:id` | DELETE |
| `/api/provider/listings/:id/publish` | POST — requires title, description, price to be set |
| `/api/provider/listings/:id/pause` | POST |

---

## 4. Availability Configuration (provider-only)

- `GET /api/provider/listings/:id/availability` — view current schedule + exceptions
- `PUT /api/provider/listings/:id/availability/schedule` — set weekly recurring hours (per day-of-week array of `{start, end}` periods)
- `POST` / `DELETE /api/provider/listings/:id/availability/blocks[/:blockId]` — block out specific date/time ranges
- `POST` / `DELETE /api/provider/listings/:id/availability/exceptions[/:exceptionId]` — override normal schedule for a specific date

**Public:** `GET /api/listings/:id/availability?date=YYYY-MM-DD` — returns actual bookable slots for that date (schedule minus blocks minus existing bookings). No auth required. Frontend should always call this rather than calculating availability itself.

---

## 5. Booking

`POST /api/booking/`
**Auth:** Optional — omit entirely for guest checkout, include for a linked account.

Always required, regardless of auth: `listingId`, `attendeeFirstName`, `attendeeLastName`, `attendeeEmail`, `attendeeCountry` (ISO-2, e.g. `"NG"`), `attendeePhone`.

**Note:** attendee fields are not auto-filled from a logged-in user's account — a signed-in user can book on behalf of someone else, so the frontend should pre-fill these from the user's profile as a convenience, but always send them explicitly.

For non-`EVENT`-style listings (i.e. everything currently in use): also required —
- `bookingDate` — ISO datetime, the requested start
- `durationHours` — number of hours

**Backend behavior:**
- Rejects if `durationHours` is outside the listing's `minDuration`/`maxDuration`.
- Recalculates real availability (schedule + exceptions − blocks − existing bookings) inside a locked transaction before confirming — two simultaneous requests for the same slot cannot both succeed.
- `amount` is calculated from `price × durationHours`, rounded up per the listing's `pricingUnit` (e.g. a 6-hour booking at a per-day rate is charged for 1 full day).

**Responses:** `201` success · `400` validation/duration error · `404` listing not found · `409` slot unavailable or fully booked.

---

## 6. Provider Booking Management

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/booking/my-bookings?status=` | GET | Bookings across the provider's listings, optional status filter |
| `/api/booking/:id/respond` | POST | `{ "action": "accept" \| "decline" }` on a pending booking |
| `/api/booking/:id/complete` | POST | Marks a confirmed booking completed, auto-creates a `Payout` (status `ELIGIBLE`) |

---

## 7. Provider Home Dashboard

`GET /api/provider/home` — provider token.

```json
{
  "availableBalance": 150000,
  "nextPayoutDate": "2026-09-11T...",
  "todaysSchedule": [ /* confirmed bookings starting today */ ],
  "analytics": [ { "day": "Sun", "total": 0 }, ... ]
}
```

`availableBalance` sums all `ELIGIBLE` payouts for the provider. `analytics` is total booking value per weekday over the last 7 days.

---

## 8. Verified test chain (confirmed working)

Create venue listing → publish → set weekly schedule → guest books a valid slot → signed-in user attempts an overlapping slot (correctly rejected, `409`) → signed-in user books a non-overlapping slot → duration outside min/max correctly rejected (`400`) → provider views pending bookings → accepts one → marks it completed → `Payout` row created → `availableBalance` on provider home reflects it → `analytics` reflects booking value on the correct day.

---

*For admin/auth flows and the base tech stack, see the original full backend handover document.*
