const env = process.env;

const config = {
  db:{
    host: env.DB_HOST || 'john.db.elephantsql.com',
    port: env.DB_PORT || '5432',
    user: env.DB_USER || 'bfmnfopq',
    password: env.DB_PASSWORD || 'qp9CwVoyvXUNjquQCDXN5FYVWRcjE7iR',
    database: env.DB_NAME || 'bfmnfopq',
  },
  //listPerPage: env.LIST_PER_PAGE || 10, //the maximum number of item in a page (express js)
};

module.exports = config;
