# 🔥 ISKULTRIP SCANS — Firebase সেটআপ গাইড

## ধাপে ধাপে Firebase সেটআপ নির্দেশনা

---

## ধাপ ১: Firebase প্রজেক্ট তৈরি করুন

1. **Firebase Console-এ যান:** https://console.firebase.google.com/
2. **"Create a project"** বাটনে ক্লিক করুন
3. **Project name:** `iskultrip-scans` লিখুন (অথবা আপনার পছন্দের নাম)
4. **"Continue"** ক্লিক করুন
5. Google Analytics এনাবল করতে চাইলে টিক দিন, না চাইলে ডিসেবল করুন
6. **"Create project"** ক্লিক করুন এবং অপেক্ষা করুন

---

## ধাপ ২: Authentication সেটআপ করুন

1. Firebase Console-এর বাম পাশে **"Authentication"** এ ক্লিক করুন
2. **"Get started"** বাটনে ক্লিক করুন
3. **Sign-in method** ট্যাবে যান এবং নিচেরগুলো এনাবল করুন:

### Email/Password:
- **"Email/Password"** এ ক্লিক করুন
- **"Enable"** টগল অন করুন
- **"Save"** ক্লিক করুন

### Google:
- **"Google"** এ ক্লিক করুন
- **"Enable"** টগল অন করুন
- **Project support email** সিলেক্ট করুন
- **"Save"** ক্লিক করুন

### অ্যাডমিন ইমেইল সেট করুন:
- **Authentication → Users** ট্যাবে যান
- **"Add user"** ক্লিক করুন
- আপনার অ্যাডমিন ইমেইল ও পাসওয়ার্ড দিন (যেমন: `youradmin@gmail.com`)
- **"Add user"** ক্লিক করুন
- এই ইমেইলটি `.env.local` এ `NEXT_PUBLIC_ADMIN_EMAIL` এ দিন

---

## ধাপ ৩: Firestore Database সেটআপ করুন

1. Firebase Console-এর বাম পাশে **"Firestore Database"** এ ক্লিক করুন
2. **"Create database"** ক্লিক করুন
3. **"Start in production mode"** সিলেক্ট করুন (পরে নিয়ম যোগ করব)
4. **Location:** `asia-south1` (ঢাকার জন্য) অথবা আপনার কাছের লোকেশন সিলেক্ট করুন
5. **"Done"** ক্লিক করুন

### Firestore Security Rules সেট করুন:
1. **"Rules"** ট্যাবে যান
2. নিচের নিয়মগুলো পেস্ট করুন:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // পাবলিক রিড — যেকোনো মাঙ্গা/জেনার পড়তে পারবে
    match /manga/{mangaId} {
      allow read: if true;
      allow write: if request.auth != null &&
        request.auth.token.email == "YOUR_ADMIN_EMAIL@gmail.com";

      match /chapters/{chapterId} {
        allow read: if true;
        allow write: if request.auth != null &&
          request.auth.token.email == "YOUR_ADMIN_EMAIL@gmail.com";
      }
    }

    match /genres/{genreId} {
      allow read: if true;
      allow write: if request.auth != null &&
        request.auth.token.email == "YOUR_ADMIN_EMAIL@gmail.com";
    }
  }
}
```

3. **"Publish"** ক্লিক করুন
4. ⚠️ **`YOUR_ADMIN_EMAIL@gmail.com`** আপনার আসল অ্যাডমিন ইমেইল দিয়ে রিপ্লেস করুন!

---

## ধাপ ৪: Firebase Web App রেজিস্টার করুন (Client SDK)

1. Firebase Console-এর উপরে বাম পাশে **⚙️ Settings** → **"Project settings"**
2. নিচে **"Your apps"** সেকশনে **Web আইকন** `</>` তে ক্লিক করুন
3. **App nickname:** `iskultrip-web` লিখুন
4. **"Register app"** ক্লিক করুন
5. ফায়ারবেস কনফিগ কোড দেখাবে — এটি কপি করুন, পরে লাগবে
6. **"Continue to console"** ক্লিক করুন

---

## ধাপ ৫: Firebase Admin SDK সেটআপ করুন (Server-side)

1. **⚙️ Project settings** → **"Service accounts"** ট্যাবে যান
2. **"Generate new private key"** বাটনে ক্লিক করুন
3. **"Generate key"** কনফার্ম করুন — একটি JSON ফাইল ডাউনলোড হবে
4. এই ফাইলটি **খুবই গোপনীয়** — কাউকে দেবেন না, Git-এ আপলোড করবেন না!
5. ফাইলটি খুলুন এবং নিচের তিনটি মান কপি করুন:
   - `project_id` → এটি হবে `FIREBASE_ADMIN_PROJECT_ID`
   - `client_email` → এটি হবে `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `private_key` → এটি হবে `FIREBASE_ADMIN_PRIVATE_KEY`

---

## ধাপ ৬: `.env.local` ফাইল আপডেট করুন

প্রজেক্টের `.env.local` ফাইল খুলুন এবং সব মান পূরণ করুন:

```env
# Firebase Client SDK (ধাপ ৪ থেকে পাওয়া মানগুলো)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB...আপনার-API-KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=iskultrip-scans.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=iskultrip-scans
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=iskultrip-scans.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Firebase Admin SDK (ধাপ ৫ থেকে পাওয়া মানগুলো)
FIREBASE_ADMIN_PROJECT_ID=iskultrip-scans
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@iskultrip-scans.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n"

# অ্যাডমিন অ্যাক্সেস (আপনার অ্যাডমিন ইমেইল)
NEXT_PUBLIC_ADMIN_EMAIL=youradmin@gmail.com

# সোশ্যাল লিংক
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/iskultripscans
NEXT_PUBLIC_TELEGRAM_URL=https://t.me/iskultripscans
NEXT_PUBLIC_SITE_URL=https://iskultrip.com
```

