# Hospital System

This repository implements a **hospital appointment management system** with separate projects for:

- **backend**: Node.js/Express API server
- **frontend**: Public-facing client for patients
- **admin**: Admin/doctor portal for managing doctors, services, and appointments

Each part is configured independently but integrates with the shared API.

---

## 📁 Repository Structure

```
admin/           # Admin portal (doctors/service management)
backend/         # REST API server
frontend/        # Patient-facing website
```

Each folder is a standalone JavaScript/React project (Vite-powered) except the backend which is Express with MongoDB.

---

## 🚀 Getting Started

### Prerequisites

- Node.js v16+ (recommend using nvm)
- npm or yarn
- MongoDB instance (local or cloud, e.g. Atlas)
- Cloudinary account (image uploads)

### Common Steps

1. Clone the repo:
   ```bash
   git clone <repo-url> hospita-system
   cd hospita-system
   ```

2. Set environment variables in each subproject (`.env` files) using provided examples.

3. Install dependencies and start each app separately.

---

## 🧩 Backend (API)

### Location
`backend/`

### Tech Stack
- Node.js
- Express
- MongoDB (via Mongoose)
- Multer for file uploads
- Cloudinary for image storage
- JSON Web Tokens for doctor authentication

### Setup

```bash
cd backend
npm install
```

Create a `.env` file with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hospital
JWT_SECRET=someverysecretkey
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Run the server:
```bash
npm start
# or for live reload
npm run dev
```

### Key Modules

- `models/` – Mongoose schemas for the four main entities:
  - **Doctor**: name, email, password (hashed), photo URL, specialization, experience, ratings, services offered.
  - **Service**: title, description, price, image, linked doctor, category.
  - **Appointment**: patient name/email/phone, doctor reference, service reference (optional), date/time, status (pending, confirmed, completed, cancelled).
  - **ServiceAppointment**: similar to Appointment but created when patient books a service rather than an individual doctor slot.

- `controllers/` – Request handlers implementing business logic and database access via the models. Examples:
  - `doctorController.signup` hashes passwords, validates input, creates a new doctor record.
  - `appointmentController.createAppointment` ensures the doctor is available and saves the booking.

- `routes/` – Express routers grouped by resource (doctors, services, appointments, serviceAppointments). Each route file imports its controller and attaches middleware (e.g. `doctorAuth`) where necessary.

- `middlewares/` –
  - **doctorAuth.js**: verifies JWT tokens sent in the `Authorization` header, attaches `req.doctor` to the request, and denies access if invalid.
  - **multer.js**: configures `multer` storage and file filters to accept image uploads (used when doctors add profile pictures or service images).

- `utils/cloudinary.js` – wraps the Cloudinary SDK to upload images; controllers call this helper to store photos and save the returned URL in the database.

### API Endpoints
A more detailed overview of the routes provided by the backend. `/api` prefix is assumed when the server is mounted.

#### Doctor Routes
| Method | Path                     | Auth | Description                     |
|--------|--------------------------|------|---------------------------------|
| GET    | `/doctors`               | No   | Retrieve a paginated list of doctors (supports query filters). |
| GET    | `/doctors/:id`           | No   | Get details of a single doctor. |
| POST   | `/doctors/signup`        | No   | Create a new doctor account. Requires name, email, password, specialization. Optionally accepts photo upload. |
| POST   | `/doctors/login`         | No   | Authenticate a doctor. Returns JWT token. |
| PUT    | `/doctors/:id`           | Yes  | Update doctor profile (protected). |

#### Service Routes
| Method | Path                        | Auth | Description                              |
|--------|-----------------------------|------|------------------------------------------|
| GET    | `/services`                 | No   | List all services across doctors.        |
| GET    | `/services/:id`             | No   | Get details for a specific service.      |
| POST   | `/services`                 | Yes  | Add a new service (doctor only). Accepts title, description, price, image. |
| PUT    | `/services/:id`             | Yes  | Update an existing service.              |
| DELETE | `/services/:id`             | Yes  | Remove a service.                        |

