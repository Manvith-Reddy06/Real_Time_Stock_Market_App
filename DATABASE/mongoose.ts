//why are we doing this?
// every time nextjs hot reload it reinitializes the connection ...
// so we are storing the connection in a cached variable and storing the connection and reusing this
// write all the database initial connections code here tooo

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI

declare global{
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise : Promise <typeof mongoose> |null;
    }
}

let cached = global.mongooseCache;

//never connected
if(!cached){
    cached= global.mongooseCache={
        conn:null,
        promise: null
    }
};

export const connectToDatabase= async()=>{
    if(!MONGODB_URI) throw new Error('MONGODB_URI must be set within .env');

    if(cached.conn) return cached.conn;

    if(!cached.promise){
        //save in cached.promise
        cached.promise = mongoose.connect(MONGODB_URI,{bufferCommands:false});

    }
    try{
        cached.conn = await cached.promise;
    }catch(err){
        cached.promise=null;
        throw err;
    }

    
    console.log(`Connected to database ${process.env.NODE_ENV} ${MONGODB_URI}`);
    return cached.conn;
}
