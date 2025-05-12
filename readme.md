# 🎯 Customer Relationship Management System

A full-stack campaign automation tool where **admins can manage customers, segment them using advanced filters or AI text input**, and create personalized campaigns with communication logs and AI-generated summaries.

**Live Demo:** [Video](https://drive.google.com/drive/u/3/folders/16CKjkDSaOeFKgyF6b7IXQI-mh0GE9Hbb)
**Tech Stack:** Next.js 15, Node.js Express.js, MongoDB, Tailwind CSS, Radix UI, Google Generative AI, Redis (optional)

---

## 🔁 Flow Summary

### 1. 🔐 Login Route (`/login`)

- Admin logs in via Google , Github or credentials (Passport.js support).

### 2. 👥 Add Customers (`/add`)

- Admin can:
  - Add customers via a form
  - Add orders per customer via modal popup
  - View customer profile and order in a quick popup

### 3. 🧩 Create Segments (`/segment`)

- A dynamic form to build customer segments:
  - Fields: `daysInactive`, `totalSpend`, `numberOfVisits`, etc.
  - Flexible `AND/OR` logic
  - ✨ **AI text area** to describe desired segment in natural language → generates JSON rules
- Matching customers are shown below the form

### 4. 💬 Campaign Messaging

- Two options:
  - ✨ **AI-generated message suggestions**
  - ✍️ Custom message input
- On submission:
  - Campaign is saved
  - Communication logs created per customer
  - Message sent → status updates (`pending` → `sent/failed`)

### 5. 📈 View Campaigns (`/campaign`)

- Displays:

  - Campaign details & message
  - Delivery stats (from communication log)
  - AI-generated summary, e.g.:

  > “Your campaign reached 1,200 users. 1,050 were successfully delivered. 150 failed. Customers who spent more than ₹10K had the highest success rate.”

---

## 🧠 AI Tools Used

| Tool                 | Purpose                                                  |
| -------------------- | -------------------------------------------------------- |
| Google Generative AI | Campaign summaries, segment rule generation, suggestions |

---

## 🧠 Smart Segmentation UX Tip

**Avoided cluttering with too many `AND/OR` dropdowns.**  
Used a rule-builder UI: React Query Builder

✅ Cleaner UX  
✅ Nested conditions  
✅ Already added to your dependencies

---

## 🧪 Known Limitations

- Message delivery is simulated (no real messaging API)
- No retry mechanism for failed messages
- AI generation depends on quality of text input

---

## 🛠️ Local Setup

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- npm

### Clone the Repository

-Backend
cd backend
npm install
npm start

-Frontend
cd frontend
npm install
npm run dev

🔹 Frontend
Package Purpose
next@15 Server-side rendering framework
react@19, react-dom@19 React core
tailwindcss@^4 Utility-first CSS
@radix-ui/react-\* Primitives for modals, popovers, dropdowns
clsx, tailwind-merge Dynamic Tailwind class merging
axios API calls
react-hot-toast, react-toastify Toast notifications
react-querybuilder Advanced filter builder UI

🔹 Backend
Package | Purpose |
express@5.1.0 - Web server
mongoose@8.14.2 - MongoDB
passport, passport-local, passport-google-oauth20, passport-github2 Authentication strategies
express-session Session management
jsonwebtoken, bcrypt JWT + password hashing
@google/generative-ai AI integration
dotenv, cors Config and CORS
