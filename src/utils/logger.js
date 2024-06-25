const winston = require('winston');
const dotenv = require("dotenv");
const program = require('./comander.js');

const { mode } = program.opts();

dotenv.config({
    path: mode === "produccion" ? "./.env.produccion" : "./.env.desarrollo"
});

// Define los niveles y colores
const niveles = {
    nivel: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colores: {
        fatal: "red",
        error: "yellow",
        warning: "blue",
        info: "green",
        http: "magenta",
        debug: "white"
    }
}

// Configura el logger para desarrollo
const loggerDesarrollo = winston.createLogger({
    levels: niveles.nivel,
    transports: [
        new winston.transports.Console({
            level: "debug", // Solo loguea desde nivel debug en consola
            format: winston.format.combine(
                winston.format.colorize({colors: niveles.colores}), 
                winston.format.simple()
            )
        })
    ]
});

// Configura el logger para producción
const loggerProduccion = winston.createLogger({
    levels: niveles.nivel,
    transports: [
        new winston.transports.File({
            filename: "./errores.log",
            level: "info", 
            format: winston.format.simple()
        })
    ]
});

// Define el logger según el modo
let logger;
if (mode === 'produccion') {
    logger = loggerProduccion;
} else {
    logger = loggerDesarrollo;
}


const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
    next();
}

module.exports = addLogger;
