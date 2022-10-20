import { Application, Request, Response, Express, Router } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import {version} from "../../package.json";
import { log, logfile } from "../utils/logger";
// const router = Router();

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "NodeJS API",
            version: version,
            description: "NodeJS API",
            contact: {
                name: "NodeJS API",
                url: "www.yurilima.uk",
                email: "y.m.lima19@gmail.com",
            },
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        servers: [
            {
                url: "https://auth.yurilima.uk/api-docs",
                description: "Development server",
            },
        ],
    },
    apis: ["./src/routes/*.ts", "./src/schema/*.ts"],
};
/**
 * Creates a swagger documentation for the API.
 */
const specs = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number, protocol: string, host:string, routeSwagger:Router): void {
    // Swagger UI route for the API documentation.
    const swaggerUiRoute = "docs";
    routeSwagger.get(`/${swaggerUiRoute}`, swaggerUi.serve, swaggerUi.setup(specs));
    
    // Swagger JSON route for the API documentation. Json Format.
    const swaggerJsonRoute = "docs.json";
    routeSwagger.get(`/${swaggerJsonRoute}`, (req: Request, res: Response) => {
        log.info("Swagger JSON route for the API documentation. Json Format.");
        res.setHeader("Content-Type", "application/json");
        res.send(specs);
    });
    log.info(`Swagger documentation available at ${protocol}://${host}:${port}/${swaggerUiRoute}`);
}

export default swaggerDocs;