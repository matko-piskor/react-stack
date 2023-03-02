import { json, Outlet, ScrollRestoration, type LoaderFunctionArgs } from 'react-router-dom';
import { getUserById } from '~/models/user';
import { safeRedirect } from '~/utils/misc';

// Replace these with your own authentication library
const authenticator = {
    isAuthenticated: async (_request: Request) => {
        // This is where you would check if the user is authenticated.
        return 'some-user-id';
    },
    logout: async (_request: Request, options: { redirectTo: string }) => {
        // This is where you would log the user out.
        safeRedirect(options.redirectTo);
    },
};

export async function rootLoader({ request }: LoaderFunctionArgs) {
    const userId = await authenticator.isAuthenticated(request);

    let user: Awaited<ReturnType<typeof getUserById>> | null = null;
    if (userId) {
        user = await getUserById(userId);
        if (!user) {
            console.log('something weird happened');
            // something weird happened... The user is authenticated but we can't find
            // them in the database. Maybe they were deleted? Let's log them out.
            await authenticator.logout(request, { redirectTo: '/' });
        }
    }

    return json({ user });
}

export default function Root() {
    return (
        <>
            <Outlet />
            <ScrollRestoration />
        </>
    );
}
