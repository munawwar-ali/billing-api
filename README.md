# Multi-Tenant SaaS Billing Platform

A production-ready billing API with a full-stack dashboard. Built with Node.js, MongoDB, and Next.js.

🔗 **Live Demo:** [https://billing-dashboard-n4j6.vercel.app](https://billing-dashboard-n4j6.vercel.app)  
🔗 **API Base URL:** [https://billing-api-wyr9.onrender.com](https://billing-api-wyr9.onrender.com)

---

## Overview

This project simulates a real-world SaaS billing system where multiple organizations (tenants) can register, track their API usage, and generate invoices. Each tenant is completely isolated from others, with their own usage limits and billing records.

---

## Features

- **Multi-Tenancy** — Complete data isolation between organizations using tenant-scoped database queries
- **JWT Authentication** — Secure registration and login with role-based access (admin/member)
- **API Usage Tracking** — Middleware automatically tracks API calls per tenant per month
- **Rate Limiting** — Returns `429 Too Many Requests` with `Retry-After` header when monthly limit is exceeded
- **Tiered Billing** — Calculates invoice cost based on usage tiers
- **Invoice Generation** — Generates monthly invoices with mock Stripe integration
- **Dashboard UI** — Next.js frontend with Bootstrap for usage stats, billing, and invoice management

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API framework |
| MongoDB + Mongoose | Database and ODM |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password hashing |
| Joi | Request validation |

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework |
| Bootstrap 5 | UI styling |
| Axios | HTTP client |

### Infrastructure
| Service | Purpose |
|---------|---------|
| MongoDB Atlas | Cloud database |
| Render | Backend hosting |
| Vercel | Frontend hosting |
| UptimeRobot | Uptime monitoring |

---

## Architecture

```
billing-api/                      billing-dashboard/
├── src/                          ├── src/
│   ├── config/                   │   ├── app/
│   │   ├── database.js           │   │   ├── page.js          (Home)
│   │   └── env.js                │   │   ├── login/           (Login)
│   ├── controllers/              │   │   ├── register/        (Register)
│   │   ├── authController.js     │   │   ├── dashboard/       (Dashboard)
│   │   ├── billingController.js  │   │   ├── usage/           (Usage)
│   │   ├── demoController.js     │   │   └── billing/         (Billing)
│   │   ├── tenantController.js   │   ├── components/
│   │   └── usageController.js    │   │   ├── Navbar.js
│   ├── middleware/               │   │   └── ProtectedRoute.js
│   │   ├── auth.js               │   └── utils/
│   │   ├── rateLimiter.js        │       ├── api.js
│   │   ├── tenantIsolation.js    │       └── auth.js
│   │   └── usageTracking.js      
│   ├── models/                   
│   │   ├── Invoice.js            
│   │   ├── Tenant.js             
│   │   ├── Usage.js              
│   │   └── User.js               
│   ├── routes/                   
│   ├── services/                 
│   │   ├── billingService.js     
│   │   └── stripeService.js      
│   ├── validators/               
│   └── utils/                    
└── server.js                     
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Create tenant + admin user | No |
| POST | `/api/auth/login` | Login and get JWT token | No |

### Tenant
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tenant` | Get current tenant info | Yes |

### Usage
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/usage` | Get current month usage stats | Yes |
| GET | `/api/usage/history` | Get last 6 months usage history | Yes |

### Billing
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/billing/calculate` | Generate invoice for current month | Yes (Admin) |
| GET | `/api/billing/invoices` | Get all invoices | Yes |
| GET | `/api/billing/invoices/:id` | Get specific invoice | Yes |

### Demo
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/demo/data` | Protected endpoint (tracks usage) | Yes |
| GET | `/api/demo/public` | Public endpoint | No |

---

## Billing Tiers

| Tier | API Calls | Price |
|------|-----------|-------|
| Free | 0 - 10,000 | $0.00 |
| Standard | 10,001 - 100,000 | $0.001 per call |
| Premium | 100,000+ | $0.0005 per call |

---

## Key Design Decisions

### Tenant Isolation
Every database query filters by `tenantId` extracted from the JWT token. Users cannot access data from other tenants even if they know the IDs.

### Rate Limiting Strategy
Rate limiting uses MongoDB to track usage counts rather than in-memory storage. This ensures limits persist across server restarts and work correctly in multi-instance deployments.

### Usage Tracking Middleware
Usage tracking runs **after** rate limiting in the middleware chain. This ensures that rejected requests (429) are not counted toward the tenant's usage quota.

### Mock Stripe Integration
Stripe is mocked as a service layer (`stripeService.js`). Swapping mock functions for real Stripe SDK calls requires changes in only one file, without touching business logic.

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/munawwar-ali/billing-api.git
cd billing-api

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your values

# Start development server
npm run dev
```

### Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/billing-api
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Frontend Setup

```bash
# Clone the repo
git clone https://github.com/munawwar-ali/billing-dashboard.git
cd billing-dashboard

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Start development server
npm run dev
```

---


### Home Page
![Home Page](https://billing-dashboard-n4j6.vercel.app)

### Dashboard
- Usage progress bar with real-time updates
- Test API call button to simulate usage
- Quick links to usage and billing pages

### Usage Page
- Current month statistics (used, remaining, limit, percentage)
- Usage history table (last 6 months)
- Warning alert when usage exceeds 80%

### Billing Page
- Pricing tier cards
- Generate invoice button (admin only)
- Invoice history table with status badges

---

## Author

**Munawwar Ali**  
Backend Developer  
[GitHub](https://github.com/munawwar-ali)