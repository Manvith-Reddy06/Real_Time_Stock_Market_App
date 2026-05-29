import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { connectToDatabase } from '@/DATABASE/mongoose'
import { nextCookies } from 'better-auth/next-js'


//sigleton instants - one instance that prevents multiple connections and improves performance
let authInstance: any = null; 

export const getAuth = async () => {
    if (authInstance) return authInstance;

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
 
    if (!db) throw new Error('MongoDB connection is not found');

    authInstance = betterAuth({  
        database: mongodbAdapter(db as any),
        secret: process.env.BETTER_AUTH_SECRET,
        baseURL: process.env.BETTER_AUTH_URL,
        emailAndPassword: {
            enabled: true,
            disableSignUp: false, 
            requireEmailVerification: false, 
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: true,
        },
        plugins: [nextCookies()],
    });

    return authInstance;
}

// 2. This retains strict autocompletion typing for your actions file!
export const auth = (await getAuth()) as ReturnType<typeof betterAuth>;