# Nowwagon (MERN + Tailwind)

College project starter for a porter-style platform with **3 roles**:
- **admin**
- **driver**
- **customer**

Includes:
- One **Auth page** with toggles for **Login/Register** and **Role**
- **Formik + Yup** validations
- **JWT auth** + role-based dashboards
- **Forgot password** + **Reset password** flow (SMTP optional; otherwise logs reset link in server console)

## Prerequisites
- Node.js (LTS recommended)
- MongoDB running locally **or** a MongoDB Atlas connection string

## Setup

### 1) Install dependencies

```bash
cd nowwagon
npm install
```

### 2) Configure environment

Edit `server/.env`:
- `MONGO_URI`
- `JWT_SECRET`
- Optional SMTP settings (leave blank to log reset links)

### 3) Run (client + server)

```bash
npm run dev
```

- Client: `http://localhost:5173`
- Server: `http://localhost:5000`

## Routes

- `/auth` – Login/Register + Role toggle
- `/forgot-password`
- `/reset-password`
- `/dashboard/admin`
- `/dashboard/driver`
- `/dashboard/customer`

