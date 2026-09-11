# ⚡ Slottr — Multi-Category Booking & Availability Marketplace

**Slottr** is a modern, full-featured web application and marketplace connecting customers with verified providers for on-demand bookings across venues, rental items, rides, short-stay properties, and skilled services. Built with React 19, TypeScript, Vite, and Tailwind CSS, Slottr features a high-precision availability engine, flexible guest and authenticated checkout flows, comprehensive provider operations dashboards, and secure role-based access.

---

## 🚀 Key Features

### 🛒 Customer Marketplace & Discovery
- **Multi-Category Exploration**: Browse and filter listings across categories:
  - 🏛️ **Venues & Event Spaces (`VENUE`)**: Halls, conference rooms, photo studios, and event grounds.
  - 📦 **Items & Equipment (`ITEMS`)**: Cameras, audiovisual equipment, tools, and specialty gear.
  - 🚗 **Rides & Transport (`RIDES`)**: Cars, chauffeurs, delivery vehicles, and transport services.
  - 🏡 **Properties & Spaces (`PROPERTY`)**: Short stays, creative spaces, and serviced apartments.
  - 🛠️ **Professional Services (`SERVICE`)**: Skilled artisans, event personnel, consultants, and contractors.
  - 🌐 **Others (`OTHERS`)**: Niche items and bespoke offerings.
- **Dynamic Search & Filtering**: Real-time filtering by category, location, price, and keywords.
- **Dynamic Availability Engine**: Instant live availability slot querying for specific calendar dates.
- **Transparent Pricing Calculation**: Dynamic pricing estimates calculated from duration and listing pricing units (`HOUR`, `DAY`, `WEEK`, `MONTH`).

### 📅 Booking & Checkout System
- **Flexible Guest & Authenticated Checkout**:
  - Authenticated users can reserve directly with prefilled profile details or book on behalf of others.
  - Guest checkout allows frictionless bookings with ISO country-validated contact verification.
- **Concurrency & Overlap Protection**: Transaction-locked booking validation on the backend preventing double bookings (`409 Conflict` mitigation).
- **Duration Constraint Enforcement**: Enforces `minDuration` and `maxDuration` policies defined by providers.

### 🏢 Provider Operations Suite
- **Provider Onboarding & Authentication**: Seamless signup combining profile creation, operating radius, and category selection.
- **Listing Lifecycle Management**: Create listings with multi-image upload (up to 6 photos), edit metadata, publish from draft status, or temporarily pause listings.
- **Granular Availability Engine**:
  - **Weekly Recurring Schedules**: Configure operating time windows for each day of the week (`monday` through `sunday`).
  - **Date/Time Blockouts**: Add maintenance, private events, or personal block ranges.
  - **Date-Specific Overrides / Exceptions**: Set custom operating hours for holidays or special calendar dates.
- **Booking Management**:
  - Real-time status tracking (`PENDING`, `CONFIRMED`, `COMPLETED`, `DECLINED`).
  - One-click Accept / Decline actions for pending requests.
  - Completion workflow that automatically triggers provider `Payout` tracking (`ELIGIBLE` status).
- **Provider Performance Dashboard**:
  - Available balance summary.
  - Next payout schedule indicator.
  - Today's confirmed schedule breakdown.
  - 7-day revenue analytics chart by weekday.

