// import { Router, Request, Response, NextFunction } from 'express'
import _ from "lodash";
import Logger from "./logger.js";

const logRequestHandler = (req, res, next) => {
    let requestid = _.uniqueId('request_');
    let requeststarttime = Date.now();
    Logger.log('access', `${requestid} ${req.method} ${req.hostname} ${req.ip} ${req.originalUrl}`);
    const cleanup = () => {
        res.removeListener('finish', logFn)
        res.removeListener('close', abortFn)
        res.removeListener('error', errorFn)
    }

    let invokerclientdata = {
        version: req.get('X-ClientVersion'),
        platformVersion: req.get('X-ClientPlatformVersion'),
        device: req.get('X-ClientDevice'),
        locale: req.get('X-ClientLocale')
    }

    let imprintParts = [requestid];

    if (invokerclientdata) {
        imprintParts.push(`${invokerclientdata.device || ''} ${invokerclientdata.platformVersion || ''}`)

        if (invokerclientdata.version) {
            imprintParts.push(`#${invokerclientdata.version}`)
        }
        if (invokerclientdata.locale) {
            imprintParts.push(`${invokerclientdata.locale} locale`)
        }
    }
    let clientdata = imprintParts.filter(x => !!x).join(', ');
    const logFn = () => {
        cleanup()
        let processingTime = Date.now() - requeststarttime;
        Logger.log('access', `${requestid} ${clientdata}  ' Processing Time: '  ${processingTime} 'responsecode:'   ${res.statusCode}  Response:  ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`)
    }

    const abortFn = () => {
        cleanup()
        Logger.log('access', requestid + clientdata + 'Request aborted by the client')
    }

    const errorFn = err => {
        cleanup()
        Logger.log('access', `${requestid} ${clientdata} Request pipeline error: ${err}`)
    }

    res.on('finish', logFn) // successful pipeline (regardless of its response)
    res.on('close', abortFn) // aborted pipeline
    res.on('error', errorFn) // pipeline internal error
    next()
}

export default logRequestHandler;