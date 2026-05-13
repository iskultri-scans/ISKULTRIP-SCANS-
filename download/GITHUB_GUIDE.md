# ISKULTRIP SCANS — GitHub এ কোড নেওয়ার গাইড

## পদ্ধতি ১: GitHub ওয়েবসাইট থেকে (সবচেয়ে সহজ)

### ধাপ ১: GitHub-এ Repository তৈরি করুন

1. https://github.com এ যান এবং Login করুন
2. ডানদিকের উপরে **"+"** বাটনে ক্লিক করুন → **"New repository"**
3. Repository এর তথ্য দিন:
   - **Repository name**: `iskultrip-scans`
   - **Description**: `ISKULTRIP SCANS - Manga Directory Website`
   - **Visibility**: Public (Vercel deploy করতে) অথবা Private (শুধু আপনার জন্য)
   - ❌ **"Add a README file"** — চেক করবেন না (আমাদের কোড আছে)
   - ❌ **".gitignore"** — চেক করবেন না (আমাদের আছে)
   - ❌ **"License"** — চেক করবেন না
4. **"Create repository"** বাটনে ক্লিক করুন

### ধাপ ২: আপনার কোড GitHub-এ পুশ করুন

Repository তৈরি হলে, আপনি একটি পেজ দেখবেন যেখানে কিছু কমান্ড দেওয়া আছে।
নিচের কমান্ডগুলো **আপনার কম্পিউটারের টার্মিনালে** রান করুন:

```bash
# আপনার প্রজেক্ট ফোল্ডারে যান
cd /home/z/my-project

# GitHub-কে আপনার remote হিসেবে যোগ করুন
# ⚠️ YOUR_USERNAME এর জায়গায় আপনার GitHub username দিন
git remote add origin https://github.com/YOUR_USERNAME/iskultrip-scans.git

# বর্তমান branch-এর নাম নিশ্চিত করুন
git branch -M main

# কোড GitHub-এ পুশ করুন
git push -u origin main
```

এই কমান্ড রান করলে GitHub আপনার username ও password (বা Personal Access Token) চাইবে।

---

## ⚠️ গুরুত্বপূর্ণ: GitHub Authentication

GitHub এখন password authentication সাপোর্ট করে না। আপনাকে **Personal Access Token (PAT)** ব্যবহার করতে হবে:

### Personal Access Token তৈরি করুন:

1. GitHub-এ যান → ডানদিকের উপরে আপনার profile picture → **Settings**
2. বামদিকের মেনু থেকে নিচে **"Developer settings"**
3. **"Personal access tokens"** → **"Tokens (classic)"**
4. **"Generate new token"** → **"Generate new token (classic)"**
5. তথ্য দিন:
   - **Note**: `ISKULTRIP SCANS Deploy`
   - **Expiration**: `90 days` অথবা `No expiration`
   - **Scopes**: ✅ `repo` (পুরো repo section চেক করুন)
6. **"Generate token"** ক্লিক করুন
7. ⚠️ টোকেনটি **কপি করে সেভ করুন** — এটি আবার দেখা যাবে না!

### Push করার সময়:
- Username: আপনার GitHub username
- Password: আপনার Personal Access Token (GitHub password নয়!)

---

## পদ্ধতি ২: GitHub CLI দিয়ে (দ্রুত পদ্ধতি)

যদি আপনার কম্পিউটারে `gh` CLI ইনস্টল করা থাকে:

```bash
# GitHub-এ login করুন
gh auth login

# Repository তৈরি করুন এবং কোড পুশ করুন একসাথে
cd /home/z/my-project
gh repo create iskultrip-scans --public --source=. --push

# একটি কমান্ডেই হয়ে যাবে!
```

---

## ভার্সন কন্ট্রোল কিভাবে করবেন

### প্রতিদিন কাজ শেষে কমিট করুন:

```bash
# কোন ফাইল পরিবর্তন হয়েছে দেখুন
git status

# সব পরিবর্তিত ফাইল যোগ করুন
git add .

# কমিট করুন (কি পরিবর্তন করেছেন তা লিখুন)
git commit -m "নতুন ফিচার যোগ করা হয়েছে"

# GitHub-এ পুশ করুন
git push
```

### ভার্সন ট্যাগ দিন (রিলিজ ট্র্যাক করতে):

```bash
# v1.0.0 ট্যাগ দিন
git tag -a v1.0.0 -m "প্রথম রিলিজ - ISKULTRIP SCANS"

# ট্যাগ GitHub-এ পুশ করুন
git push origin v1.0.0
```

### নতুন ফিচার ব্রাঞ্চে কাজ করুন:

```bash
# নতুন ব্রাঞ্চ তৈরি করুন
git checkout -b feature/chapter-comments

# কাজ করুন... কমিট করুন...
git add .
git commit -m "Chapter comments feature added"

# GitHub-এ পুশ করুন
git push -u origin feature/chapter-comments

# কাজ শেষ হলে main ব্রাঞ্চে মার্জ করুন
git checkout main
git merge feature/chapter-comments
git push
```

### ভুল করে কোড মুছে ফেললে ফিরিয়ে আনুন:

```bash
# সব কমিট দেখুন
git log --oneline

# নির্দিষ্ট কমিটে ফিরে যান
git checkout abc1234

# অথবা শেষ কমিট বাতিল করুন (ফাইল রাখুন)
git reset --soft HEAD~1

# অথবা শেষ কমিট সম্পূর্ণ মুছে ফেলুন
git reset --hard HEAD~1
```

---

## ⚠️ নিরাপত্তা চেকলিস্ট

পুশ করার আগে নিশ্চিত করুন:

- [x] `.env.local` GitHub-এ push হচ্ছে না (`.gitignore`-এ আছে)
- [x] Firebase private key GitHub-এ expose হচ্ছে না
- [x] `.env.example` template আছে (secrets ছাড়া)
- [ ] যদি ভুলে কোনো secret push হয়ে যায়:
  1. তাড়াতাড়ি Firebase Console থেকে key রিজেনারেট করুন
  2. `git filter-branch` বা BFG Repo-Cleaner দিয়ে history থেকে মুছুন

---

## Vercel-এ Deploy করুন (GitHub থেকে)

1. https://vercel.com/new এ যান
2. **"Import Git Repository"** ক্লিক করুন
3. আপনার `iskultrip-scans` repository সিলেক্ট করুন
4. Environment Variables যোগ করুন (`.env.local` এর সব variables)
5. **"Deploy"** ক্লিক করুন

এরপর যখনই আপনি GitHub-এ কোড push করবেন, Vercel অটোমেটিক রিডিপ্লয় করবে!