#### Appointment Routes
| Method | Path                          | Auth | Description                             |
|--------|-------------------------------|------|-----------------------------------------|
| GET    | `/appointments`               | No   | List patient appointments. Can query by doctor or patient email. |
| POST   | `/appointments`               | No   | Book an appointment. Requires patient info, doctor id, date/time. Optional service id. |
| PUT    | `/appointments/:id/status`    | Yes  | Doctor updates the status (confirmed, completed, cancelled). |

#### ServiceAppointment Routes
| Method | Path                          | Auth | Description                             |
|--------|-------------------------------|------|-----------------------------------------|
| GET    | `/serviceAppointments`        | No   | Retrieve bookings tied to services.     |
| POST   | `/serviceAppointments`        | No   | Book an appointment to a particular service. |

> 📌 **Error handling:** All controllers send back consistent JSON responses with status codes; validation errors return `400`, authentication failures `401`, and `500` for unexpected server errors.

> ⚠️ Routes requiring authentication are protected by the `doctorAuth` middleware.

---

## 🖥️ Frontend (Patient Site)

### Location
`frontend/`

### Tech Stack
- React (via Vite)
- React Router DOM
- Axios for API calls
- Context or state management (if used)

### Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the project root containing environment variables. At minimum the API base URL is required:
```
VITE_API_URL=http://localhost:5000
```

Other optional variables may include:
```
VITE_PAYMENT_KEY=your-public-key   # if integrating a payment gateway
VITE_GOOGLE_MAPS_KEY=…            # if location features are added
```

The admin portal uses the same pattern; create a separate `.env` file inside `admin/` with its own `VITE_API_URL` (points to the same backend) and any additional keys for doctor authentication or uploads.

Start the development server:
```bash
npm run dev
```

### Features & Key Points
The system is designed modularly to serve both patients and medical staff. Below is a comprehensive breakdown of capabilities across the three sub-projects.

#### 1. Patient-Facing Frontend
- **Doctor Directory**: Searchable list of doctors with filters (specialization, rating, location). Incorporates infinite scroll or pagination for scalability.
- **Service Catalog**: Separate listing of medical services/tests; each entry includes description, price, and link to the offering doctor(s).
- **Detailed Profiles**: Clicking a doctor or service shows a profile page featuring biographies, qualifications, reviews, photo, and availability calendar.
- **Booking Workflow**:
  - Select preferred date/time using a calendar component.
  - Optional payment integration placeholder (`VerfiyPaymentPage.jsx` / `VerifyServicePaymentPage.jsx`) to simulate gateway flow.
  - Real-time availability check against backend before finalizing.
  - Confirmation screen summarizing appointment details.
- **Authentication (future)**: Framework in place for patient login to manage bookings, view history, and cancel or reschedule appointments.
- **Responsive Design**: Uses CSS in `index.css` and `dummyStyles.js` to adapt to mobile, tablet, and desktop screens; hamburger menu for navigation on smaller devices.
- **Form Validation**: Inputs are validated in React components before submission; displays inline error messages. Uses simple regex/email checks.
- **Notifications**: Toast or alert banners signal success/failure for actions like booking submission, login, or form errors.
- **Third-Party Integrations**: Placeholder fields for payment keys, Google Maps API, or telemedicine links.

#### 2. Doctor/Admin Portal
- **Secure Access**: Doctor login generates JWT stored client-side (localStorage) for authenticated routes.
- **Profile Management**: Doctors can update info, upload profile pictures via Multer/Cloudinary.
- **Service Management**:
  - Add, edit, or remove services with images and descriptions.
  - Each service is linked to the doctor's account.
- **Appointment Dashboard**:
  - List of booked appointments (standard & service-specific) with status indicators (pending, confirmed, completed, cancelled).
  - Filters by date, status, or patient email.
  - Actions to change appointment status which trigger backend updates and optional notification hooks.
- **Analytics Placeholder**: Dashboard pages have area for future charts/graphs (number of bookings per week, revenue by service).
- **Responsive Layout**: Similar mobile-friendly design as frontend but focused on desktop use by practitioners.

