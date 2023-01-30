import { capitalize, stripLeadingSlash } from '../src/utils/string';

test('Text should be capitalized', () => {
    const text = 'abc';

    expect(capitalize(text)).toBe('Abc');
});

test('Text should strip leading slash', () => {
    const text = '/abc';
    expect(stripLeadingSlash(text)).toBe('abc');

    const text2 = 'abc';
    expect(stripLeadingSlash(text2)).toBe('abc');

    const text3 = '/abc/';
    expect(stripLeadingSlash(text3)).toBe('abc/');

    const text4 = 'abc/';
    expect(stripLeadingSlash(text4)).toBe('abc/');

    const text5 = '/';
    expect(stripLeadingSlash(text5)).toBe('');

    const text6 = '';
    expect(stripLeadingSlash(text6)).toBe('');

    const text7 = '////';
    expect(stripLeadingSlash(text7)).toBe('');
});
