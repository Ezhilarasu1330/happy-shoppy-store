import winston from 'winston'
import fs from 'fs'
import path from 'path'

import DailyRotateFile from "winston-daily-rotate-file"

import appConfig from '../config/config.js'

const logDir = 'logs';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

var options = {
    file1: {
        level: 'error',
        format: winston.format.combine(
            winston.format.label({ label: path.basename(process.report.filename) }),
            winston.format.colorize(),
            winston.format.printf(info => `${info.timestamp} 'error' [${info.label}]: ${info.message}`)
        ),
        filename: `${logDir}/errorResult-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 10,
        colorize: false,
    },
    file2: {
        level: 'debug',
        format: winston.format.combine(
            winston.format.label({ label: path.basename(process.report.filename) }),
            winston.format.colorize(),
            winston.format.printf(info => `${info.timestamp} 'debug' [${info.label}]: ${info.message}`)
        ),
        filename: `${logDir}/debugResult-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 10,
        colorize: false,
    },
    file3: {
        level: 'info',
        format: winston.format.combine(
            winston.format.label({ label: path.basename(process.report.filename) }),
            winston.format.colorize(),
            winston.format.printf(info => `${info.timestamp} 'info' [${info.label}]: ${info.message}`)
        ),
        filename: `${logDir}/infoResult-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 10,
        colorize: true,
    },
    file4: {
        level: 'access',
        format: winston.format.combine(
            winston.format.label({ label: path.basename(process.report.filename) }),
            winston.format.colorize(),
            winston.format.printf(info => `${info.timestamp} 'info' [${info.label}]: ${info.message}`)
        ),
        filename: `${logDir}/requestaccess-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 10,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
        format: winston.format.combine(
            winston.format.cli(),
            winston.format.splat(),
        )
    },
};

var logLevels = {
    levels: { access: 0, error: 1, warn: 2, info: 3, verbose: 4, debug: 5, silly: 6 }
};
winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.json()
);
winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    debug: 'green',
    access: 'yellow',
    verbose: 'red',
    silly: 'green'
});

const transports = [];
if (process.env.NODE_ENV !== 'development') {
    transports.push(
        new DailyRotateFile(options.file1),
        new DailyRotateFile(options.file2),
        new DailyRotateFile(options.file3),
        new DailyRotateFile(options.file4),
    )
} else {
    transports.push(
        new DailyRotateFile(options.file1),
        new DailyRotateFile(options.file2),
        new DailyRotateFile(options.file3),
        new DailyRotateFile(options.file4),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.cli(),
                winston.format.splat(),
            )
        })
    )
}

const Logger = winston.createLogger({
    level: appConfig.logs.level,
    levels: logLevels.levels,
    format: winston.format.combine(
        winston.format.label({ label: path.basename(process.report.filename) }),
        winston.format.colorize(),
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    transports
});


export default Logger;