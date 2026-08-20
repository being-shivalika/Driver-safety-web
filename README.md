# VigilDrive — SIH Fleet Safety Dashboard

This document provides a comprehensive technical overview of the VigilDrive Frontend Dashboard. It is designed to help you and your team quickly understand the architecture, code style, and file structure so you can seamlessly take over, modify, and extend the application.

---

## 1. Technology Stack

The project is built on a modern, fast, and lightweight frontend stack:

- **Core**: [React 18](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/) (chosen for lightning-fast HMR and optimized builds)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) (utility-first CSS for rapid, consistent UI development without custom CSS files)
- **Routing**: [React Router v6](https://reactrouter.com/) (handles all client-side page navigation and Protected Routes)
- **Icons**: [Lucide React](https://lucide.dev/) (clean, consistent SVG icons)
- **Charts**: [Recharts](https://recharts.org/) (composable, reliable charting library used for the Risk Trend line chart)
- **Maps**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/) (lightweight, highly customizable GIS mapping for the live fleet tracking)

---

## 2. Architectural Approach

The project uses a **Feature-Sliced / Domain-Driven Architecture**. 

### Why this approach?
Instead of grouping files strictly by their type (e.g., putting all components in one massive `components/` folder), the codebase is organized by **Feature** (e.g., `drivers`, `fleet`, `trips`). 
- **Scalability**: When you want to work on "Drivers", all the complex UI parts specifically related to drivers are in `src/features/drivers`.
- **Maintainability**: It prevents the `components` directory from becoming a dumping ground. The `components/ui` folder is strictly reserved for *dumb, reusable, global* components (like Buttons, Badges, Cards).
- **Separation of Concerns**: UI components do not know where data comes from. They only know how to render props. Data fetching is abstracted entirely into the `services/` layer.

---

## 3. Directory Structure & File Purposes

Here is a detailed breakdown of the `src/` directory:

### `src/app/`
Contains the core application wiring.
- `App.jsx`: The absolute root component. It wraps the app in global providers (like `AuthProvider` and `BrowserRouter`).
- `routes.jsx`: The central routing table. Maps URLs (like `/dashboard`) to Page components. It also enforces the `ProtectedRoute` wrapper for Role-Based Access Control (RBAC).

### `src/components/`
Contains shared, global components used across multiple pages and features.
- **`layout/`**
  - `DashboardLayout.jsx`: The main application shell wrapper. It manages the Flexbox layout holding the Sidebar, Topbar, and the main scrollable `<Outlet />`.
  - `Sidebar.jsx`: The left-side navigation menu. Maps over available routes and highlights the active one using React Router's `NavLink`.
  - `Topbar.jsx`: The top header. Displays the dynamic page title, connection status, and current logged-in user profile.
  - `ProtectedRoute.jsx`: An RBAC guard component. It checks if the current user has the required roles before rendering the child route.
- **`ui/`** (Reusable "Dumb" Components)
  - `AlertCard.jsx`: Standardized UI for displaying a critical/moderate alert event.
  - `ConnectionStatus.jsx`: A lightweight component showing "Live/Delayed" system sync status.
  - `RiskBadge.jsx`: Centralized logic for rendering the Green/Yellow/Red risk pills used everywhere.
  - `StatCard.jsx`: The KPI metric cards shown on the top of the Dashboard.

### `src/features/`
Complex components mapped directly to specific product domains.
- **`dashboard/`**: (Currently empty, as the dashboard relies heavily on aggregating other features, but reserved for future dashboard-specific widgets).
- **`drivers/`**
  - `DriverSafetyDrawer.jsx`: The slide-out side panel showing deep-dive driver telemetry, charts, and event timelines.
- **`fleet/`**
  - `FleetMap.jsx`: The React-Leaflet map wrapper. It maps GPS coordinates into custom visual markers indicating driver risk levels.
- **`trips/`**
  - `TripDetailsDrawer.jsx`: The slide-out side panel showing historical trip logs and routes.

### `src/pages/`
These are the "Smart" container components mapped directly to URLs. They fetch data via `apiClient`, hold page-level state (loading, filters, search), and pass that data down to UI and Feature components.
- `DashboardPage.jsx`: Renders the high-level operational overview.
- `LiveFleetPage.jsx`: Renders the full-screen interactive GIS map and filters.
- `DriversPage.jsx`: Renders the tabular list of drivers.
- `TripHistoryPage.jsx`: Renders the audit log of completed and ongoing trips.

### `src/services/`
- `apiClient.js`: The central data-fetching boundary. Currently, it returns Promises that resolve with `mockData`, simulating network delays. **When you connect the real Django backend, this is the ONLY file you need to rewrite.** Components will naturally react to the real data as long as the JSON shape matches.

### `src/context/`
- `AuthContext.jsx`: React Context providing global user state and the `hasPermission()` RBAC function. Currently mocked with a static "Fleet Manager" user.

### `src/utils/`
- `mockData.js`: A lightweight fixture file containing 5-8 records per category to populate the UI realistically during frontend development.

---

## 4. Code Style & Conventions

To keep the codebase clean as you take over, try to follow these established patterns:

1. **Functional Components & Hooks**: 
   - We strictly use React Functional Components (`const Component = () => {}`) and modern hooks (`useState`, `useEffect`). No Class components.
   
2. **Tailwind for Styling**:
   - Do not write custom CSS in `index.css` unless absolutely necessary (like Leaflet overrides).
   - Use Tailwind utility classes.
   - The primary theme colors (`fleet-navy`, `fleet-accent`, `risk-low`, `risk-moderate`, `risk-critical`) are strictly defined in `tailwind.config.js`. Use these custom classes (e.g., `text-risk-critical` instead of hardcoded `text-red-500`) to maintain design consistency.

3. **Data Fetching Pattern (The "Smart Page" vs "Dumb Component" Rule)**:
   - **Pages** (`src/pages/*`) are responsible for talking to the `apiClient`, managing `loading` state, and holding `search/filter` state.
   - **Components** (`src/components/*` and `src/features/*`) should almost never fetch their own data. They should receive data via React `props` from the Page. This makes components highly reusable and testable.

4. **Handling Nulls & Loading States**:
   - Always initialize arrays as `[]` instead of `null` (e.g., `const [drivers, setDrivers] = useState([])`) to prevent `.map()` crashes.
   - Always provide a `loading` state visualization (like the Tailwind `animate-pulse` skeletons used in the codebase) while waiting for `apiClient`.

5. **Risk Semantics**:
   - Across the app, Risk is categorized strictly as: `LOW` (Green), `MODERATE` (Yellow/Amber), and `CRITICAL` (Red). Ensure you pass these exact string values to the `RiskBadge` and map icons.

---

## 5. Current Backend Integration Status

### REAL API DATA:
- video analysis (`/api/analyze-video`)
- risk score
- risk level
- PERCLOS
- blink duration
- spoof detection
- environment warning

### TEMPORARY DEVELOPMENT DATA:
- driver registration
- driver identity
- truck
- vehicle
- GPS
- route
- trip history

### FUTURE BACKEND REQUIREMENTS:
- driver CRUD
- truck/vehicle data
- GPS/location
- trip data
- risk history
- fleet summary

---

## 6. How to Continue Development

Here is how you can perform common tasks as you take over:

### Connecting the Real Backend (Django)
1. Open `src/services/apiClient.js`.
2. Remove the mock delays and `mockData` imports.
3. Replace the function bodies with real `fetch()` or `axios.get()` calls.
   ```javascript
   export const apiClient = {
     async getDrivers() {
       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/drivers/`);
       if (!response.ok) throw new Error('Network error');
       return await response.json();
     }
     // ...
   }
   ```
4. Ensure your Django JSON responses either map exactly to the current UI models, or write a small adapter function inside `apiClient.js` to normalize the data before returning it to the UI components.

### Adding a New Page (e.g., Settings)
1. Create `src/pages/SettingsPage.jsx`.
2. Add the UI and logic inside.
3. Open `src/app/routes.jsx` and add `<Route path="settings" element={<SettingsPage />} />`.
4. Open `src/components/layout/Sidebar.jsx` and add `{ name: 'Settings', path: '/settings', icon: SettingsIcon }` to the `navItems` array so it appears in the menu.

### Working with the Authentication/RBAC
1. Open `src/context/AuthContext.jsx`.
2. When the user logs in via your actual backend, call `setUser(response.data)` with the token and user profile.
3. The `ProtectedRoute` component in `routes.jsx` will automatically handle hiding/showing routes based on the `user.role` you set in the context.

Happy coding! You have a robust, scalable foundation ready for real data.
