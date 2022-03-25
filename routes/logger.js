const winston = require('winston');
const { combine, timestamp, json } = winston.format;

// Méthoder Logging
const logger = winston.createLogger({
    level: 'info',
    format: combine(timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }), json()),
    transports: [
      new winston.transports.File({
        filename: 'combined.log',
      }),
    ],
});

module.exports = (logger);