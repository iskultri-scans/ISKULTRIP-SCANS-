import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://iskultrip.com';

  const staticPages = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/browse`, lastModified: new Date() },
    { url: `${baseUrl}/search`, lastModified: new Date() },
    { url: `${baseUrl}/dmca`, lastModified: new Date() },
  ];

  // Note: Dynamic manga pages would be added here when Firestore is connected
  // For now, return static pages
  return staticPages;
}
