# 🚀 ISKULTRIP SCANS — Vercel Deployment Guide

## ধাপ ১: Firebase Console-এ Authentication চালু করুন

1. [Firebase Console](https://console.firebase.google.com/) → **iskultrips** প্রজেক্ট ওপেন করুন
2. **Build → Authentication** এ যান → **"Get started"**
3. **Sign-in method** ট্যাবে:
   - ✅ **Email/Password** → Enable → Save
   - ✅ **Google** → Enable → Support email সিলেক্ট → Save

---

## ধাপ ২: Firestore Database তৈরি করুন

1. **Build → Firestore Database** এ যান → **"Create database"**
2. **"Start in test mode"** সিলেক্ট করুন
3. Location: **asia-southeast1** (Singapore — বাংলাদেশ/ভারতের কাছে)
4. **"Done"** ক্লিক করুন

### Firestore Rules সেট করুন:
**Firestore Database → Rules ট্যাবে** যান এবং এই rules পেস্ট করুন:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /manga/{mangaId} {
      allow read: if true;
      allow write: if request.auth != null
        && request.auth.token.email == 'YOUR_ADMIN_EMAIL@gmail.com';
      match /chapters/{chapterId} {
        allow read: if true;
        allow write: if request.auth != null
          && request.auth.token.email == 'YOUR_ADMIN_EMAIL@gmail.com';
      }
    }
    match /genres/{genreId} {
      allow read: if true;
      allow write: if request.auth != null
        && request.auth.token.email == 'YOUR_ADMIN_EMAIL@gmail.com';
    }
    match /users/{userId}/bookmarks/{bookmarkId} {
      allow read, write: if request.auth != null
        && request.auth.uid == userId;
    }
  }
}
```

> ⚠️ `YOUR_ADMIN_EMAIL@gmail.com` এর জায়গায় আপনার অ্যাডমিন ইমেইল বসান!

**"Publish"** ক্লিক করুন।

---

## ধাপ ৩: কোড GitHub-এ পুশ করুন

```bash
git init
git add .
git commit -m "ISKULTRIP SCANS - Complete manga directory"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/iskultrip-scans.git
git push -u origin main
```

---

## ধাপ ৪: Vercel-এ ডেপ্লয় করুন

1. **[vercel.com](https://vercel.com)** এ যান এবং GitHub দিয়ে লগইন করুন
2. **"Add New" → "Project"** ক্লিক করুন
3. GitHub repository সিলেক্ট করুন: `iskultrip-scans`
4. **Framework Preset**: Next.js (অটো ডিটেক্ট হবে)
5. **Root Directory**: `.` (ডিফল্ট রাখুন)

### Environment Variables যোগ করুন:

Vercel প্রজেক্ট সেটিংসে **"Environment Variables"** সেকশনে এই 14টা ভ্যালু যোগ করুন:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyD3TE0hAmxQ96aDed2Hy9qynxOqgKeGFRo` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `iskultrips.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `iskultrips` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `iskultrips.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `1083016075250` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:1083016075250:web:05eab9cf3f01753443fd6b` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-4J572BFQST` |
| `FIREBASE_ADMIN_PROJECT_ID` | `iskultrips` |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | `firebase-adminsdk-fbsvc@iskultrips.iam.gserviceaccount.com` |
| `FIREBASE_ADMIN_PRIVATE_KEY` | (পুরো private key — নিচে দেখুন) |
| `NEXT_PUBLIC_ADMIN_EMAIL` | (আপনার অ্যাডমিন ইমেইল) |
| `NEXT_PUBLIC_SITE_URL` | `https://iskultrip.vercel.app` |
| `NEXT_PUBLIC_FACEBOOK_URL` | `https://www.facebook.com/share/18VemDPH5r/` |
| `NEXT_PUBLIC_TELEGRAM_URL` | `https://t.me/ISKULTRIP_SCANS` |

6. **"Deploy"** ক্লিক করুন ✅

---

## ⚠️ FIREBASE_ADMIN_PRIVATE_KEY — Vercel-এ কীভাবে দেবেন

Vercel-এ private key দেওয়ার সময় সবচেয়ে বেশি সমস্যা হয়। এই ভ্যালুটা **এক লাইনে** দিন, যেখানে newlines হবে `\n`:

