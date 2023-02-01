import { z } from 'zod';

export const formatErrors = (
    /** @type {import('zod').ZodFormattedError<Map<string,string>,string>} */
    errors: z.ZodFormattedError<Map<string, string>, string>,
) =>
    Object.entries(errors)
        .map(([name, value]) => {
            if (value && '_errors' in value) return `${name}: ${value._errors.join(', ')}\n`;
        })
        .filter(Boolean);

export const envSchema = z.object({
    VITE_COLOR_PRIMARY: z.string(),
});

const _env = envSchema.safeParse(import.meta.env);

if (!_env.success) {
    console.error('❌ Invalid environment variables:\n', ...formatErrors(_env.error.format()));
    throw new Error('Invalid environment variables');
}

export const env = _env.data;
