import { resolve } from 'path';
var r = function (p) { return resolve(__dirname, p); };
export var alias = {
    '~': r('./src'),
    '@': r('./tests')
};
