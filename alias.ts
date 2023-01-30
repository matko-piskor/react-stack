import { resolve } from 'path';

const r = (p: string) => resolve(__dirname, p);

export const alias = {
    '~': r('./src'),
    '@': r('./tests'),
};
