# 🎯 Customer Relationship Management System

A full-stack Customer Relationship Management System where **admins can manage customers, segment them using advanced rules or AI text input**, and create personalized campaigns with communication logs and AI-generated summaries.

## 🌐 Deployment

🔗 [Live CRM App](https://xeno-crm-wo6w.onrender.com/)

## 🚀 Live Demo

📹 [Video Walkthrough](https://drive.google.com/drive/u/3/folders/16CKjkDSaOeFKgyF6b7IXQI-mh0GE9Hbb)

## 🧭 Flowchart

📊 [System Diagram](https://res.cloudinary.com/dop7kjln7/image/upload/v1747167527/gk2uvgoqhkjgs2uwxtf5.jpg)

---

## 🔁 Flow Summary

### 1. 🔐 Login Route (`/login`)

- Admin logs in via Google, GitHub, or credentials (using Passport.js).

### 2. 👥 Add Customers (`/add`)

- Admin can:
  - Add customers via a form
  - Add orders per customer via a modal popup
  - View customer profile and order in a quick popup

### 3. 🧩 Create Segments (`/segment`)

- Two options:

  - A rule based form to build customer segments:

    - Fields: `daysInactive`,`totalSpend`,`numberOfVisits`,`accountType`,`lastPurchaseDate`,`isSubscribed`,`mostCategoryOfProductsPurchased`
    - Flexible `AND/OR` logic
    - Matching customers can be previewed with total count

  - ✨ **AI text area** to describe desired segment in natural language → generates JSON rules
    - Matching customers can be previewed with total count

### 4. 💬 Campaign Messaging

- Two options:
  - ✨ **AI-generated message suggestions**
  - ✍️ Personalized Campaign messages suggestions by inputting topic and description
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

| Tool                 | Purpose                                                                       |
| -------------------- | ----------------------------------------------------------------------------- |
| Google Generative AI | Campaign summaries, segment rule generation, personalized message suggestions |

---

## 💡 Smart Segmentation UX

**Avoided cluttering with too many `AND/OR` dropdowns.**  
Used a rule-builder UI: React Query Builder

✅ Cleaner UX  
✅ Nested conditions  
✅ Easy to understand

---

## ⚠️ Known Limitations

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

```bash
# Backend
cd backend
npm install
npm start
```

```bash
# Frontend
cd frontend
npm install
npm run dev
```

---

## 🔹 Frontend Stack

| Package            | Purpose                  |
| ------------------ | ------------------------ |
| Next.js            | As a Frontend Framework  |
| React,ReactDom     | Next is build on React   |
| tailwind css       | Styling                  |
| Shadcn             | Enhanced UI              |
| axios              | API calls                |
| react-hot-toast    | Toast notifications      |
| react-querybuilder | Advanced rule builder UI |

---

## 🔹 Backend Stack

| Package                                                             | Purpose                   |
| ------------------------------------------------------------------- | ------------------------- |
| Express.js                                                          | Web server                |
| Mongo DB                                                            | MongoDB                   |
| passport, passport-local, passport-google-oauth20, passport-github2 | Authentication strategies |
| express-session                                                     | Session management        |
| jsonwebtoken, bcrypt                                                | JWT + password hashing    |
| Google Gemini API                                                   | AI integration            |
| dotenv, cors                                                        | Config and CORS           |

## Backend Deployed Url

https://connect-crm-backend.onrender.com/

## Frontend Deployed Url

https://xeno-crm-wo6w.onrender.com/
