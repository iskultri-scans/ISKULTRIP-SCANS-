import { getAdminAuth } from './firebase-admin';

export async function verifyAdminSession(idToken: string): Promise<boolean> {
  try {
    const decodedToken = await getAdminAuth().verifyIdToken(idToken);
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    return decodedToken.email === adminEmail;
  } catch {
    return false;
  }
}

export async function createSessionCookie(idToken: string): Promise<string> {
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  return getAdminAuth().createSessionCookie(idToken, { expiresIn });
}

export async function verifySessionCookie(sessionCookie: string): Promise<boolean> {
  try {
    const decodedClaims = await getAdminAuth().verifySessionCookie(sessionCookie, true);
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    return decodedClaims.email === adminEmail;
  } catch {
    return false;
  }
}
