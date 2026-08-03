# SecureNotes

**A secure encrypted note management platform.**

SecureNotes is a full-stack web application for creating, managing, and protecting sensitive notes. It was built as a cybersecurity-focused portfolio project, with data confidentiality, authenticated access, authorization, accountability, and resistance to common authentication attacks treated as core requirements.

## Project Overview

The application combines a Next.js frontend with an Express API and PostgreSQL database. Notes pass through authenticated, user-scoped API operations and are encrypted before they are persisted, helping protect their contents at rest.

SecureNotes demonstrates practical application-security controls across the stack: strong password handling, authenticated encryption, JSON Web Token (JWT) authentication, role-based authorization, security event auditing, and defensive login controls.

## Features

- JWT authentication
- bcrypt password hashing
- AES-256-GCM note encryption
- Secure, user-scoped CRUD operations
- PostgreSQL storage
- Prisma ORM
- Audit logging
- Role-Based Access Control (RBAC)
- Admin security dashboard
- Failed login monitoring
- Brute-force protection with temporary account lockout
- Password policy enforcement

## Architecture

```mermaid
flowchart TD
    U[User] --> F[Next.js Frontend]
    F --> A[Express API]
    A --> P[Prisma ORM]
    P --> D[(Neon PostgreSQL)]
```

The browser communicates with the Next.js interface, which sends requests to the Express REST API. The backend applies authentication, authorization, validation, encryption, and audit controls before Prisma interacts with Neon PostgreSQL.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js, Prisma |
| Database | PostgreSQL (Neon) |

## Security Implementation

- **Password hashing:** Passwords are salted and hashed with bcrypt before storage. Plaintext passwords are never written to the database.
- **Encryption:** Note content is protected with AES-256-GCM authenticated encryption. A unique initialization vector is used for each encryption operation, while the authentication tag provides integrity and tamper detection.
- **Authentication:** The API issues signed JWTs after successful login and validates them on protected requests.
- **Authorization:** User-owned resources are scoped to the authenticated account. Administrative routes apply role checks so that security information is available only to authorized administrators.
- **Audit trail:** Authentication and note activity is recorded as security events, supporting visibility, accountability, and investigation through user and administrator views.
- **Attack protection:** Failed sign-in attempts are monitored. Five consecutive failures trigger a temporary 15-minute account lockout, reducing brute-force risk without revealing whether an account exists. Registration also enforces minimum password complexity requirements.

> [!IMPORTANT]
> SecureNotes is a portfolio project. A production deployment should also use HTTPS, secure secret management, dependency monitoring, centralized logging, database backups, and infrastructure-level rate limiting.

## Deployment

| Component | Platform |
| --- | --- |
| Frontend | Vercel |
| Backend | Render |
| Database | Neon PostgreSQL |

For production, configure the frontend with the public Render API URL and configure the backend with the Vercel origin, Neon connection string, and securely generated application secrets.

## Local Setup Instructions

### Prerequisites

- Node.js 20 or later
- npm
- A PostgreSQL database (local or Neon)

### 1. Clone the repository

```bash
git clone <repository-url>
cd SecureNotes
```

### 2. Configure and start the backend

```bash
cd backend
npm install
```

Copy `backend/.env.example` to `backend/.env`, then set the following values:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
JWT_SECRET="replace-with-a-long-random-secret"
ENCRYPTION_KEY="replace-with-64-hexadecimal-characters"
FRONTEND_URL="http://localhost:3000"
PORT=5000
```

Generate a cryptographically random 32-byte encryption key (represented by 64 hexadecimal characters):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Apply the database migrations and start the API:

```bash
npx prisma migrate deploy
npm run dev
```

The backend will be available at `http://localhost:5000`.

### 3. Configure and start the frontend

Open a second terminal from the repository root:

```bash
cd frontend
npm install
```

Copy `frontend/.env.example` to `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in a browser.

> Never commit `.env` files, JWT secrets, encryption keys, or production database credentials.

## Screenshots

Add portfolio screenshots to the `screenshots/` directory using the following filenames:

### Login

![SecureNotes login screen](screenshots/login.png)

### Dashboard

![SecureNotes user dashboard](screenshots/dashboard.png)

### Encrypted Note

![SecureNotes encrypted note workflow](screenshots/encrypted-note.png)

### Admin Security Dashboard

![SecureNotes admin security dashboard](screenshots/admin-dashboard.png)

### Audit Logs

![SecureNotes audit log viewer](screenshots/audit-logs.png)

## Portfolio Highlights

SecureNotes showcases full-stack engineering through a security-first lens. It demonstrates the practical use of authenticated encryption, secure credential storage, token-based identity, access-control boundaries, security telemetry, and attack-aware authentication design in a deployable web application.
