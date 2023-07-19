import winston from "winston";
import  __dirname  from "../utils.js"
import path from "path";
import { config } from "../config/config.js";


const currentEnv = config.entorno.environment || "development";

const customLevels = {
    levels: {
      fatal: 0,
      error: 1,
      warn: 2,
      info: 3,
      http: 4,
      debug: 5,     
    },

    colors: {
      fatal: "cyan",
      error: "red",
      warn: "yellow",
      info: "blue",
      http: "green",      
      debug: "grey",      
    },
  };
  
  export const devLogger = winston.createLogger({
    levels: customLevels.levels,    
    transports: [
      new winston.transports.Console({ level: "debug",
        format: winston.format.combine(
          winston.format.colorize({
            colors: customLevels.colors,
          }),
          winston.format.simple()
        ), 
    }),
    ],
  });
  
  export const prodLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
      new winston.transports.Console({ level: "info", 
        format: winston.format.combine(
        winston.format.colorize({
        colors: customLevels.colors,
        }),
        winston.format.simple()
        ), }),
      new winston.transports.File({ filename: path.join(__dirname, "./error.log"), level: "error" }),
    ],
  });

  let logger;
  export const envLogger = () => {
    if (currentEnv === "development") {
      logger = devLogger;
    } else {
      logger = prodLogger;
    }
    return logger;
  };

  export const addLogger = (req, res, next) => {
    req.logger = envLogger();
    req.logger.http(`${req.method} en ${req.url}`);
    next();
  };
      
  