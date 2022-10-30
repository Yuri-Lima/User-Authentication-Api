require("dotenv").config();
import http from "http";
import https from "https";
import express, { ErrorRequestHandler, Request, Response, NextFunction, RequestHandler, RequestParamHandler, Express, Router } from "express";
import connectToDb from "./utils/connectToDb";
import { log, logfile } from "./utils/logger";
import router from "./routes/index";
import {deserializeUser} from "./middleware/deserializeUser";
import {rules} from "./middleware/accessControlAllow";
import {createHttpErrorHandler} from "./middleware/errorHandler";
import { mongoCredentials } from "./utils/connectToDb"

/**
 * @shortDescription - This is the main Class of the application
 * @class App
 * @implements {express.Application}
 * @implements {http.Server}
 * @implements {https.Server}
 */

export default class App {
    public app: Express; // express application
    public router: Router;
    public server: http.Server | https.Server; // server
    public env: {} | [];
    public port: number; // port
    public protocol: string;
    public host: string;
    public db_credentials: mongoCredentials = {
        mongo_uri: <string>process.env.MONGO_URI,
        user: <string>process.env.MONGO_INITDB_ROOT_USERNAME,
        password: <string>process.env.MONGO_INITDB_ROOT_PASSWORD,
        db_name: <string>process.env.DB_NAME,
        port: Number(process.env.PORT)
    }
    /**
     * Constructor.
     */
    constructor() {
        this.setupEnv();
        this.app = express();
        this.middleware();
        this.routes();
        this.server = this.createServer();
    }

    private setupEnv(): void {
        this.host = process.env.APP_HOST || "localhost";
        this.protocol = process.env.TLS_SSL || "http";
        this.port = Number(process.env.PORT) || Number(process.env.APP_DOCKER_HTTP_PORT) || 3000;
        if(process.env.DEBUG==="true") {
            //LOCAL mode
            // log.info("LOCAL is SETUP");
            // this.protocol = process.env.DEV_DOCKER_TLS_SSL==="true"?"https":"http";
            // this.port = this.protocol==="https"?Number(process.env.DEV_HTTPS_PORT):Number(process.env.DEV_HTTP_PORT);
            // return;  
        }  
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
        if (this.protocol==="https") {
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
        try {
            const conn = await connectToDb(this.db_credentials);
            this.server.listen(this.port, () => {
                log.info(`Server started on port ${this.port} on protocol ${this.protocol}`);
            }).on("error", (error: any) => {
                log.error(`Error starting server ${error}`);
            }).on("listening", () => {
                log.info(`Server listening on port ${this.port} on protocol ${this.protocol}`);
            }).on("close", () => {
                conn?.connection.close(() => {
                    log.info("Connection Mongoose closed");
                });
                log.error(`Server closed`);
            })
        } catch (error: any) {
            log.error(error);
            this.server.close();
        }
    }
}

const start = new App();

(async () => {
    await start.start();
})()