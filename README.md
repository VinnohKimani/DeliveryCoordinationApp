# Reflex - Delivery Coordination App

Reflex is a lightweight, real-time delivery coordination application built for retailers, dispatchers, and riders. It replaces fragmented communication (like WhatsApp groups) with a unified, role-based dashboard utilizing Next.js, Tailwind CSS, and Supabase.

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
   - Go to the **SQL Editor** in your Supabase dashboard and paste the contents of `supabase/migrations/0000_initial.sql`. Run it to create the database tables, enums, triggers, and Row Level Security (RLS) policies.
   - Go to **Project Settings -> API** and copy your Project URL and anon public key.

4. **Environment Variables:**
   - Copy `.env.local.example` to `.env.local`.
   - Paste your Supabase credentials:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

## Features & Workflows

### 1. Retailers (The Senders)
Retailers log in to a dedicated dashboard to create new delivery requests. They enter the customer's details, drop-off address, and item description. Upon submission, the app generates a unique 6-character confirmation code (a digital handshake) and pushes the request to the central dispatch system.

### 2. Dispatchers (The Managers)
Dispatchers have a global "air-traffic control" overview of all active deliveries in the system. Their dashboard displays the status and destination of every package. When a new request comes in from a Retailer, the dispatcher assigns an available rider from the fleet to handle it.

### 3. Riders (The Fleet)
Riders have a streamlined, mobile-friendly dashboard showing only their currently assigned routes. A rider's workflow is:
* **Pick Up:** They see the assignment, head to the retailer, and click "Confirm Pickup" once they have the package.
* **Deliver:** Upon arriving at the customer's address, the rider must verify the hand-off. They can either scan the customer's QR code or manually enter the 6-character confirmation code provided by the retailer using the built-in fallback system.
* **Complete:** Once the code is verified, the delivery is permanently marked as "Delivered" and cleared from their active queue!

## Database Schema & Security

- `users`: Extends Supabase Auth users. Stores the `name`, `phone`, and `role` (retailer, dispatcher, rider). A trigger automatically inserts a row here when a user signs up.
- `deliveries`: Stores delivery requests. 
  - `retailer_id` links to the user who requested it.
  - `assigned_rider_id` links to the rider (if assigned).
  - `status` tracks the lifecycle: `Requested` -> `Assigned` -> `Picked Up` -> `Delivered`.
  - `confirmation_code` is a 6-character unique string generated on creation.

### Row Level Security (RLS)
Security is handled at the database level to ensure data privacy:
- **Retailers** can only CRUD their own delivery requests.
- **Dispatchers** can read and update all delivery requests (to assign riders).
- **Riders** can only read and update deliveries specifically assigned to them.
*(Note: To prevent infinite recursion, policies rely on reading the user's role directly from the secure JWT token rather than querying the `users` table).*

## Real-time Capabilities
The application uses **Supabase Realtime** to instantly update dashboards when database rows change. We use the Next.js App Router combined with `router.refresh()` in a small `RealtimeSubscriber` client component, providing event-driven, live updates across all open browsers with no manual polling required.
