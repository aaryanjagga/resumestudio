/**
 * Link masking and formatting utilities for Resume Studio.
 * Ensures clean, masked anchor labels on resumes (e.g. "LinkedIn", "GitHub", "Portfolio", "View Project")
 * while linking to full valid destination URLs.
 */

export function ensureValidHref(rawUrl?: string | null): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function detectPlatformName(url: string): string | null {
  if (!url) return null;
  const lower = url.toLowerCase();

  if (lower.includes('linkedin.com')) return 'LinkedIn';
  if (lower.includes('github.com')) return 'GitHub';
  if (lower.includes('gitlab.com')) return 'GitLab';
  if (lower.includes('bitbucket.org')) return 'Bitbucket';
  if (lower.includes('twitter.com') || lower.includes('x.com')) return 'X / Twitter';
  if (lower.includes('leetcode.com')) return 'LeetCode';
  if (lower.includes('hackerrank.com')) return 'HackerRank';
  if (lower.includes('codeforces.com')) return 'Codeforces';
  if (lower.includes('kaggle.com')) return 'Kaggle';
  if (lower.includes('medium.com')) return 'Medium';
  if (lower.includes('substack.com')) return 'Substack';
  if (lower.includes('dev.to')) return 'Dev.to';
  if (lower.includes('dribbble.com')) return 'Dribbble';
  if (lower.includes('behance.net')) return 'Behance';
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'YouTube';
  if (lower.includes('stackoverflow.com')) return 'Stack Overflow';
  if (lower.includes('producthunt.com')) return 'Product Hunt';
  if (lower.includes('figma.com')) return 'Figma';
  if (lower.includes('notion.site') || lower.includes('notion.so')) return 'Notion';
  if (lower.includes('npmjs.com') || lower.includes('npm.im')) return 'npm';
  if (lower.includes('hashnode.dev') || lower.includes('hashnode.com')) return 'Hashnode';

  return null;
}

export function extractCleanDomain(url: string): string {
  if (!url) return '';
  try {
    const href = ensureValidHref(url);
    const parsed = new URL(href);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] || url;
  }
}

/**
 * Returns clean masked label to display on the resume.
 * e.g. "LinkedIn" instead of "https://linkedin.com/in/alex-morgan"
 */
export function formatLinkDisplay(
  url?: string | null,
  fallbackLabel?: string,
  customLabel?: string
): string {
  if (customLabel && customLabel.trim().length > 0) {
    return customLabel.trim();
  }

  if (!url || !url.trim()) {
    return fallbackLabel || 'Link';
  }

  const detected = detectPlatformName(url);
  if (detected) {
    return detected;
  }

  if (fallbackLabel && fallbackLabel.trim().length > 0) {
    return fallbackLabel.trim();
  }

  const domain = extractCleanDomain(url);
  return domain || 'Website';
}

/**
 * Returns masked label for project links.
 * Defaults to "GitHub", "Live Demo", or "View Project".
 */
export function formatProjectLinkLabel(url?: string | null, customLabel?: string): string {
  if (customLabel && customLabel.trim().length > 0) {
    return customLabel.trim();
  }

  if (!url || !url.trim()) {
    return 'View Project';
  }

  const lower = url.toLowerCase();
  if (lower.includes('github.com')) return 'GitHub';
  if (lower.includes('gitlab.com')) return 'GitLab';
  if (
    lower.includes('demo') ||
    lower.includes('vercel.app') ||
    lower.includes('netlify.app') ||
    lower.includes('fly.dev') ||
    lower.includes('render.com') ||
    lower.includes('app.')
  ) {
    return 'Live Demo';
  }

  return 'View Project';
}

/**
 * Returns masked label for certification verification links.
 * Defaults to "Verify Credential".
 */
export function formatCertificationLinkLabel(url?: string | null, customLabel?: string): string {
  if (customLabel && customLabel.trim().length > 0) {
    return customLabel.trim();
  }
  return 'Verify Credential';
}
