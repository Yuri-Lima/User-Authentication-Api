import mongoose from 'mongoose';
import config from 'config';
import { logDebug, loggerFile } from './logger';

async  function connectToDb(MONGO_URI_LOCAL: string) {    
    try {
        if (process.env.NODE_ENV === 'production') {
            const URI = `${process.env.MONGO_URI}`;
            const conn = await mongoose.connect(URI);
            
            logDebug.info(`Connected to external ${conn.STATES}`);
            loggerFile.db(`Connected to external ${URI}`);
        }
        else if (process.env.NODE_ENV === 'development') {
            const conn = await mongoose.connect(MONGO_URI_LOCAL, {
                appName: "NodeApp",
                dbName: "Uatiz",
                autoCreate: true,// create the database if it does not exist
                auth: {
                    username: "yurilima",
                    password: "Laura2020"
                },
                authMechanism: "DEFAULT",// "DEFAULT", "SCRAM-SHA-1", "MONGODB-CR", "PLAIN"
                autoIndex: false,// disable automatic indexing
                keepAlive: true,
                serverApi: "1",//This is to make sure that the server is the latest version.
                keepAliveInitialDelay: 300000,//300000 = 5 minutes
                heartbeatFrequencyMS: 10000,//This is the frequency of the heartbeat.
                minHeartbeatFrequencyMS: 5000,//This is the minimum heartbeat frequency.
                tls: false,//This is to enable TLS.
                enableUtf8Validation: true,//This is to enable UTF-8 validation.
                zlibCompressionLevel: 8//This is to set the compression level.
            });
            logDebug.info(`Connected to local ${MONGO_URI_LOCAL}`);
            loggerFile.db(`Connected to local ${MONGO_URI_LOCAL}`);
        }
    } catch (error:any) {
        /**
         * Gracefully handle mongoose connection errors
         * @see https://mongoosejs.com/docs/guide.html#error-handling
         */
        logDebug.error(`Error connecting to ${error}`);
        loggerFile.db(`Error connecting to ${error}`);
        // process.exit(1);
    }
}
export default connectToDb;