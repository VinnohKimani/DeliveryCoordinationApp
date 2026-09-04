# Reflex - Delivery Coordination App

Reflex is a lightweight, real-time delivery coordination application built for Kenyan retailers, dispatchers, and riders. It replaces fragmented WhatsApp groups with a unified, role-based dashboard using Next.js and Supabase.

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone git@github.com:VinnohKimani/DeliveryCoordinationApp.git
   cd DeliveryCoordinationApp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Supabase Setup:**
   - Create a new project on [Supabase](https://supabase.com).
   - Go to the **SQL Editor** in your Supabase dashboard and paste the contents of `supabase/migrations/0000_initial.sql`. Run it to create tables, enums, triggers, and RLS policies.
   - Go to **Project Settings -> API** and copy your Project URL and anon public key.

4. **Environment Variables:**
   - Copy `.env.local.example` to `.env.local`.
   - Paste your Supabase URL and anon key:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

## Database Schema Explanation

- `users`: Extends Supabase Auth users. Stores the `name`, `phone`, and `role` (retailer, dispatcher, rider). A trigger automatically inserts a row here when a user signs up.
- `deliveries`: Stores delivery requests. 
  - `retailer_id` links to the user who requested it.
  - `assigned_rider_id` links to the rider (if assigned).
  - `status` tracks the lifecycle: `Requested` -> `Assigned` -> `Picked Up` -> `Delivered`.
  - `confirmation_code` is a 6-character unique string generated on creation.

### Row Level Security (RLS)
- **Retailers** can only CRUD their own delivery requests.
- **Dispatchers** can read and update all delivery requests (to assign riders).
- **Riders** can only read and update deliveries specifically assigned to them.

## Real-time Capabilities
The application uses Supabase Realtime to instantly update dashboards when database rows change. We use Next.js App Router combined with `router.refresh()` in a small `RealtimeSubscriber` client component, providing event-driven, live updates with no polling required.

## Known Trade-offs

1. **Optimistic UI Updates:** Real-time sync relies on `router.refresh()`, which causes a quick background fetch to the server. While seamless, it does not do true local "optimistic" state updates (like Redux or React Query would). This was chosen for speed of development and to leverage Next.js Server Components deeply.
2. **QR Scanner Reliability:** Browser-based QR scanning (`@yudiel/react-qr-scanner`) is highly dependent on device camera quality and lighting. Native apps usually provide a faster scanning experience.
3. **No specialized Dispatcher matching:** Dispatchers manually select riders from a dropdown. In a scaled product, this would likely be automated based on rider proximity and load.
4. **Basic Routing:** A single shared `middleware.ts` handles role-based redirects. It currently falls back gracefully, but in a massive app, role structures might require more complex routing groups (e.g., `(retailer)`, `(rider)`).
