/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { alias } from './alias';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000
    },
    build: {
        outDir: 'build'
    },
    resolve: {
        alias: alias
    },
    test: {
        include: ['./src/**/*.test.{ts,tsx}'],
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./tests/utils/test-setup.ts'],
        // globalSetup: ['./tests/utils/test-globals.ts'],
        // you might want to disable it, if you don't have tests that rely on CSS
        // since parsing CSS is slow
        css: true
    }
});
