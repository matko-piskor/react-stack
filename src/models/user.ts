export async function getUserById(userId: string): Promise<{ id: string; name?: string }> {
    return new Promise((res) => {
        res({ id: userId, name: 'John Doe' });
    });
}

export type User = Awaited<ReturnType<typeof getUserById>> | null;
