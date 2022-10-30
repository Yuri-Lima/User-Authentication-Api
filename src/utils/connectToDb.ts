import mongoose,{Mongoose, Connection} from 'mongoose';
import config from 'config';
import { log, logfile } from './logger';

export type mongoCredentials ={
    user: string;
    password: string;
    mongo_uri: string;
    db_name: string;
    port?: number;
};

async  function connectToDb(cred: mongoCredentials) {    
    try {
            const conn = await mongoose.connect(cred.mongo_uri, {
                appName: process.env.NAME,
                dbName: cred.db_name,
                autoCreate: true,// create the database if it does not exist
                auth: {
                    username: cred.user,
                    password: cred.password
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
            return conn;
    } catch (error:any) {
        /**
         * Gracefully handle mongoose connection errors
         * @see https://mongoosejs.com/docs/guide.html#error-handling
         */
        // log.error(`Error connecting to ${error.stack}`);
        // logfile.error(`Error connecting to ${error}`);
        throw error;
        // process.exit(1);
    }
}
export default connectToDb;