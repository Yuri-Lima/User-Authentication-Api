require("dotenv").config();
import http from "http";
import https from "https";
import express, { ErrorRequestHandler, Request, Response, NextFunction, RequestHandler, RequestParamHandler, Express, Router } from "express";
import { join } from "node:path";
import connectToDb from "./utils/connectToDb";
import { log, logfile } from "./utils/logger";
import router from "./routes/index";
import {deserializeUser} from "./middleware/deserializeUser";
import {rules} from "./middleware/accessControlAllow";
import {createHttpErrorHandler} from "./middleware/errorHandler";
import {JsonToEnv, Options_Set_Env, Set_Env} from "dynamic.envs";
import { mongoCredentials } from "./utils/connectToDb"
import { existsSync } from "node:fs"
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
    public is_docker_setup: boolean;
    public env: {} | [];
    public port: number; // port
    public protocol: string;
    public host: string;
    public node_env: boolean = true;

    /**
     * Constructor.
     */
    constructor() {
        this.createEnvFile();
        this.setupEnv();
        this.app = express();
        this.middleware();
        this.routes();
        this.server = this.createServer();
    }

    private createEnvFile(): void {
        /**
         * @shortDescription - This function creates the .env file
         * Only for development mode
         * If the .env file is not present
         * If you run the application in production mode the dist folder will have issues
         * If you run the application in production mode on Docker the dist folder will have issues
         */
        // console.log(`NODE_ENV: ${existsSync(join(process.cwd(), "src", "env.json"))}`);
        if(existsSync(join(process.cwd(), "src", "env.json")) || existsSync(join(process.cwd(), "env.json"))) {
                const fileName = "env.json";
                const set:Set_Env = {
                    fileName: fileName,
                    readFileFrom: join(process.cwd(), "src"),
                    saveFileTo: join(process.cwd(), fileName)
                };
                const options:Options_Set_Env ={
                    overWrite_Original_Env: true, // if you dont want to overwrite your original .env file, set this to true
                    createJsonFile: true, // If you want to create a new json file, set this to true
                    createEnvFile: true, // If you want to create a new env file, set this to true
                    log: false // If you want to log the result, set this to true
                }
                const setEnv = new JsonToEnv(set, options);
                setEnv.setEnv();
        }
    }

    private setupEnv(): void {
        this.is_docker_setup = Boolean(process.env.PROD_IS_DOCKER_SETUP==="false"?false:true);
        if (process.env.NODE_ENV === "production") {
            log.info("PRODUCTION MODE");
            if (this.is_docker_setup) {
                console.log(`DOCKER is SETUP on PRODUCTION MODE`);
                this.host = process.env.PROD_HOST?process.env.PROD_HOST:"localhost";
                this.protocol = process.env.PROD_DOCKER_TLS_SSL==="true"?"https":"http";
                this.port = this.protocol==="https"?Number(process.env.PROD_DOCKER_HTTPS_PORT):Number(process.env.PROD_DOCKER_HTTP_PORT);
                return;
            }
        }
        else if (process.env.NODE_ENV === "development") {
            log.info("DEVELOPMENT MODE");
            if (this.is_docker_setup) {
                log.info(`DOCKER is SETUP on DEVELOPMENT MODE`);
                this.host = process.env.DEV_HOST?process.env.DEV_HOST:"localhost";
                this.protocol = process.env.DEV_DOCKER_TLS_SSL==="true"?"https":"http";
                this.port = this.protocol==="https"?Number(process.env.DEV_DOCKER_HTTPS_PORT):Number(process.env.DEV_DOCKER_HTTP_PORT);
                return;
            }
        }
        if(process.env.DEBUG==="true" && process.env.NODE_ENV==="development") {
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
        const value = this.protocol==="https"?true:false;
        if (value) {
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
        let credentials:mongoCredentials={ user: "", password: "", mongo_uri: "", db_name: "" };
        if(this.node_env){
            credentials.mongo_uri = <string>process.env.MONGO_URI;
            credentials.user = <string>process.env.PROD_MONGO_USER;
            credentials.password = <string>process.env.PROD_MONGO_PASSWORD;
            credentials.port = Number(process.env.PROD_MONGO_PORT);
            credentials.db_name = <string>process.env.PROD_MONGO_DB_NAME;
        }
        else{
            credentials.mongo_uri = <string>process.env.MONGO_URI;
            credentials.user = <string>process.env.DEV_MONGO_USER;
            credentials.password = <string>process.env.DEV_MONGO_PASSWORD;
            credentials.port = Number(process.env.DEV_MONGO_PORT);
            credentials.db_name = <string>process.env.DEV_MONGO_DB_NAME;
        }
        await connectToDb(credentials);
        this.server.listen(this.port, () => {
            log.info(`Server started on port ${this.port} on protocol ${this.protocol}`);
        }).on("error", (error: any) => {
            log.error(`Error starting server ${error}`);
            logfile.info(`Error starting server ${error}`);
        }).on("listening", () => {
            log.info(`Server listening on port ${this.port} on protocol ${this.protocol}`);
        }).on("close", () => {
            log.error(`Server closed`);
            logfile.error(`Server closed`);
        })
    }
}

const start = new App();

(async () => {
    await start.start();
})()