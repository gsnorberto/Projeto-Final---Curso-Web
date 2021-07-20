// Arquivo com a configuração de conexão com o banco de dados

//exportado para db.js
module.exports = {
  client: 'postgresql',
  connection: {
    database: 'knowledge',
    user: 'postgres',
    password: '11asdf'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
