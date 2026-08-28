/**
 * Optional LinkedIn fetch.
 *
 * To activate:
 *   1. Sign up for a LinkedIn-scraping provider (e.g. Proxycurl, RapidAPI's
 *      `linkedin-data` endpoints). They charge per call and respect rate limits.
 *   2. Set LINKEDIN_RAPIDAPI_KEY in .env.local.
 *   3. From a server component / route handler, call `fetchLinkedIn(url)` and
 *      map the result into the shape defined in `src/lib/data.ts`.
 *
 * Why this is optional:
 *   - LinkedIn's own site is hostile to scraping and will 999 / 403 most public
 *     IPs, so we keep the site shippable with a typed placeholder by default.
 *   - You almost always want to cache the response at build time (revalidate
 *     weekly) rather than hit the provider on every page load.
 */

import "server-only";

const ENDPOINT = "https://linkedin-data-scraper.p.rapidapi.com/person";

export type LinkedInPerson = {
  fullName: string;
  headline: string;
  summary?: string;
  location?: string;
  experiences?: Array<{
    companyName: string;
    title: string;
    startDate?: { year: number; month?: number };
    endDate?: { year: number; month?: number } | null;
    description?: string;
    location?: string;
  }>;
  skills?: string[];
  educations?: Array<{ schoolName: string; degreeName?: string; fieldOfStudy?: string }>;
};

export async function fetchLinkedIn(
  profileUrl: string,
): Promise<LinkedInPerson | null> {
  const key = process.env.LINKEDIN_RAPIDAPI_KEY;
  if (!key) return null;

  try {
    const res = await fetch(`${ENDPOINT}?url=${encodeURIComponent(profileUrl)}`, {
      headers: {
        "x-rapidapi-key": key,
        "x-rapidapi-host": "linkedin-data-scraper.p.rapidapi.com",
      },
      next: { revalidate: 60 * 60 * 24 * 7 },
    });
    if (!res.ok) return null;
    return (await res.json()) as LinkedInPerson;
  } catch {
    return null;
  }
}
