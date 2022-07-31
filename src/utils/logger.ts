import pino, {multistream} from "pino"
import pretty,{} from "pino-pretty"
import dayjs from "dayjs";
/**
 * Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/
 */

const level =  Boolean(process.env.TS_NODE_DEV)?process.env.LOG_LEVEL:"db" || "db";

const levels = {
    emerg: 80,//ok
    alert: 70,//ok
    crit: 60,//ok
    error: 50,//ok
    warn: 40,//ok
    uatiz: 30,//ok
    info: 20,//ok
    debug: 10,//ok
    db: 5,//ok
}

let streams = Object.keys(levels).map((level:string) => {
    return { level: level, stream: pino.destination({dest:`./src/logs/${level}.log`})};
});

export const loggerFile = pino({
    name: "log_writer",
    level: level,
    customLevels:levels,
    useOnlyCustomLevels: true,
    safe:true,
    formatters:{
        level(label, number) {
            return {level:label}
        },
        bindings (bindings) {
            return { pid: bindings.pid, time: bindings.time }
        },
        log(obj:Object) {
            return {time2:`${dayjs().format("DD-MM-YYYY HH:mm:ss")}`}
        }
    },
},
/**
 * Not sure why this is needed, but it is for while
 */
//@ts-ignore
multistream(streams,{
    levels,
    dedupe: true,
})
)

export const logDebug = pino({
    customLevels:levels,
    level: level,
},
    pretty(
        {
            levelFirst: true,
            sync:false,
            ignore:"hostname, PID",
            translateTime: `${dayjs().format("DD-MM-YYYY HH:mm:ss")}`,
            customPrettifiers: {
                // The argument for this function will be the same
                // string that's at the start of the log-line by default:
                time: timestamp => `🕰 -> [${timestamp}]🇧🇷`,
            
                // The argument for the level-prettifier may vary depending
                // on if the levelKey option is used or not.
                // By default this will be the same numerics as the Pino default:
                // level: logLevel => `LEVEL: ${logLevel}`,
                // pid: pid => `PID: ${JSON.stringify(pid)}`,
            
                // other prettifiers can be used for the other keys if needed, for example
                // hostname: hostname => colorette.bgBlue("hostname: ") + hostname,
                // pid: pid => colorRed(pid)
                name: name => `name: ${name}`,
                // caller: caller => colorCyan(caller)
              }
        },
        
    )
);