#### 3. Backend API
- **Token-Based Authentication**: Uses JWT with `doctorAuth` middleware to guard protected routes; tokens expire depending on config.
- **Data Validation**: Controllers use manual checks or `express-validator` to ensure payload correctness before writing to DB.
- **Error Handling Layer**: Centralized error response format `{ success: false, message: 'Error text', error: {...} }`.
- **File Uploads & Cloudinary**: `multer` handles temporary file storage; `utils/cloudinary.js` uploads and returns URL. Doctor photos and service images are stored externally.
- **Appointment Logic**:
  - Ensures no double-booking by checking existing records for same doctor/time slot.
  - Sends back clear status codes; 409 for conflicts.
- **Scalability Considerations**: Database indexes on frequently queried fields like doctor specialization, service name, appointment date.
- **Modular Router Structure**: Each resource has its own router file for clear separation of concerns.

#### 4. Database Structure
- **Doctors Collection**:
  ```js
  {
    name: String,
    email: {type: String, unique: true},
    password: String, // hashed with bcrypt
    photo: String,    // Cloudinary URL
    specialization: String,
    experience: Number,
    ratings: Number,
    services: [ObjectId] // references Service documents
  }
  ```
- **Services Collection**:
  ```js
  {
    title: String,
    description: String,
    price: Number,
    image: String,
    doctor: {type: ObjectId, ref: 'Doctor'},
    category: String
  }
  ```
- **Appointments Collection**:
  ```js
  {
    patientName: String,
    patientEmail: String,
    patientPhone: String,
    doctor: {type: ObjectId, ref: 'Doctor'},
    service: {type: ObjectId, ref: 'Service', required: false},
    datetime: Date,
    status: {type: String, enum: ['pending','confirmed','completed','cancelled'], default: 'pending'}
  }
  ```

### Quick Feature Summary
- **Patient UI**: searchable doctors/services, detail pages, booking calendar, form validation, notifications, mobile responsive.
- **Admin UI**: secure doctor login, profile and service CRUD, appointment dashboard with status controls.
- **Backend**: JWT authentication, modular controllers, validation, file uploads to Cloudinary, double-booking protection.
- **Database**: clear schema for doctors, services, and appointments with references.
- **Deployment**: independent builds, env vars for API, MongoDB, JWT, Cloudinary and optional keys.
- **Development**: ESLint for linting, placeholders for tests, Git branching workflow.
- **Extras**: payment gateway hooks, analytics placeholders, extensible design for future features.


#### 5. Deployment & Environment
- Each subproject builds independently with `npm run build`.
- Backend can serve frontend/admin `build` outputs via `express.static` or deploy them separately on platforms like Vercel/Netlify.
- `.env` patterns include `PORT`, `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_*`, and `VITE_API_URL` for clients.

#### 6. Development Utilities
- **Linting**: ESLint configured in each client (see `eslint.config.js`) ensures code quality.
- **Git Hooks**: (if added) could run linting/tests before commits.
- **Testing Stubs**: No tests presently, but suggestion to add Jest (backend) and React Testing Library (frontend).

#### 7. Future Directions
- Implement patient login and profile management.
- Add email/SMS notifications using services like SendGrid/Twilio.
- Expand payment features to include refunds, invoices, and multi-currency support.
- Introduce role-based access control (e.g., admins vs doctors).
- Multi-language/localization support for patient interface.
- Offline-first capabilities or PWA behavior for mobile.

> 💡 Every component, controller, and route is meant to be easily extended; the codebase follows standard conventions so new developers can jump in quickly.

#### UI Behavior
- Forms validate input on the client side before submitting to the API. Errors are shown inline.
- When a patient books an appointment, the frontend first checks availability via an API call and then confirms the booking.
- Success and error toasts notify users of action results.
- Placeholder pages `VerfiyPaymentPage.jsx` and `VerifyServicePaymentPage.jsx` demonstrate hooks for payment gateway verification; integration with Stripe/Razorpay/etc. would occur after booking.

### Pages & Components
Refer to `src/pages` and `src/components` for JSX files such as `Home.jsx`, `Doctors.jsx`, `Login.jsx`, etc.

---

## 🔧 Admin Portal (Doctors & Services)

### Location
`admin/`

### Purpose
Provide an interface for doctors or administrators to manage their profile, services, and view appointments.

### Setup is similar to frontend above. Use its own `.env` with the same `VITE_API_URL`.

