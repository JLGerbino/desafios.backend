export default class LoggerController{
    async test(req, res) {
        req.logger.fatal("Fatal");
        req.logger.error("Error");
        req.logger.warn("Alerta!");
        req.logger.info("Info");
        req.logger.http("Http");        
        req.logger.debug("Debug");              

       res.send("Prueba de logger");        
    }
}