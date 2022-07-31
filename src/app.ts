require("dotenv").config();
import http from "http";
import https from "https";
import express, { ErrorRequestHandler, Request, Response, NextFunction, RequestHandler, RequestParamHandler } from "express";
import config from "config";
import connectToDb from "./utils/connectToDb";
import { logDebug, loggerFile } from "./utils/logger";
import router from "./routes/index";
import {deserializeUser} from "./middleware/deserializeUser";
import {rules} from "./middleware/accessControlAllow";
import {createHttpErrorHandler} from "./middleware/errorHandler";

class App {
    public app: express.Application; // express application
    public server: http.Server | https.Server; // server

    /**
     * Constructor.
     */
    constructor() {
        this.app = express();
        this.middleware();
        this.routes();
        this.server = this.createServer();
    }

    private middleware(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(deserializeUser);
        this.app.use(rules);
    }

    private routes(): void {
        this.app.use(router);
        this.app.use(createHttpErrorHandler);
    }

    private createServer(): http.Server | https.Server {
        if (config.get("https.enabled")) {
            const httpsOptions = {
                key: "",
                cert: "",
                passphrase: "",
                rejectUnauthorized: false
            };
            return https.createServer(httpsOptions, this.app);
        }
        return http.createServer(this.app);
    }

    public async start(): Promise<void> {
        const MONGO_URI = <string>process.env.MONGO_URI_LOCAL;
        await connectToDb(MONGO_URI);
        this.server.listen(config.get("port"), () => {
            logDebug.info(`Server started on port ${config.get("port")}`);
            loggerFile.info(`Server started on port ${config.get("port")}`);
        }).on("error", (error: any) => {
            logDebug.error(`Error starting server ${error}`);
            loggerFile.info(`Error starting server ${error}`);
        }).on("listening", () => {
            logDebug.info(`Server listening on port ${config.get("port")}`);
            loggerFile.info(`Server listening on port ${config.get("port")}`);
        }).on("close", () => {
            logDebug.error(`Server closed`);
            logDebug.error(`Server closed`);
        })
    
    }
}   
            
            
            
// export default Set_Env(Object(process.env));
// const app = express(); // create express app
// const httpServer = http.createServer(app); // create http server
// const httpsServer = https.createServer(app); // create https server
/**
 * Url Encoded.
 */
// app.use(express.urlencoded({ extended: false })); // add url encoded to the application as middleware
/**
 * @description - Parsing application/json
 */
// app.use(express.json());
/**
 * @description - middleware to deserialize user from token
 */
// app.use(deserializeUser);
/**
 * Router of the application.
 */
// app.use(router);
/**
 * Rules of the application.
 */
// const rules= (req:Request, res:Response, next:NextFunction) => {
//     console.log("Rules of the application.");
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     if (req.method === "OPTIONS") {
//         res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
//         return res.status(200).json({}).on("finish", () => {
//             logDebug.debug(`${req.method} ${req.originalUrl} - ${res.statusCode}`);
//         });
//     }
//     return next();
// };
// app.use(rules); // add rules to the application as middleware

/**
 * Error Request Handler.
 */
// const createHttpErrorHandler = (req:Request, res:Response, next:NextFunction) => {
//     next(new httpErrorHandler.NotFound());  // create a new NotFound error
// }
// app.use(createHttpErrorHandler);
// const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
//     console.log("Error handler.");
//     res.status(err.status || 500)
//     res.send({
//             status: err.status || 500,
//             message: err.message || "Internal Server Error",
//     })
//     res.on("finish", () => {
//         logDebug.debug(`${req.method} ${req.originalUrl} - ${res.statusCode}`);
//     });
// };
// app.use(errorHandler); // add error handling to the application as middleware

// const HTTP_PORT = Boolean(process.env.TS_NODE_DEV)?process.env.HTTP_PORT:process.env.HTTPS_PORT;// get port from environment variables

/**
 * Start the server listening on port HTTP_PORT.
 * Connect to the database.
 * Set the development mode.
 * @param port - Port number.
 * @param callback - Callback function.
 * @returns - Promise.
 */
// httpServer.listen(HTTP_PORT, () => {
//     logDebug.info(`HTTP Server started on port ${HTTP_PORT}`);
//     let MONGO_URI = `${process.env.MONGO_URI_LOCAL}`;
//     connectToDb(MONGO_URI);
// });
// const HTTPS_PORT = process.env.HTTPS_PORT;
// httpsServer.listen(HTTPS_PORT, async () => {
//     logDebug.debug(`HTTPS Server started on port ${HTTPS_PORT}`);
//     connectToDb();
// });
