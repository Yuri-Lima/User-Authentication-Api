import { existsSync } from "node:fs"
import { join } from "node:path";
import {JsonToEnv, Options_Set_Env, Set_Env} from "dynamic.envs";

async function createEnvFile():Promise<void> {
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
            log: true // If you want to log the result, set this to true
        }
        const setEnv = new JsonToEnv(set, options);
        setEnv.setEnv();
    }
}
(async ()=>{
    await createEnvFile();
    process.exit(1);
})()