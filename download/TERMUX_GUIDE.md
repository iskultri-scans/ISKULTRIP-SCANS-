# ISKULTRIP SCANS — Termux দিয়ে মোবাইলে GitHub সেটআপ

## 📱 সবচেয়ে সহজ উপায়: আমি সরাসরি push করে দিচ্ছি!

আপনার শুধু ২টি জিনিস দিতে হবে:
1. GitHub Personal Access Token
2. GitHub Repository URL

নিচের ধাপগুলো ফলো করুন →

---

## ধাপ ১: GitHub Account তৈরি (যদি না থাকে)

1. মোবাইল ব্রাউজারে https://github.com/signup যান
2. Username, Email, Password দিন
3. Email verify করুন

---

## ধাপ ২: GitHub-এ Repository তৈরি করুন

1. মোবাইল ব্রাউজারে https://github.com/new যান
2. **Repository name**: `iskultrip-scans`
3. **Public** সিলেক্ট করুন (Vercel এর দরকার)
4. ❌ "Add a README" — চেক করবেন না
5. **"Create repository"** ক্লিক করুন

---

## ধাপ ৩: Personal Access Token তৈরি করুন

1. মোবাইল ব্রাউজারে যান: https://github.com/settings/tokens
2. **"Generate new token"** → **"Generate new token (classic)"**
3. তথ্য দিন:
   - **Note**: `iskultrip-deploy`
   - **Expiration**: `No expiration` (বা 90 days)
   - **Scopes**: ✅ `repo` চেক করুন (পুরো section)
4. **"Generate token"** ক্লিক করুন
5. ⚠️ টোকেনটি কপি করে সেভ করুন — এটি আর কখনো দেখা যাবে না!

---

## ধাপ ৪: আমাকে দিন — আমি push করে দিচ্ছি!

আপনার শুধু এই ২টি জিনিস আমাকে পাঠান:

```
GitHub Token: ghp_xxxxxxxxxxxxxxxxxxxx
Repository:   https://github.com/YOUR_USERNAME/iskultrip-scans
```

আমি সরাসরি সার্ভার থেকে আপনার GitHub-এ push করে দেব!

---

## 🔧 Termux দিয়ে নিজে করতে চাইলে

### Termux ইনস্টল করুন

⚠️ **F-Droid থেকে ইনস্টল করুন, Play Store থেকে নয়!**
(Play Store version পুরানো এবং কাজ করে না)

1. https://f-droid.org/en/packages/com.termux/ যান
2. Download ও Install করুন

### Termux সেটআপ

```bash
# আপডেট ও আপগ্রেড
pkg update && pkg upgrade -y

# প্রয়োজনীয় packages ইনস্টল
pkg install git nodejs openssh -y

# Git কনফিগার
git config --global user.name "MD MEHADI HASAN"
git config --global user.email "bongmanga.official@gmail.com"
```

### GitHub Authentication সেটআপ

```bash
# Git credential helper সেট করুন
git config --global credential.helper store

# একটি test clone করুন — এখানে token চাইবে
# Username: আপনার GitHub username
# Password: আপনার Personal Access Token
git clone https://github.com/YOUR_USERNAME/iskultrip-scans.git
```

### প্রজেক্ট ক্লোন করে কাজ শুরু

```bash
# প্রজেক্ট ফোল্ডারে যান
cd iskultrip-scans

# নতুন ফাইল তৈরি করুন বা এডিট করুন
nano src/app/page.tsx

# পরিবর্তন কমিট করুন
git add .
git commit -m "নতুন পরিবর্তন"

# GitHub-এ push করুন
git push
```

### Termux-এ কোড এডিট করার টুলস

| টুল | ইনস্টল কমান্ড | ব্যবহার |
|------|---------------|---------|
| **nano** | `pkg install nano` | সহজ টেক্সট এডিটর |
| **vim** | `pkg install vim` | প্রফেশনাল এডিটর |
| **micro** | `pkg install micro` | মডার্ন টেক্সট এডিটর |

### Termux-এ Node.js রান করুন

```bash
# Node.js ইনস্টল
pkg install nodejs -y

# প্রজেক্ট ডিপেন্ডেন্সি ইনস্টল
npm install

# ডেভ সার্ভার চালান
npm run dev
```

⚠️ তবে Termux-এ Next.js dev server রান করা মোবাইলে ধীর হতে পারে।
Vercel-এ deploy করাই সবচেয়ে ভালো উপায়।

---

## 📋 দৈনিক কাজের রুটিন (Termux)

```bash
# প্রজেক্টে যান
cd iskultrip-scans

# সর্বশেষ কোড ডাউনলোড করুন
git pull

# কোড এডিট করুন
nano src/components/layout/Navbar.tsx

# পরিবর্তন দেখুন
git diff

# কমিট ও পুশ
git add .
git commit -m "Navbar updated"
git push
```

---

## 🔑 Termux Shortcuts

| কাজ | শর্টকাট |
|------|---------|
| Ctrl+C | চলমান প্রসেস বন্ধ |
| Ctrl+D | Termux বন্ধ |
| Volume Up + W | কার্সর Up |
| Volume Up + S | কার্সর Down |
| Volume Up + A | কার্সর Left |
| Volume Up + D | কার্সর Right |
| Volume Up + L | কার্সর End of line |

---

## ⚡ দ্রুত রেফারেন্স

| কাজ | কমান্ড |
|------|---------|
| নতুন ব্রাঞ্চ | `git checkout -b feature-name` |
| ব্রাঞ্চ পরিবর্তন | `git checkout main` |
| কমিট ইতিহাস | `git log --oneline` |
| শেষ কমিট বাতিল | `git reset --soft HEAD~1` |
| কোড ফিরিয়ে আনুন | `git checkout -- filename` |
| রিমোট দেখুন | `git remote -v` |
| ট্যাগ দিন | `git tag v1.0.0` |
