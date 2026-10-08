import { describe, expect, it } from 'vitest';
import { scanText } from '@/lib/scan';

describe('scanText', () => {
  it.each([
    ['call 98765 43210', 'phone'], ['+91-9876543210', 'phone'], ['+91 98765 43210', 'phone'],
    ['href="https://github.com/witharyan/Nivaran"', 'old-nivaran-repo'], ['a Flutter app', 'flutter'],
    ['written in Dart', 'dart'], ['ported from', 'ported'], ['Tech Head', 'tech-head'], ['built in React Native', 'react-native'], ['a Mobile App', 'mobile-app'],
  ])('flags %s', (text, rule) => expect(scanText(text)).toContain(rule));

  it.each([
    'build 1784000000', 'sha a3f9c1e', '1730000000000', 'github.com/witharyan/NivaranRN', 'Vice President, GFG Campus Body RKGIT', 'Darth',
  ])('does not flag %s', (text) => expect(scanText(text)).toEqual([]));
});
