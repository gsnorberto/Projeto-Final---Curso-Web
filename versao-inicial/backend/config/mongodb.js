//Conexão com o BD do MONGODB
//Utiliza o mongose para fazer essa conexão

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/knowledge_stats', { useNewUrlParser: true })
    .catch(e => { //se não conseguir se conectar com o mongoDB
        //node console log collors (para pesquisa de outras cores)
        const msg = "ERRO! Não foi possível conectar com o MongoDB"
        console.log('\x1b[41m%s\x1b[37m', msg, '\x1b[0m');
    })