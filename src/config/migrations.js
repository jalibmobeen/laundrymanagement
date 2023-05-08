const {DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME} = process.env;

   
  
module.exports = {
    development: {
      schema: { 'migration': {} },
      modelName: 'Migration',
      db: process.env.MONGOHQ_URL ||`mongodb+srv://${DB_NAME}:${DB_PASSWORD}@cluster0.6jxpwxu.mongodb.net/`
    },
    // test: { ... },
    // production: { ... }
  }