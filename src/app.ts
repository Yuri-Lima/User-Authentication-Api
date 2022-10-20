require("dotenv").config();
import http from "http";
import https from "https";
import express, { ErrorRequestHandler, Request, Response, NextFunction, RequestHandler, RequestParamHandler, Express, Router } from "express";
import path, { join, resolve } from "node:path";
import connectToDb from "./utils/connectToDb";
import { log, logfile } from "./utils/logger";
import router from "./routes/index";
import {deserializeUser} from "./middleware/deserializeUser";
import {rules} from "./middleware/accessControlAllow";
import {createHttpErrorHandler} from "./middleware/errorHandler";
import {JsonToEnv, Options_Set_Env, Set_Env} from "dynamic.envs";

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
    public node_env: boolean;

    /**
     * Constructor.
     */
    constructor() {
        this.node_env = process.env.NODE_ENV==="development"?true:false;
        this.createEnvFile();
        this.setupEnv();
        this.app = express();
        this.middleware();
        this.routes();
        this.server = this.createServer();
    }

    private createEnvFile(): void {
        const fileName = "env.ts"; 
        const set:Set_Env = {
            fileName: fileName,
            filePath: join(process.cwd(), "src", fileName),
        };
        const options:Options_Set_Env ={
            test: false,
            updateNewJsonFile: false, // If you want to create a new json file, set this to true
            createNewEnvFile: true, // If you want to create a new env file, set this to true
            useCache: false // If you want to use the cache to compare the previous json file and the new json file
        }
        const setEnv = new JsonToEnv(set, options);
        setEnv.setEnv();
    }

    private setupEnv(): void {
        if(this.node_env){//Production mode
            this.is_docker_setup = Boolean(process.env.DEV_IS_DOCKER_SETUP==="false"?false:true);
            if (this.is_docker_setup) {
                console.log(`DOCKER is SETUP`);
                this.host = process.env.DEV_HOST?process.env.DEV_HOST:"localhost";
                this.protocol = process.env.DEV_DOCKER_TLS_SSL==="true"?"https":"http";
                this.port = this.protocol==="https"?Number(process.env.DEV_DOCKER_HTTPS_PORT):Number(process.env.DEV_DOCKER_HTTP_PORT);
                return;
            }
        }
        //LOCAL mode
        console.log("LOCAL is SETUP");
        this.protocol = process.env.DEV_DOCKER_TLS_SSL==="true"?"https":"http";
        this.port = this.protocol==="https"?Number(process.env.DEV_HTTPS_PORT):Number(process.env.DEV_HTTP_PORT);
        return;      
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
        const MONGO_URI = <string>process.env.DEV_MONGO_URI;
        await connectToDb(MONGO_URI);
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