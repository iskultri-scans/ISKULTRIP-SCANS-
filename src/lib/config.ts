// Site-wide configuration constants

export const SITE_CONFIG = {
  name: 'ISKULTRIP SCANS',
  creator: 'MD MEHADI HASAN',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://iskultrip-scans.vercel.app',
  description: 'বাংলায় মাঙ্গা অনুবাদের সেরা ঠিকানা — Your gateway to manga in Bengali. Browse, discover, and read.',

  // Social Media Links
  social: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/iskultripscans',
    telegram: process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/iskultripscans',
  },

  // Admin
  adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'mdhasan@example.com',
};
