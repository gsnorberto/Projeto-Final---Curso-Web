const app = require('express')()
const consign = require('consign')
const db = require('./config/db')
const mongoose = require('mongoose')

require('./config/mongodb')

//O app.db estará disponível dentro da api 
app.db = db //utilizado em "user.js" para manipulações no BD do Postgres (put, get..)

app.mongoose = mongoose

//Injeta em cada uma das dependências que ele vai carregar, vai injetar como parâmetro o app
consign()
    .include('./config/passport.js')
    .then('./config/middleware.js') //Lê os Middlewares
    .then('./api/validation.js')
    .then('./api') //Lê os arquivos de API
    .then('./schedule')
    .then('./config/routes.js') //Lê as rotas com as APIs já carregadas
    .into(app)

app.listen(3000, () => {
    console.log('Backend executando...');
})