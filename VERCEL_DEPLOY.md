# ISKULTRIP SCANS — Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- Your code pushed to a GitHub repository

---

## Step 1: Push Code to GitHub

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "ISKULTRIP SCANS - ready for deployment"

# Create a GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/iskultrip-scans.git
git branch -M main
git push -u origin main
```

---

## Step 2: Import Project on Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your GitHub repository
4. Click **"Import"**

---

## Step 3: Configure Environment Variables

In the Vercel project settings, add these environment variables:

### Firebase Client SDK (Public)
| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyD3TE0hAmxQ96aDed2Hy9qynxOqgKeGFRo` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `iskultrips.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `iskultrips` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `iskultrips.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `1083016075250` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:1083016075250:web:05eab9cf3f01753443fd6b` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-4J572BFQST` |

### Firebase Admin SDK (Private — Server Only)
| Key | Value |
|-----|-------|
| `FIREBASE_ADMIN_PROJECT_ID` | `iskultrips` |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | `firebase-adminsdk-fbsvc@iskultrips.iam.gserviceaccount.com` |
| `FIREBASE_ADMIN_PRIVATE_KEY` | *(Full private key including -----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY-----)* |

⚠️ **Important for FIREBASE_ADMIN_PRIVATE_KEY:**
- Copy the ENTIRE private key including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines
- The `\n` characters in the key will be handled automatically by the code
- Make sure there are no extra spaces or line breaks

### Site Configuration
| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_ADMIN_EMAIL` | `bongmanga.official@gmail.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://your-app-name.vercel.app` |
| `NEXT_PUBLIC_FACEBOOK_URL` | `https://www.facebook.com/share/18VemDPH5r/` |
| `NEXT_PUBLIC_TELEGRAM_URL` | `https://t.me/ISKULTRIP_SCANS` |

---

## Step 4: Deploy

1. Click **"Deploy"** on Vercel
2. Wait for the build to complete (usually 1-2 minutes)
3. Your site will be live at `https://your-app-name.vercel.app`

---

## Step 5: Firebase Console Setup (CRITICAL)

Before the admin panel works, you need to enable authentication in Firebase:

### Enable Email/Password Auth
1. Go to https://console.firebase.google.com
2. Select project **iskultrips**
3. Go to **Authentication** → **Sign-in method**
4. Enable **Email/Password**
5. Enable **Google** (optional, for users)

### Create Admin User
1. Go to **Authentication** → **Users**
2. Click **"Add user"**
3. Email: `bongmanga.official@gmail.com`
4. Set a strong password
5. Click **"Add user"**

### Set Firestore Rules
1. Go to **Firestore Database** → **Rules**
2. Paste the rules from `firestore.rules` file in the project
3. Click **"Publish"**

### Create Firestore Indexes (if needed)
If you see errors about missing indexes, Firebase Console will show links to create them. Just click those links.

---

## Step 6: Seed Demo Data (Optional)

The demo data has already been seeded! But if you need to re-seed:

```bash
# Run from project root
node scripts/seed-manga.js
```

---

## Verification Checklist

After deployment, verify these features:

- [ ] Site loads at your Vercel URL
- [ ] Home page shows manga cards (Solo Leveling, One Piece, etc.)
- [ ] Clicking a manga opens detail page with cover image and chapters
- [ ] Chapter links open in new tab (external site)
- [ ] Browse page with genre filters works
- [ ] Search functionality works
- [ ] Bookmarks work (after login)
- [ ] Admin login at `/admin/login` works with your admin email
- [ ] Admin panel shows manga management
- [ ] Facebook and Telegram links in Navbar/Footer work
- [ ] Share buttons on manga detail page work
- [ ] PWA install prompt appears on mobile
- [ ] Dark/Light theme toggle works

---

## Custom Domain (Optional)

To use a custom domain like `iskultrip.com`:

1. Go to Vercel Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records at your domain registrar
4. Update `NEXT_PUBLIC_SITE_URL` environment variable

---

## Troubleshooting

### Build Fails
- Check that all environment variables are set correctly in Vercel
- Check Vercel build logs for specific errors

### Admin Login Doesn't Work
- Make sure `NEXT_PUBLIC_ADMIN_EMAIL` matches your Firebase Auth user email
- Make sure Email/Password auth is enabled in Firebase Console
- Check browser console for errors

### Firestore Permission Denied
- Check Firestore rules are published
- Make sure you're logged in when trying to bookmark

### Images Don't Load
- The demo data uses external image URLs
- For production, upload images to Firebase Storage or use your own CDN
