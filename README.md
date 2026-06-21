# Rexburg Auto Used Car Dealership

## Project Description

Brandon Auto is a server-side rendered used car dealership web application built for CSE 340 Web Backend Development. Visitors can browse used vehicles by category, view vehicle details, and send contact messages. Registered users can leave vehicle reviews, edit or delete their own reviews, submit service requests, and view service request history.

Employees can manage service requests, update request statuses, add employee notes, moderate reviews, edit vehicle details, and view contact form submissions. The owner/admin can manage users, categories, and vehicle inventory.

## Technology Stack

- Node.js
- Express.js
- EJS
- ECMAScript Modules / ESM
- PostgreSQL
- express-session
- bcrypt
- Render deployment

## User Roles

### Owner/Admin
The owner has full control of the system. The owner can manage users, vehicle categories, vehicle inventory, service requests, reviews, and contact messages.

### Employee
Employees can edit vehicle details, moderate reviews, view contact messages, and update service request statuses and notes.

### Standard User
Standard users can browse vehicles, leave reviews, edit/delete their own reviews, submit service requests, and view service request history.

## Test Account Credentials

Use this password for all test accounts:

`P@$$w0rd!`

| Role | Email |
|---|---|
| Owner/Admin | owner@test.com |
| Employee | employee@test.com |
| User | user@test.com |

## Database Schema

The project uses the following tables:

- users
- categories
- vehicles
- vehicle_images
- reviews
- service_requests
- contact_messages
- session

Add your ERD image exported from pgAdmin here before submitting:

`/docs/erd.png`

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file:

```bash
cp .env.example .env
```

3. Add your PostgreSQL connection string to `.env`:

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/used_car_dealership
SESSION_SECRET=your-secret-key
NODE_ENV=development
PORT=3000
```

4. Create the database tables:

```bash
npm run db:init
```

5. Seed test users and sample vehicles:

```bash
npm run db:seed
```

6. Start the app:

```bash
npm run dev
```

Open the site at:

```bash
http://localhost:3000
```

## Render Deployment Notes

On Render, set these environment variables:

- `DATABASE_URL`
- `SESSION_SECRET`
- `NODE_ENV=production`

Use this build command:

```bash
npm install
```

Use this start command:

```bash
npm start
```

After creating the Render PostgreSQL database, run the schema and seed commands using a local terminal connected to the production `DATABASE_URL`, or use Render Shell if available.

## Known Limitations

- Vehicle image uploads are handled by image URL only, not file uploads.
- Employee account creation is handled by the owner changing a user's role.
- The service request workflow uses three statuses: Submitted, In Progress, and Completed.
- The ERD image must be exported from pgAdmin and added before final submission.