```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC43EHYUpuOnev0\neT6eE7BS31Zm331RaZs5j1Ockb4vtGdYw9Q+tD8dCZQXP+D75ZCRMviVzNlU+pYP\nGwhcFHI66CYEwy6D13XVFvdWtEUWm52RzRqI2p507B404jdHdDIIZDysrtWrbHfz\n6m7sdwks9acG2+luwVXS/S7V37aCmUqxFpaaO4MzW9rdKn+aipO70MwVdFnwdRwl\nvl8Q28OQvgNGYWe2xIr/mlenQK0f3s3yR3aQJOabwuS0ISjhk2RfKXJKVTsku5x8\nuo8kSN3HFR/O566U5R7M5te37BxlGo5YhYuay11n0ydBqh20800SJCE9PJX+fC++\n4bhatTLbAgMBAAECggEAHQT2kS7mnIzN7aLa4ZXVqCzHM38B/TXG2FJXncyDPpnj\nX1vehbll7vkB9mRgvSpcd26490shEuYDiHuF5G6RQA4Rac36D1hTdxAT49iIv/PN\n2IWKFNG87j3iwAqDAwSKliamH7WSdUahzfiPUS+ekSA/CCSdkHVpM6XrJEfqLrX9\nPXtKFoanDiLGdxI82gylBtz7+IliW9yx5Qhf4V0Aask2SavHcv8eX2l2+KNa9dSx\nWUbl0ltOsqhwpr2MnO7gbiAFsvNjh1uCArtIluOJ/+WfSVWAgzwMlGBCVwrwaeF+\ntY1qw0VRUeh1958U0NjNwVy8QjmSgM9oEVEJLMeAAQKBgQDpBNflEvMwt/5Uc4sR\nUCIrekHDfyjivIA7aXnIw2tEpt9i/ssQPWv1nS79TSKc9843KeBft0pPTQJ0NWvi\nBoT4dXT3axGHF2RUbeq8/AzN0ea9/XQyXcYSeKIMs9529l9hp9xyMEdfR7qN3Ruw\n5X5d05NN7wR7EPMMxoDjEIa+2wKBgQDLF4ddFDQT2xIpzPCNb/6G0znDLKf1rc8c\naZlEcVlcFQbPlffbSWgToSEkJ0woNs3sCLH1+EdBXII/i35AOYa5Obf3z+jEgZ62\nYny6Nw/Y7gYw36ouwo275USgO9wXk7XI+zU8CV50MPjzXnVuZ5pk1so3Q1MPhZNE\nZT2JTPOcAQKBgQCk59SSPTL2C4Bl689DVV6ZPlBENj2NGLH3WdHiDspfL2lv+blj\nqNQ6Yh7bDDeutoCt8Wjk1CY2sN1HuHa84rg/zYAViSRCYn+ScKdrT0UQc7fERRZy\nfoKql8y3CKQrtHgT+GO+PASGnZCczRnHuuIPLKhWwwx8u6YGKIUWLJ/veQKBgBSv\nYc8eJqu7DV+KixmsxXzP+LsjSjwgps6bBsxMyzAwyA/Ok38XO+175Nc81WnnIxQe\nUpnd3swOcwmr2IEMGue0tEMePvP8y8CByXhh8VBD9gd2UGwQzsTLdjDnx+Py3HoK\n9AIYZjFpZ4HKJiXHkZchtVjpl4UmMritoxXf65QBAoGAEZRiOiAnYxdP7jb4ZBg8\nRCikVnKaN76lg9pkhVD8orrcwuY6W3zSgnmGrCXI543NqHIW2KX0KkKEcSGcuzy4\nkcYD5fRw4P1mjKtPPB+NJPWyvRXigBnDPV7dy+vigVXuD+wbpmIaMTZGCFX9NYHq\nY0IOJs1M5dGFQesy88nYkwc=\n-----END PRIVATE KEY-----\n
```

> 🔑 **গুরুত্বপূর্ণ**: এটা double quotes ছাড়া দিন, আর `\n` গুলো literal text হিসেবে রাখুন।
> কোডে অটোমেটিক্যালি `\n` কে real newline-এ convert করা হয়েছে।

---

## ধাপ ৫: ডেপ্লয় পরে করণীয়

1. **প্রথম Admin Account তৈরি করুন**:
   - `/login` পেজে যান
   - আপনার admin email দিয়ে Sign Up করুন
   - এখন `/admin/login` এ যান এবং লগইন করুন

2. **Firestore Rules আপডেট করুন**:
   - Firebase Console → Firestore → Rules এ যান
   - `YOUR_ADMIN_EMAIL@gmail.com` এর জায়গায় আপনার ইমেইল বসান
   - Publish করুন

3. **প্রথম Genre যোগ করুন**:
   - Admin Panel → Genres → Add Genre
   - কিছু জনপ্রিয় genre যোগ করুন: Action, Romance, Fantasy, etc.

4. **প্রথম Manga যোগ করুন**:
   - Admin Panel → Manga → Add Manga
   - Title, cover image, description, genres দিন

---

## 🔧 সমস্যা হলে

| সমস্যা | সমাধান |
|--------|---------|
| Build fail করে | Vercel logs দেখুন → Environment variables ঠিক আছে কিনা চেক করুন |
| Admin login কাজ করে না | `NEXT_PUBLIC_ADMIN_EMAIL` ঠিক দিয়েছেন কিনা দেখুন |
| Firestore permission denied | Firestore rules ঠিক সেট করেছেন কিনা দেখুন |
| Private key error | Private key-তে `\n` আছে কিনা নিশ্চিত করুন |
| Images দেখায় না | Cover image URL সরাসরি accessible কিনা চেক করুন |
