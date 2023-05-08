const loge4js = require("log4js")

let customLogger
const logger = () => customLogger || setupLogger()

const setupLogger = () => {
    loge4js.configure({
        appenders: {
            out: {
                type: 'stdout', layout: {
                    type: 'pattern',
                    pattern: '%[  %p  %l %f{4} %m %] %n',
                }
            }
        },
        categories: { default: { appenders: ['out'], level: 'info', enableCallStack: true } }
    });
    customLogger = loge4js.getLogger();
    customLogger.level = "debug";

    return customLogger

}

module.exports = {
    setupLogger,
    logger
}