⚠️ **গুরুত্বপূর্ণ:**
- `FIREBASE_ADMIN_PRIVATE_KEY` অবশ্যই ডাবল কোটেশন `"` দিয়ে রাখতে হবে
- `\n` গুলো অবশ্যই রাখতে হবে, সরাবেন না
- এই ফাইলটি Git-এ commit করবেন না (`.gitignore`-এ যোগ করা আছে)

---

## ধাপ ৭: Firestore ইনডেক্স তৈরি করুন

কিছু কোয়েরির জন্য Firestore ইনডেক্স প্রয়োজন। প্রথমবার ওয়েবসাইট চালানোর সময় কনসোলে ইনডেক্স তৈরির লিংক আসতে পারে — সেই লিংকে ক্লিক করে ইনডেক্স তৈরি করুন।

অথবা আগে থেকেই তৈরি করতে পারেন:

1. **Firestore Database → Indexes** ট্যাবে যান
2. **"Create index"** ক্লিক করুন
3. নিচের ইনডেক্সগুলো তৈরি করুন:

| Collection | Fields | Type |
|-----------|--------|------|
| manga | `featured` (Ascending) + `updatedAt` (Descending) | Collection |
| manga | `trending` (Ascending) + `rating` (Descending) | Collection |
| manga | `language` (Ascending) + `updatedAt` (Descending) | Collection |
| manga | `slug` (Ascending) | Collection |
| manga | `createdAt` (Descending) | Collection |
| genres | `name` (Ascending) | Collection |
| manga/{mangaId}/chapters | `chapterNumber` (Descending) | Collection |

---

## ধাপ ৮: ডেমো ডাটা সিড করুন

1. টার্মিনাল খুলুন এবং প্রজেক্ট ফোল্ডারে যান:
```bash
cd /path/to/iskultrip-scans
```

2. সিড স্ক্রিপ্ট চালান:
```bash
node scripts/seed.js
```

3. আউটপুট দেখবেন:
```
🌱 Starting database seeding...
📁 Seeding genres...
  ✅ Added 18 genres

📚 Seeding manga...
  ✅ "One Piece" — 12 chapters
  ✅ "Attack on Titan" — 8 chapters
  ✅ "Jujutsu Kaisen" — 6 chapters
  ...

🎉 Seeding complete! Your website is ready to preview.
```

---

## ধাপ ৯: ওয়েবসাইট চালু করুন

```bash
# ডেভেলপমেন্ট মোড
npm run dev

# অথবা
bun dev
```

ব্রাউজারে http://localhost:3000 যান।

---

## ধাপ ১০: অ্যাডমিন প্যানেল অ্যাক্সেস করুন

1. http://localhost:3000/login যান
2. আপনার অ্যাডমিন ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করুন
3. লগইন করলে নেভবারে **"Admin Panel"** অপশন দেখা যাবে
4. সেখান থেকে মাঙ্গা, চ্যাপ্টার, জেনার ম্যানেজ করতে পারবেন

---

## ✅ চেকলিস্ট

- [ ] Firebase প্রজেক্ট তৈরি হয়েছে
- [ ] Authentication এনাবল করা হয়েছে (Email/Password + Google)
- [ ] অ্যাডমিন ইমেইল/পাসওয়ার্ড তৈরি করা হয়েছে
- [ ] Firestore Database তৈরি হয়েছে (production mode)
- [ ] Firestore Security Rules সেট করা হয়েছে
- [ ] Web App রেজিস্টার করা হয়েছে (Client SDK config পাওয়া গেছে)
- [ ] Service Account Key জেনারেট করা হয়েছে (Admin SDK)
- [ ] `.env.local` ফাইল সব মান দিয়ে আপডেট করা হয়েছে
- [ ] Firestore ইনডেক্স তৈরি করা হয়েছে
- [ ] ডেমো ডাটা সিড করা হয়েছে (`node scripts/seed.js`)
- [ ] ওয়েবসাইট চালু হচ্ছে
- [ ] অ্যাডমিন প্যানেল অ্যাক্সেস পাচ্ছেন

---

## 🔧 সমস্যা সমাধান

### "Missing or insufficient permissions" এরর
- Firestore Security Rules ঠিকমতো সেট হয়েছে কিনা চেক করুন
- আপনার অ্যাডমিন ইমেইল Rules-এ ঠিকমতো দেওয়া আছে কিনা দেখুন

### "Firebase: Error (auth/invalid-api-key)"
- `.env.local` এ API key ঠিকমতো দেওয়া আছে কিনা চেক করুন
- সার্ভার রিস্টার্ট করুন (`Ctrl+C` তারপর `npm run dev`)

### Admin Panel দেখা যাচ্ছে না
- অ্যাডমিন ইমেইল দিয়ে লগইন করেছেন কিনা নিশ্চিত হন
- `NEXT_PUBLIC_ADMIN_EMAIL` ঠিকমতো সেট আছে কিনা চেক করুন
- ব্রাউজারে লগআউট করে আবার লগইন করুন

### Firestore ইনডেক্স এরর
- ব্রাউজার কনসোলে ইরর লিংক আসলে সেই লিংকে ক্লিক করুন
- ইনডেক্স তৈরি হতে কয়েক মিনিট লাগতে পারে
