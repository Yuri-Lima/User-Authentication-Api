import mongoose from 'mongoose';
import config from 'config';
import { log, logfile } from './logger';

async  function connectToDb(MONGO_URI_LOCAL: string) {    
    try {
        if (process.env.NODE_ENV === 'development') {
            if(process.env.DEV_IS_DOCKER_SETUP === 'true') {
                const URI = `${process.env.MONGO_URI}`;
                const conn = await mongoose.connect(URI, {
                    appName: process.env.APP_NAME,
                    dbName: process.env.DEV_MONGO_DB_NAME,
                    autoCreate: true,// create the database if it does not exist
                    auth: {
                        username: process.env.DEV_MONGO_USER,
                        password: process.env.DEV_MONGO_PASSWORD
                    },
                    authMechanism: "DEFAULT",// "DEFAULT", "SCRAM-SHA-1", "MONGODB-CR", "PLAIN"
                    autoIndex: true,// disable automatic indexing 11000 duplicate key error using unique index
                    keepAlive: true,
                    serverApi: "1",//This is to make sure that the server is the latest version.
                    keepAliveInitialDelay: 300000,//300000 = 5 minutes
                    heartbeatFrequencyMS: 10000,//This is the frequency of the heartbeat.
                    minHeartbeatFrequencyMS: 5000,//This is the minimum heartbeat frequency.
                    tls: false,//This is to enable TLS.
                    enableUtf8Validation: true,//This is to enable UTF-8 validation.
                    zlibCompressionLevel: 8//This is to set the compression level.
                });
            
            log.info(`Connected to ${conn.STATES.connected} external DB, Colections: ${conn.modelNames()}`);
            log.info(`Disconnected to ${conn.STATES.disconnected} external DB`);
            logfile.info(`Connected to external ${URI}`);
            } else {
                const conn = await mongoose.connect(MONGO_URI_LOCAL, {
                    appName: process.env.APP_NAME,
                    dbName: process.env.DEV_MONGO_DB_NAME,
                    autoCreate: true,// create the database if it does not exist
                    auth: {
                        username: process.env.DEV_MONGO_USER,
                        password: process.env.DEV_MONGO_PASSWORD
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
                log.info(`Connected to local ${MONGO_URI_LOCAL}`);
                logfile.info(`Connected to local ${MONGO_URI_LOCAL}`);
            }
        }
        else if (process.env.NODE_ENV === 'production') {
            
        }
    } catch (error:any) {
        /**
         * Gracefully handle mongoose connection errors
         * @see https://mongoosejs.com/docs/guide.html#error-handling
         */
        log.error(`Error connecting to ${error.stack}`);
        logfile.error(`Error connecting to ${error}`);
    // process.exit(1);
    }
}
export default connectToDb;