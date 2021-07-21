//config é o arquivo de configuração do banco de dados. E o knex é a biblioteca utilizada para acessar o postgres

const config = require('../knexfile.js')
const knex = require('knex')(config) 


knex.migrate.latest([config]) // Vai executar a migração no momento em que carregar o backend

//Exportação do knex para ser acessado diretamente no arquivo index
module.exports = knex