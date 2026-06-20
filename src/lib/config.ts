// Site-wide configuration constants
import { SITE_URL } from './site-url';

export const SITE_CONFIG = {
  name: 'ISKULTRIP SCANS',
  creator: 'MD MEHADI HASAN',
  url: SITE_URL,
  description: 'বাংলায় মাঙ্গা অনুবাদের সেরা ঠিকানা — Your gateway to manga in Bengali. Browse, discover, and read.',

  // Social Media Links
  social: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/iskultripscans',
    telegram: process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/iskultripscans',
  },

  // Admin
  adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'bongmanga.official@gmail.com',
};
