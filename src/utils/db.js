const Sequelize = require('sequelize');

const dbName = process.env.DB_NAME;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = Number(process.env.DB_PORT); 

const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

const dbConfig = {
    host: dbHost,
    port: dbPort, 
    dialect: 'mysql',
    logging: (msg) => {
        // Log slow queries (> 100ms)
        if (msg.includes('Executed')) {
            const match = msg.match(/(\d+)ms/);
            if (match && parseInt(match[1]) > 100) {
                console.log('[SLOW QUERY]', msg);
            }
        }
    },
    pool: isServerless ? {
        max: 5,
        min: 0,
        acquire: 5000,
        idle: 1000,
        evict: 5000
    } : {
        max: 100,  // Increased for load testing (was 10)
        min: 5,
        acquire: 10000,
        idle: 30000
    },
    dialectOptions: {
        connectTimeout: 10000,
        dateStrings: true,
        typeCast: true
    },
    define: {
        timestamp: true,
        createdAt: true,
        updatedAt: true,
        freezeTableName: false,
        underscored: true
    }
};

const connect = new Sequelize(dbName, dbUsername, dbPassword, dbConfig);
connect
    .authenticate()
    .then(() => {
        console.log('DB connection ✔️');
    })
    .catch((e) => {
        console.error('Error connecting to the database:', e.message);
    });

const DB = { con: connect, Sequelize };

module.exports = DB;
