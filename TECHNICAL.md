# Technical Documentation

---

## 🏗️ Tech Stack

- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite 8
- **Styling:** Pure CSS
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth (Email/Password)
- **PDF Generation:** @react-pdf/renderer
- **Routing:** React Router DOM
- **Hosting:** Vercel

---

## 🚀 Deployment

### Production
- **URL:** https://amw-receipt-tool.vercel.app
- **Platform:** Vercel
- **Auto-deploy:** Enabled (on push to main)

### Environment Variables (Vercel)
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

---

## 🔥 Firebase Setup

### Project
- **Name:** amw-receipt-tool
- **Region:** us-central

### Services Used
1. **Firestore Database**
   - Collections: `receipts`, `counters`
   - Auto-incrementing receipt numbers

2. **Authentication**
   - Method: Email/Password
   - User: `amw@internal.com`

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /receipts/{receiptId} {
      allow read, write: if true;
    }
    match /counters/{counterId} {
      allow read, write: if true;
    }
  }
}
```

---

## 💻 Local Development

### Prerequisites
- Node.js 20+
- npm or yarn

### Setup
```bash
# Clone repository
git clone [repo-url]

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add Firebase config to .env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
# ... (other Firebase variables)

# Run dev server
npm run dev
```

### Build
```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── components/       # Reusable components
│   ├── Header.tsx
│   ├── ProtectedRoute.tsx
│   ├── ReceiptForm.tsx
│   ├── ReceiptPDF.tsx
│   ├── AllReceiptsPDF.tsx
│   └── Toast.tsx
├── pages/           # Page components
│   ├── Login.tsx
│   ├── Home.tsx
│   └── ReceiptsList.tsx
├── services/        # API/Firebase services
│   ├── auth.ts
│   └── firebase.ts
├── utils/           # Utility functions
│   ├── numberToWords.ts
│   └── formatIndianNumber.ts
├── styles/          # CSS files
└── config/          # Configuration
    └── firebase.ts
```

---

## 🔐 Authentication Flow

1. User visits app → Redirected to `/login`
2. Enter email (`amw@internal.com`) and password
3. Firebase Auth verifies credentials
4. On success → Session stored, access granted
5. Protected routes check auth state
6. Logout → Clear session, redirect to login

---

## 📊 Database Schema

### Receipts Collection
```typescript
{
  id: string,              // Auto-generated
  receiptNo: number,       // Sequential
  createdAt: timestamp,
  date: string,
  ownerName: string,
  wing: string,
  flat: string,
  amount: string,
  amountInWords: string,
  mode: string,
  purpose: string
}
```

### Counters Collection
```typescript
{
  id: "receiptCounter",
  value: number  // Current receipt number
}
```

---

## 🔄 Deploy Updates

```bash
# Vercel automatically deploys on push
git add .
git commit -m "Update message"
git push origin main

# Or manual deploy
vercel --prod
```

---

## 💰 Cost (Free Tier)

### Firebase
- **Firestore reads:** 50,000/day (using ~50/day)
- **Firestore writes:** 20,000/day (using ~30/day)
- **Storage:** 1 GB (using ~0.2 MB)
- **✅ 100% within free tier**

### Vercel
- **Bandwidth:** 100 GB/month
- **Build time:** 6000 minutes/month
- **✅ 100% within free tier**

---

## 📝 Features

- Auto-incrementing receipt numbers (thread-safe)
- Indian number formatting (lakhs/crores)
- PDF generation with professional layout
- CRUD operations (Create, Read, Update, Delete)
- Toast notifications
- Mobile-responsive design
- Firebase Authentication
- Cloud data storage

---

## 🛠️ Maintenance

### Change Password
1. Firebase Console → Authentication → Users
2. Find `amw@internal.com`
3. Click ⋮ → Reset password
4. Enter new password → Save

### View/Export Data
1. Firebase Console → Firestore Database
2. Browse `receipts` collection
3. Export as JSON/CSV if needed

### Monitor Usage
1. Vercel Dashboard → Analytics
2. Firebase Console → Usage tab

---

**Environment:** Production  
**Status:** Active  
**Last Updated:** April 2026
