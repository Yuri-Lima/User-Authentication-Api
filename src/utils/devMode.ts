import { log, logfile } from "./logger";


export const devMode = (mode: Boolean) => {
    if (mode) {
        log.info("Development mode is ON");
        return true;
    } else {
        log.info("Production mode is ON");
        return false
    }
};
export interface Env {
    // App Local Settings
    HTTP_PORT: number;
    HTTPS_PORT: number;
    TS_NODE_DEV: boolean;
    NODE_ENV: string;

    // Node Docker Settings
    NODE_DOCKER_CONTAINER_NAME: string;
    NODE_DOCKER_APP_NAME: string;
    NODE_DOCKER_ENV: string;
    NODE_DOCKER_PORT: number;
    NODE_DOCKER_NETWORK_NAME: string;

    // Logger Settings
    LOG_LEVEL: string;

    // Mongo Local Settings
    MONGO_URI_LOCAL: string;

    // Mongo Docker Settings
    MONGO_DOCKER_USER: string;
    MONGO_DOCKER_PASSWORD: string;
    MONGO_DOCKER_PORT: number;
    MONGO_DOCKER_CONTAINER_NAME: string;
    MONGO_DOCKER_DB_NAME: string;

    // Mongo Express Docker Settings
    MONGO_EXPRESS_DOCKER_CONTAINER_NAME: string;
    MONGO_EXPRESS_DOCKER_PORT: number;
    MONGO_EXPRESS_DOCKER_USER: string;
    MONGO_EXPRESS_DOCKER_PASSWORD: string;

    // SMTP Settings
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_SECURE: boolean;
    SMTP_USER: string;
    SMTP_PASSWORD: string;

    // SMTP Docker Settings
    SMTP_DOCKER_HOST: string;
    SMTP_DOCKER_PORT: number;
    SMTP_DOCKER_SECURE: boolean;
    SMTP_DOCKER_USER: string;
    SMTP_DOCKER_PASSWORD: string;

    // Private key for JWT
    JWT_PRIVATE_KEY: string;
    JWT_PRIVATE_REFRESH_KEY: string;
    JWT_PRIVATE_EXPIRATION_TIME: number;
    JWT_REFRESH_EXPIRATION_TIME: number;
    // Public key for JWT
    JWT_PUBLIC_KEY: string;
    JWT_PUBLIC_REFRESH_KEY: string;
    JWT_PUBLIC_EXPIRATION_TIME: number;
    JWT_REFRESH_PUBLIC_EXPIRATION_TIME: number;
}

export const Set_Env = async (env: Partial<Env>) => {
    log.info("Environment variables are set");
    return {
        // App Local Settings
        node_env: env.NODE_ENV,
        http_port: env.HTTP_PORT,
        https_port: env.HTTPS_PORT,
        ts_node_dev: env.TS_NODE_DEV,
        // Node Docker Settings
        node_docker_container_name: env.NODE_DOCKER_CONTAINER_NAME,
        node_docker_app_name: env.NODE_DOCKER_APP_NAME,
        node_docker_env: env.NODE_DOCKER_ENV,
        node_docker_port: env.NODE_DOCKER_PORT,
        node_docker_network_name: env.NODE_DOCKER_NETWORK_NAME,
        // Logger Settings
        log_level: process.env.LOG_LEVEL,
        // Mongo Local Settings
        mongo_uri_local: env.MONGO_URI_LOCAL,
        // Mongo Docker Settings
        mongo_docker_user: env.MONGO_DOCKER_USER,
        mongo_docker_password: env.MONGO_DOCKER_PASSWORD,
        mongo_docker_port: env.MONGO_DOCKER_PORT,
        mongo_docker_container_name: env.MONGO_DOCKER_CONTAINER_NAME,
        mongo_docker_db_name: env.MONGO_DOCKER_DB_NAME,
        // Mongo Express Docker Settings
        mongo_express_docker_container_name: env.MONGO_EXPRESS_DOCKER_CONTAINER_NAME,
        mongo_express_docker_port: env.MONGO_EXPRESS_DOCKER_PORT,
        mongo_express_docker_user: env.MONGO_EXPRESS_DOCKER_USER,
        mongo_express_docker_password: env.MONGO_EXPRESS_DOCKER_PASSWORD,
        // SMTP Settings
        smtp_host: env.SMTP_HOST,
        smtp_port: env.SMTP_PORT,
        smtp_secure: env.SMTP_SECURE,
        smtp_user: env.SMTP_USER,
        smtp_password: env.SMTP_PASSWORD,
        // SMTP Docker Settings
        smtp_docker_host: env.SMTP_DOCKER_HOST,
        smtp_docker_port: env.SMTP_DOCKER_PORT,
        smtp_docker_secure: env.SMTP_DOCKER_SECURE,
        smtp_docker_user: env.SMTP_DOCKER_USER,
        smtp_docker_password: env.SMTP_DOCKER_PASSWORD,
        // Private key for JWT
        jwt_private_key: env.JWT_PRIVATE_KEY,
        jwt_private_refresh_key: env.JWT_PRIVATE_REFRESH_KEY,
        jwt_private_expiration_time: env.JWT_PRIVATE_EXPIRATION_TIME,
        jwt_refresh_expiration_time: env.JWT_REFRESH_EXPIRATION_TIME,
        // Public key for JWT
        jwt_public_key: env.JWT_PUBLIC_KEY,
        jwt_public_refresh_key: env.JWT_PUBLIC_REFRESH_KEY,
        jwt_public_expiration_time: env.JWT_PUBLIC_EXPIRATION_TIME,
        jwt_refresh_public_expiration_time: env.JWT_REFRESH_PUBLIC_EXPIRATION_TIME
    };
};