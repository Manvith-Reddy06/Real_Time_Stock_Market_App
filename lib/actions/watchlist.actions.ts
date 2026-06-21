'use server';

import { connectToDatabase } from '@/DATABASE/mongoose';
import { Watchlist } from '@/DATABASE/models/watchlist.model';

export const getWatchlistSymbolsByEmail = async (
    email: string
): Promise<string[]> => {
    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;

        if (!db) throw new Error('MongoDB connection not found');

        const user = await db.collection('user').findOne(
            { email },
            { projection: { id: 1 } }
        );

        if (!user?.id) return [];

        const watchlistItems = await Watchlist.find({ userId: user.id })
            .select('symbol')
            .lean<{ symbol: string }[]>();

        return watchlistItems.map((item) => item.symbol);
    } catch (error) {
        console.error('Error fetching watchlist symbols by email:', error);
        return [];
    }
};
