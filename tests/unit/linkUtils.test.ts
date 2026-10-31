import { describe, it, expect } from 'vitest';
import {
  ensureValidHref,
  detectPlatformName,
  extractCleanDomain,
  formatLinkDisplay,
  formatProjectLinkLabel,
  formatCertificationLinkLabel,
} from '../../src/lib/linkUtils';

describe('linkUtils - URL Masking & Safe Link Formatter', () => {
  describe('ensureValidHref', () => {
    it('prepends https:// when protocol is missing', () => {
      expect(ensureValidHref('linkedin.com/in/alexmorgan')).toBe('https://linkedin.com/in/alexmorgan');
      expect(ensureValidHref('github.com/alexmorgan')).toBe('https://github.com/alexmorgan');
      expect(ensureValidHref('alexmorgan.dev')).toBe('https://alexmorgan.dev');
    });

    it('preserves existing http://, https://, and mailto:', () => {
      expect(ensureValidHref('https://example.com')).toBe('https://example.com');
      expect(ensureValidHref('http://example.com')).toBe('http://example.com');
      expect(ensureValidHref('mailto:alex@example.com')).toBe('mailto:alex@example.com');
    });

    it('handles empty or whitespace inputs gracefully', () => {
      expect(ensureValidHref('')).toBe('');
      expect(ensureValidHref(null)).toBe('');
      expect(ensureValidHref(undefined)).toBe('');
      expect(ensureValidHref('   ')).toBe('');
    });
  });

  describe('detectPlatformName', () => {
    it('identifies LinkedIn profile URLs', () => {
      expect(detectPlatformName('https://www.linkedin.com/in/alex-morgan')).toBe('LinkedIn');
      expect(detectPlatformName('https://linkedin.com/in/alex')).toBe('LinkedIn');
    });

    it('identifies GitHub profile & repository URLs', () => {
      expect(detectPlatformName('https://github.com/alexmorgan')).toBe('GitHub');
    });

    it('identifies various social & tech platforms', () => {
      expect(detectPlatformName('https://x.com/alexmorgan')).toBe('X / Twitter');
      expect(detectPlatformName('https://twitter.com/alexmorgan')).toBe('X / Twitter');
      expect(detectPlatformName('https://leetcode.com/alex')).toBe('LeetCode');
      expect(detectPlatformName('https://dribbble.com/alex')).toBe('Dribbble');
      expect(detectPlatformName('https://medium.com/@alex')).toBe('Medium');
      expect(detectPlatformName('https://kaggle.com/alex')).toBe('Kaggle');
      expect(detectPlatformName('https://gitlab.com/alex')).toBe('GitLab');
    });

    it('returns null for generic websites', () => {
      expect(detectPlatformName('https://alexmorgan.dev')).toBeNull();
    });
  });

  describe('extractCleanDomain', () => {
    it('extracts clean domain without www and protocol', () => {
      expect(extractCleanDomain('https://www.example.com/about')).toBe('example.com');
      expect(extractCleanDomain('http://alexmorgan.dev')).toBe('alexmorgan.dev');
    });
  });

  describe('formatLinkDisplay', () => {
    it('masks full LinkedIn URL to "LinkedIn" by default', () => {
      const masked = formatLinkDisplay('https://www.linkedin.com/in/alex-morgan-lead-12345');
      expect(masked).toBe('LinkedIn');
    });

    it('masks full GitHub URL to "GitHub" by default', () => {
      const masked = formatLinkDisplay('https://github.com/alexmorgan-eng');
      expect(masked).toBe('GitHub');
    });

    it('prefers custom label when provided by the user', () => {
      const custom = formatLinkDisplay(
        'https://linkedin.com/in/alex',
        'LinkedIn',
        'My Profile'
      );
      expect(custom).toBe('My Profile');
    });

    it('falls back to fallbackLabel when provided for unknown platform', () => {
      const masked = formatLinkDisplay('https://alexmorgan.dev', 'Portfolio');
      expect(masked).toBe('Portfolio');
    });
  });

  describe('formatProjectLinkLabel', () => {
    it('detects GitHub repository links', () => {
      expect(formatProjectLinkLabel('https://github.com/org/repo')).toBe('GitHub');
    });

    it('detects live demo deployments', () => {
      expect(formatProjectLinkLabel('https://my-app.vercel.app')).toBe('Live Demo');
      expect(formatProjectLinkLabel('https://cool-project.netlify.app')).toBe('Live Demo');
    });

    it('defaults to View Project', () => {
      expect(formatProjectLinkLabel('https://my-api-system.internal')).toBe('View Project');
    });

    it('respects user custom project link label', () => {
      expect(formatProjectLinkLabel('https://github.com/org/repo', 'Live Architecture')).toBe('Live Architecture');
    });
  });

  describe('formatCertificationLinkLabel', () => {
    it('defaults to "Verify Credential"', () => {
      expect(formatCertificationLinkLabel('https://aws.amazon.com/verify/123')).toBe('Verify Credential');
    });

    it('respects custom certification label', () => {
      expect(formatCertificationLinkLabel('https://aws.amazon.com/verify/123', 'AWS Badge')).toBe('AWS Badge');
    });
  });
});
