import { Router, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import {version} from "../../package.json";
import { log, logfile } from "../utils/logger";
import swaggerDocs from "../utils/swagger";

const router = Router();

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Authetication API",
            version: version,
            description: "API - Container for Authetication:<br>\
            1. Register a user<br>\
            2. Verify user's email address<br>\
            3. Send forgot password email<br>\
            4. Reset password<br>\
            5. Get current user<br>\
            6. Login<br>\
            7. Access token<br>\
            8. Refresh tokens<br>",
            contact: {
                name: "Yuri Lima",
                url: "https://www.linkedin.com/in/yuri-matos-de-lima/",
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
                url: "https://auth.yurilima.uk/",
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

// Swagger UI route for the API documentation.
const swaggerUiRoute = "api/docs";
router.use(`/${swaggerUiRoute}`, swaggerUi.serve, swaggerUi.setup(specs));

// Swagger JSON route for the API documentation. Json Format.
const swaggerJsonRoute = "api/docs.json";
router.get(`/${swaggerJsonRoute}`, (req: Request, res: Response) => {
    log.info("Swagger JSON route for the API documentation. Json Format.");
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
});


export default router;