### 🛡️ Admin & Platform Security
- **Invite-Gated Admin Activation**: Secure token validation and activation workflow for platform administrators.
- **Approval-Gated Password Reset**: Multi-step super-admin approved recovery protocols.
- **Role-Based Routing**: Strict separation of concerns between `CUSTOMER`, `PROVIDER`, and `ADMIN` personas.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Framework & Core** | [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/), [Vite 8](https://vite.dev/) |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/), [Sonner Toasts](https://sonner.emilkowal.ski/) |
| **State & Data Fetching** | [TanStack React Query v5](https://tanstack.com/query/latest), [Axios](https://axios-http.com/) |
| **Analytics & Charts** | [Recharts](https://recharts.org/) |
| **Auth & Storage** | HttpOnly Cookie Refresh Tokens, JWT Access Tokens, [js-cookie](https://github.com/js-cookie/js-cookie) |
| **Backend API** | Node.js / Express, PostgreSQL (Neon), Sequelize, Cloudinary, Resend |

---

## 📂 Project Structure

```plaintext
Slottr/
├── public/                     # Static assets and favicons
├── src/
│   ├── assets/                 # SVGs, illustrations, and graphic assets
│   ├── components/             # Reusable global UI and layout components
│   │   ├── dashboard/          # Shared dashboard widgets
│   │   ├── layouts/            # Navbar, Footer, ProviderLayout
│   │   └── ui/                 # Buttons, Inputs, Modals, Badges
│   ├── data/                   # Mock / static constants and presets
│   ├── hooks/                  # Custom React Query & state hooks
│   │   ├── useAuth.ts          # Auth queries and mutations (login, signup, tokens)
│   │   ├── useBooking.ts       # Booking creation & invalidations
│   │   ├── useCustomer.ts      # Customer dashboard hooks
│   │   ├── useListing.ts       # Public & provider listing + availability hooks
│   │   └── useProvider.ts      # Provider dashboard, bookings & profile hooks
│   ├── lib/
│   │   └── api.ts              # Axios instance configured with baseURL & withCredentials
│   ├── pages/                  # Page route components
│   │   ├── admin/              # Admin login & activation pages
│   │   ├── auth/               # Customer & Provider login / signup / password recovery
│   │   ├── categories/         # Category catalog & exploration
│   │   ├── home/               # Marketplace landing page, search & categories
│   │   ├── how-it-works/       # Platform explanation & user guide
│   │   ├── listing/            # Listing details page, availability slots & booking modal
│   │   └── provider/           # Provider Dashboard, Listings, Availability, Bookings, Profile
│   ├── services/               # API service layers
│   │   ├── authService.ts      # Auth endpoints
│   │   ├── bookingService.ts   # Public booking creation (/api/booking)
│   │   ├── customerService.ts  # Customer profile & bookings
│   │   ├── listingService.ts   # Listing CRUD & availability schedule/blocks/exceptions
│   │   ├── providerBookingService.ts # Provider booking actions (/api/booking/my-bookings, respond, complete)
│   │   └── providerService.ts  # Provider home summary (/api/provider/home) & avatar upload
│   ├── types/                  # TypeScript interfaces and type definitions
│   │   ├── listing.ts          # Listing, Availability, Schedules, Slots
│   │   └── provider.ts         # Provider profile, dashboard & analytics types
│   ├── App.tsx                 # Route declarations & global providers
│   ├── index.css               # Global Tailwind CSS and design system variables
│   └── main.tsx                # React application root mount
├── .env                        # Environment configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite configuration
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher (or `pnpm` / `yarn`)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-org/slottr.git
cd slottr
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://shlottr.onrender.com/
```

> **Note**: In local development with a local backend server, you can point this to `http://localhost:5000/`.

### 3. Start Development Server

```bash
npm run dev
```

The application will start locally at `http://localhost:5173`.

### 4. Build for Production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 🔌 API & Integration Reference

### 1. Authentication & Security
- **Access Tokens**: Short-lived JWTs stored in memory / state and sent via `Authorization: Bearer <token>`.
- **Refresh Tokens**: Long-lived tokens stored in `httpOnly` secure cookies.
- **Credentials Requirement**: All requests include `withCredentials: true` via Axios to ensure secure cookie transport.

### 2. Booking Endpoints (`/api/booking`)
*Note: All booking endpoints use the singular `/api/booking` path.*

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/booking` | `POST` | Optional | Create a booking (Guest or Authenticated). |
| `/api/booking/my-bookings` | `GET` | Provider | Fetch bookings across provider's listings (`?status=PENDING \| CONFIRMED \| COMPLETED \| DECLINED`). |
| `/api/booking/:id/respond` | `POST` | Provider | Accept or decline a booking request (`{ "action": "accept" \| "decline" }`). |
| `/api/booking/:id/complete` | `POST` | Provider | Mark booking completed and initiate `Payout` tracking (`status: "ELIGIBLE"`). |

#### Booking Creation Payload Example:
```json
{
  "listingId": 42,
  "attendeeFirstName": "Ada",
  "attendeeLastName": "Lovelace",
  "attendeeEmail": "ada@example.com",
  "attendeeCountry": "NG",
  "attendeePhone": "+2348012345678",
  "bookingDate": "2026-09-15T09:00:00.000Z",
  "durationHours": 4
}
```

### 3. Availability Engine Endpoints
| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/listings/:id/availability?date=YYYY-MM-DD` | `GET` | Public | Returns bookable time slots for a listing on the given date (schedule minus blocks minus existing bookings). |
| `/api/provider/listings/:id/availability` | `GET` | Provider | Fetch full provider availability configuration (weekly schedule, blocks, exceptions). |
| `/api/provider/listings/:id/availability/schedule` | `PUT` | Provider | Set weekly recurring hours by day of the week. |
| `/api/provider/listings/:id/availability/blocks` | `POST` / `DELETE` | Provider | Add or remove date/time range blockouts. |
| `/api/provider/listings/:id/availability/exceptions` | `POST` / `DELETE` | Provider | Set date-specific schedule overrides. |

### 4. Provider Dashboard Summary
- `GET /api/provider/home` (Provider Auth)
```json
{
  "availableBalance": 150000,
  "nextPayoutDate": "2026-09-20T00:00:00.000Z",
  "todaysSchedule": [
    {
      "id": 101,
      "status": "CONFIRMED",
      "bookingDate": "2026-09-11T10:00:00.000Z",
      "durationHours": 3,
      "attendeeFirstName": "Jane",
      "attendeeLastName": "Doe"
    }
  ],
  "analytics": [
    { "day": "Sun", "total": 0 },
    { "day": "Mon", "total": 45000 },
    { "day": "Tue", "total": 60000 },
    { "day": "Wed", "total": 30000 },
    { "day": "Thu", "total": 15000 },
    { "day": "Fri", "total": 0 },
    { "day": "Sat", "total": 0 }
  ]
}
```

---

## 🎨 Design System & Styling Guidelines

- **Typography**: Clean, high-legibility sans-serif font stack.
- **Color Palette**:
  - Primary Slate / Navy: `#1E293B`, `#0F172A`
  - Deep Brand Blue: `#0048B5` / `#00388F`
  - Accent / Highlights: `#FF5A1F` / `#0284C7`
  - Status Indicators: Emerald (Confirmed/Completed), Amber (Pending), Red (Declined/Cancelled)
- **Component Design**: Flat, sharp 6-8px border radius, clear borders (`border-slate-200`), minimal noisy drop shadows, and responsive micro-interactions.

---

## 🧪 Quality & Verification

- **Type Safety**: Strictly typed TypeScript with zero tolerance for implicit `any` in core domains.
- **Build Verification**:
  ```bash
  npm run build
  ```
- **Code Linting**:
  ```bash
  npm run lint
  ```

---

## 📄 License

This project is proprietary and confidential. Unauthorized copying, distribution, or modification of this project without prior written consent from the author is strictly prohibited.
