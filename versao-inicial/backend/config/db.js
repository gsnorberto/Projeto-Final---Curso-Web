const config = require('../knexfile.js')
const knex = require('knex')(config)

//Exportação do knex para ser acessado diretamente no arquivo index
module.exports = knex