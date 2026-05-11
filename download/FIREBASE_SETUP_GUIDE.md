# 🔥 ISKULTRIP SCANS — Firebase Setup Guide

## ধাপ ১: Firebase প্রজেক্ট তৈরি করুন

1. **[Firebase Console](https://console.firebase.google.com/)** এ যান
2. **"Create a project"** বা **"Add project"** এ ক্লিক করুন
3. Project name দিন: `iskultrip-scans`
4. Google Analytics চালু রাখুন (recommended)
5. **"Create project"** এ ক্লিক করুন এবং অপেক্ষা করুন

---

## ধাপ ২: Web App যোগ করুন (Client SDK এর জন্য)

1. Firebase Console এ আপনার প্রজেক্ট ওপেন করুন
2. বামে **⚙️ Gear icon → Project Settings** এ যান
3. নিচে **"Your apps"** সেকশনে **🌐 Web icon (`</>`)** এ ক্লিক করুন
4. App nickname দিন: `ISKULTRIP SCANS Web`
5. **"Register app"** এ ক্লিক করুন
6. **Firebase SDK এর কনফিগ কোডটি কপি করুন** — এটা এমন দেখাবে:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "iskultrip-scans.firebaseapp.com",
  projectId: "iskultrip-scans",
  storageBucket: "iskultrip-scans.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-XXXXXXXXXX"
};
```

### এই ভ্যালুগুলো `.env.local` ফাইলে বসান:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=iskultrip-scans.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=iskultrip-scans
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=iskultrip-scans.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## ধাপ ৩: Authentication চালু করুন

1. Firebase Console এ **"Authentication"** (Build → Authentication) এ যান
2. **"Get started"** এ ক্লিক করুন
3. **Sign-in method** ট্যাবে যান এবং এইগুলো চালু করুন:
   - ✅ **Email/Password** — Enable করুন
   - ✅ **Google** — Enable করুন (Support email সিলেক্ট করুন)
4. **"Save"** এ ক্লিক করুন

---

## ধাপ ৪: Firestore Database তৈরি করুন

1. Firebase Console এ **"Firestore Database"** (Build → Firestore Database) এ যান
2. **"Create database"** এ ক্লিক করুন
3. **"Start in test mode"** সিলেক্ট করুন (পরে rules পরিবর্তন করব)
4. Location সিলেক্ট করুন: `asia-southeast1` (বাংলাদেশ/ভারতের কাছে)
5. **"Done"** এ ক্লিক করুন

### Firestore Security Rules সেট করুন:

**Firestore Database → Rules ট্যাবে** যান এবং এই rules পেস্ট করুন:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Anyone can read manga and genres
    match /manga/{mangaId} {
      allow read: if true;
      allow write: if request.auth != null
        && request.auth.token.email == '<YOUR_ADMIN_EMAIL>';

      // Chapters subcollection
      match /chapters/{chapterId} {
        allow read: if true;
        allow write: if request.auth != null
          && request.auth.token.email == '<YOUR_ADMIN_EMAIL>';
      }
    }

    // Anyone can read genres
    match /genres/{genreId} {
      allow read: if true;
      allow write: if request.auth != null
        && request.auth.token.email == '<YOUR_ADMIN_EMAIL>';
    }

    // Users can only access their own bookmarks
    match /users/{userId}/bookmarks/{bookmarkId} {
      allow read, write: if request.auth != null
        && request.auth.uid == userId;
    }
  }
}
```

> ⚠️ `<YOUR_ADMIN_EMAIL>` এর জায়গায় আপনার অ্যাডমিন ইমেইল বসান!

**"Publish"** এ ক্লিক করুন।

---

## ধাপ ৫: Admin SDK এর জন্য Service Account Key ডাউনলোড করুন

1. Firebase Console এ **⚙️ Gear → Project Settings** এ যান
2. **"Service Accounts"** ট্যাবে যান
3. **"Generate new private key"** বাটনে ক্লিক করুন
4. JSON ফাইল ডাউনলোড হবে — এটি খুলুন

### এই ফাইল থেকে ভ্যালুগুলো `.env.local` এ বসান:

JSON ফাইলে এমন ডেটা থাকবে:
```json
{
  "type": "service_account",
  "project_id": "iskultrip-scans",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@iskultrip-scans.iam.gserviceaccount.com",
  ...
}
```

`.env.local` এ বসান:
```
FIREBASE_ADMIN_PROJECT_ID=iskultrip-scans
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@iskultrip-scans.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n"
```

> ⚠️ `FIREBASE_ADMIN_PRIVATE_KEY` অবশ্যই double quotes (`"`) এর মধ্যে রাখুন!

---

## ধাপ ৬: Admin Email সেট করুন

আপনি যে ইমেইল দিয়ে Admin Panel অ্যাক্সেস করতে চান সেটা দিন:

```
NEXT_PUBLIC_ADMIN_EMAIL=your-email@gmail.com
```

---

## ধাপ ৭: Social Links সেট করুন

```
NEXT_PUBLIC_SITE_URL=https://iskultrip.com
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/iskultripscans
NEXT_PUBLIC_TELEGRAM_URL=https://t.me/iskultripscans
```

---

## ধাপ ৮: সম্পূর্ণ `.env.local` ফাইল

সব মিলিয়ে আপনার `.env.local` ফাইল দেখতে এমন হবে:

```env
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=iskultrip-scans.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=iskultrip-scans
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=iskultrip-scans.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Firebase Admin SDK
FIREBASE_ADMIN_PROJECT_ID=iskultrip-scans
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@iskultrip-scans.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n"

# Admin
NEXT_PUBLIC_ADMIN_EMAIL=your-email@gmail.com

# Social Links
NEXT_PUBLIC_SITE_URL=https://iskultrip.com
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/iskultripscans
NEXT_PUBLIC_TELEGRAM_URL=https://t.me/iskultripscans
```

---

## ধাপ ৯: প্রথম Admin Account তৈরি করুন

1. সাইট চালু করুন: `npm run dev`
2. `/login` পেজে যান
3. আপনার **admin email** দিয়ে **Sign Up** করুন
4. এখন `/admin/login` এ যান এবং লগইন করুন
5. Admin Panel অ্যাক্সেস পাবেন! ✅

---

## 📋 সংক্ষেপে কী কী লাগবে:

| ক্রম | কী লাগবে | কোথায় পাবেন |
|------|----------|--------------|
| 1 | Firebase Project | [console.firebase.google.com](https://console.firebase.google.com/) |
| 2 | Web App Config (6টি ভ্যালু) | Project Settings → Your apps |
| 3 | Authentication চালু | Build → Authentication → Sign-in method |
| 4 | Firestore Database | Build → Firestore Database → Create |
| 5 | Service Account Key (3টি ভ্যালু) | Project Settings → Service Accounts |
| 6 | Admin Email | আপনার নিজের ইমেইল |
| 7 | Social Links | আপনার Facebook/Telegram লিংক |

**মোট 13টি environment variable** লাগবে `.env.local` ফাইলে।
