import { validateDomainSyntax, validatePortClash, validatePathOverlap } from '../src/lib/mapping-validators';

test('validateDomainSyntax accepts valid domains', () => {
  expect(validateDomainSyntax('example.com')).toBe(true);
  expect(validateDomainSyntax('sub.example.co')).toBe(true);
});

test('validateDomainSyntax rejects invalid domains', () => {
  expect(validateDomainSyntax('invalid_domain')).toBe(false);
});

test('validatePortClash detects used port', () => {
  expect(validatePortClash(80, [80, 81])).toBe(false);
  expect(validatePortClash(82, [80, 81])).toBe(true);
});

test('validatePathOverlap detects duplicate path', () => {
  expect(validatePathOverlap('/api', ['/','/api'])).toBe(false);
  expect(validatePathOverlap('/new', ['/'])).toBe(true);
});
