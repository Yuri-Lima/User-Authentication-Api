import pino, {multistream, LoggerOptions} from "pino"
import pretty,{} from "pino-pretty"
import dayjs from "dayjs";
import {resolve} from "node:path";
/**
 * Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/
 */
interface pinoLogerOptions extends LoggerOptions {
    info: (message: string, ...args: any[]) => void;
    warn: (message: string, ...args: any[]) => void;
    error: (message: string, ...args: any[]) => void;
    debug: (message: string, ...args: any[]) => void;
    trace: (message: string, ...args: any[]) => void;
    uatiz: (message: string, ...args: any[]) => void;
}
type Levellogger ={
    emerg:  number;
    alert:  number;
    crit:   number;
    error:  number;
    warn:   number;
    uatiz:  number;
    info:   number;
    debug:  number;
    db:     number;
}

export default class Logger{
    private logger: LoggerOptions;
    private level: string = <string>process.env.DEV_LOGGER_LEVEL;
    private levels: Levellogger = {
        emerg: 80,
        alert: 70,
        crit: 60,
        error: 50,
        warn: 40,
        uatiz: 30,
        info: 20,
        debug: 10,
        db: 5,
    }
    constructor(devState: boolean){
        this.level = devState?this.level:"info";
    }
    private loggerConsole(): pinoLogerOptions {
        return pino({
            customLevels:this.levels,
            level: process.env.DEV_LOGGER_LEVEL,
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
    }
    private loggerFile(): pinoLogerOptions {
        let streams = Object.keys(this.levels).map((level:string) => {
            return { level: level, stream: pino.destination({dest:`${resolve(process.cwd(), "src", "logs", level+".log")}`})};
            
        });
        return pino({
                name: "log_writer",
                level: this.level,
                customLevels:this.levels,
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
                levels: this.levels,
                dedupe: true,
            })
        );
    }
    public test(): void {
        this.loggerConsole().info("Console logger Done");
        this.loggerFile().info("File logger Done");
    }
    public startConsole(): any {
        return this.loggerConsole();
    }
    public startFile(): any {
        return this.loggerFile();
    }
}
export const log = new Logger(true).startConsole();
export const logfile = new Logger(false).startFile();

// (async () => {
    // const logfile = new Logger(true).loggerFile();
    // const log = new Logger(true).loggerConsole();
    // log.uatiz("UATIZ");
// })();

// const levels = {
//     emerg: 80,//ok
//     alert: 70,//ok
//     crit: 60,//ok
//     error: 50,//ok
//     warn: 40,//ok
//     uatiz: 30,//ok
//     info: 20,//ok
//     debug: 10,//ok
//     db: 5,//ok
// }

// let streams = Object.keys(levels).map((level:string) => {
//     return { level: level, stream: pino.destination({dest:`${resolve(process.cwd(), "src", "logs", level,".log")}`})};
    
// });

// export const loggerFile = pino({
//     name: "log_writer",
//     level: process.env.DEV_LOGGER_LEVEL,
//     customLevels:levels,
//     useOnlyCustomLevels: true,
//     safe:true,
//     formatters:{
//         level(label, number) {
//             return {level:label}
//         },
//         bindings (bindings) {
//             return { pid: bindings.pid, time: bindings.time }
//         },
//         log(obj:Object) {
//             return {time2:`${dayjs().format("DD-MM-YYYY HH:mm:ss")}`}
//         }
//     },
// },
// /**
//  * Not sure why this is needed, but it is for while
//  */
// //@ts-ignore
// multistream(streams,{
//     levels,
//     dedupe: true,
// })
// )

// export const logDebug = pino({
//     customLevels:levels,
//     level: process.env.DEV_LOGGER_LEVEL,
// },
//     pretty(
//         {
//             levelFirst: true,
//             sync:false,
//             ignore:"hostname, PID",
//             translateTime: `${dayjs().format("DD-MM-YYYY HH:mm:ss")}`,
//             customPrettifiers: {
//                 // The argument for this function will be the same
//                 // string that's at the start of the log-line by default:
//                 time: timestamp => `🕰 -> [${timestamp}]🇧🇷`,
            
//                 // The argument for the level-prettifier may vary depending
//                 // on if the levelKey option is used or not.
//                 // By default this will be the same numerics as the Pino default:
//                 // level: logLevel => `LEVEL: ${logLevel}`,
//                 // pid: pid => `PID: ${JSON.stringify(pid)}`,
            
//                 // other prettifiers can be used for the other keys if needed, for example
//                 // hostname: hostname => colorette.bgBlue("hostname: ") + hostname,
//                 // pid: pid => colorRed(pid)
//                 name: name => `name: ${name}`,
//                 // caller: caller => colorCyan(caller)
//               }
//         },
        
//     )
// );


