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
  
  const devLogger = winston.createLogger({
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
  
  const prodLogger = winston.createLogger({
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
  
  export const addLogger = (req, res, next) => {
    if (currentEnv === "development") {
      req.logger = devLogger;
    } else {
      req.logger = prodLogger;
    }
    req.logger.http(`${req.method} en ${req.url}`);
    next();
  };

