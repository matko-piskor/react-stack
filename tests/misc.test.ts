import { DEFAULT_REDIRECT, isUser, safeRedirect } from '~/utils/misc';

test('safeRedirect', () => {
    expect(safeRedirect('/login')).toBe('/login');
    expect(safeRedirect('')).toBe(DEFAULT_REDIRECT);
    expect(safeRedirect('http://example.com')).toBe(DEFAULT_REDIRECT);
    expect(safeRedirect('//example.com')).toBe(DEFAULT_REDIRECT);
    expect(safeRedirect('https://example.com')).toBe(DEFAULT_REDIRECT);
    expect(safeRedirect(null)).toBe(DEFAULT_REDIRECT);
    expect(safeRedirect(undefined)).toBe(DEFAULT_REDIRECT);
    expect(safeRedirect('http://example.com', 'http://example.com')).toBe('http://example.com');
});

test('isUser', () => {
    expect(isUser({ id: '1' })).toBe(true);
    expect(isUser({ id: 1 })).toBe(false);
});
