'use server';

import { connectToDatabase } from '@/DATABASE/mongoose';

type NewsEmailUser = {
    _id: unknown;
    id: string;
    email: string;
    name: string;
    country?: string;
};

export const getAllUsersForNewsEmail = async (): Promise<NewsEmailUser[]> => {
    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error('Mongoose connection not connected');

        const users = await db
            .collection('user')
            .find(
                { email: { $exists: true, $ne: null } },
                {
                    projection: {
                        _id: 1,
                        id: 1,
                        email: 1,
                        name: 1,
                        country: 1,
                    },
                }
            )
            .toArray();

        return users as NewsEmailUser[];
    } catch (error) {
        console.error('Error fetching users from database', error);
        return [];
    }
};