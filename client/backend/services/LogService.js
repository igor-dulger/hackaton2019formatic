
const log4js = require('log4js');

log4js.configure({
    appenders: {
        console: { type: 'console' },
        sync: {
            type: 'dateFile',
            filename: __dirname + '/../logs/sync.log',
            pattern: '.yyyy-MM-dd'
        },
        rest: {
            type: 'dateFile',
            filename: __dirname + '/../logs/rest.log',
            pattern: '.yyyy-MM-dd'
        }
    },
    categories: {
        rest: { appenders: ['rest', 'console'], level: 'trace' },
        sync: { appenders: ['sync','console'], level: 'trace' },
        default: { appenders: ['sync', 'rest', 'console'], level: 'trace' }
    }

});

module.exports = {
    sync: log4js.getLogger('sync'),
    rest: log4js.getLogger('rest'),
};
