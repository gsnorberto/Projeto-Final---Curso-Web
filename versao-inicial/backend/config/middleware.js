const bodyParser = require('body-parser')
const cors = require('cors')

module.exports = app => {
    app.use(bodyParser.json()) //interpreta o json que vem no corpo da requisição
    app.use(cors())
}