### Key Files
- `src/components` has pages like `DashboardPage.jsx`, `AddService.jsx`, etc.
- Likely uses authenticated doctor context.

---

## 📦 Common Utilities

- `assets/dummyStyles.js` in frontends add placeholder styling utilities.
- Shared expectations: API base URL read from env.

---

## � How It Works

Below are the typical user journeys the system supports.

### Patient Flow
1. **Browse**: User lands on the frontend home page, searches for doctors or services, and reads profiles.
2. **Select**: Chooses either a doctor appointment or a specific service.
3. **Schedule**: Picks a date/time from a calendar widget. The frontend asks the API to check availability.
4. **Book**: Submits patient information (name, email, phone). API stores an `Appointment` or `ServiceAppointment` entry with status `pending`.
5. **Confirm/Pay** *(optional)*: After booking, a payment page may redirect to a third-party gateway. Upon returning, the frontend calls `/verify-payment` to update the appointment status and record payment details.
6. **View History**: If patient authentication is enabled, the user can log in to see past and upcoming appointments and cancel if needed.

### Doctor/Admin Flow
1. **Sign up/Login**: Doctors register via the admin portal, providing credentials, specialization, and a profile picture. They log in to receive a JWT token saved in local storage.
2. **Add Services**: Through the dashboard, doctors add or edit services, uploading images that the backend stores on Cloudinary.
3. **Manage Appointments**: The dashboard shows a list of current bookings. Doctors can update statuses (confirm, complete, cancel) which triggers optional email notifications.
4. **Profile Management**: Doctors can update their personal details, change passwords, and add availability blocks.

### Backend Logic
- Incoming requests pass through route-level validation (using express-validator or manual checks).
- Authenticated routes require a bearer token; middleware decodes and verifies the JWT, attaching the user object to `req.doctor`.
- Controllers interact with Mongoose models, performing queries and updates. They catch errors and propagate structured responses.
- Uploaded files flow through `multer`: saved temporarily then forwarded to Cloudinary via `utils/cloudinary.js`. The returned CDN URL is stored in the corresponding document.

### Database
- MongoDB collections reflect the Mongoose schemas. Relationships are implemented with ObjectId references and `populate()` calls in controllers to pull related data (e.g., appointment with doctor details).

---

## �🛠️ Development Workflow

1. Start MongoDB locally or configure Atlas.
2. Run backend server.
3. Open frontend and admin in separate terminals (each `npm run dev`).
4. Use Postman or similar to exercise API endpoints.

---

## ✅ Deployment

- Build each React project with `npm run build`.
- Serve static admin and frontend with any static server or integrate with backend (e.g., Express serving `build` folder).
- Set environment variables on the deployment platform (Heroku, Vercel, etc.).
- Ensure MongoDB and Cloudinary credentials are set.

---

## 📚 Future Enhancements

- Add patient authentication for booking history.
- Implement email notifications.
- Improve UI/UX and mobile responsiveness.
- Add tests (unit/integration).
- Include API documentation (Swagger/OpenAPI).

---

## ✨ Contributing
We welcome collaborative improvements and bug fixes.

1. **Fork** the repository to your GitHub account.
2. **Create a feature branch** using a descriptive name (`feature/login-flow`, `fix/appointment-validation`, etc.).
3. **Write clear commits** and include tests when applicable.
4. **Open a pull request** against the `main` branch and add a description of the changes.
5. Once approved, the maintainer will merge your PR; feel free to delete your branch afterwards.

Please abide by the code style used in the project (ESLint configurations are provided in each client). Add or update documentation if your change affects behavior.

---

### 🧪 Testing
Currently unit tests are not established; contributions adding Jest/Mocha tests for controllers or React components are highly appreciated.

### 🛡️ Security Notes
- Store secrets securely (do not commit `.env` files).
- Use strong JWT secret and rotate regularly.

---

### 📝 Additional Details
- API specification can be exported to Swagger using a tool like `express-openapi`.
- Database migrations are not currently set up; initialize MongoDB by running the server with an empty database.

<h4 align="center">Happy coding! 🚑</h4>

---

## 📝 License
Specify project license here.

---

*This README was generated with the help of GitHub Copilot.*
