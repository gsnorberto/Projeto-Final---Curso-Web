//Mostrar os estados na tela inicial - Quantidade de usuários cadastrados, de 
module.exports = app => {
    //model
    const Stat = app.mongoose.model('Stat', {
        users: Number,
        categories: Number,
        articles: Number,
        createdAt: Date
    })

    //Método que recebe do mongodb as estatísticas mais atualizadas
    const get = (req, res) => {
        Stat.findOne({}, {}, { sort: { 'createdAt' : -1 } }) //"sort" pega a última estatística cadastrada no MongoDB
            .then(stat => {
                //retorna o defaultStats caso o que tenha recebido do BD não seja uma estatística válida
                const defaultStat = {
                    users: 0,
                    categories: 0,
                    articles: 0
                }
                res.json(stat || defaultStat)
            })
    }

    return { Stat, get }
}