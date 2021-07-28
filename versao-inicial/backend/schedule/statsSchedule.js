//Olha de forma recorrente os BDs e sincroniza os dados de tempos em tempos. Nesse caso, de 1 em 1 min

const schedule = require('node-schedule')

module.exports = app => {
    //padrão Cron (sec min hour day mouth dayOfWeek) - de 1 em 1 min
    schedule.scheduleJob('*/1 * * * *', async function(){
        const usersCount = await app.db('users').count('id').first()
        const categoriesCount = await app.db('categories').count('id').first()
        const articlesCount = await app.db('articles').count('id').first()

        const { Stat } = app.api.stat

        const lastStat = await Stat.findOne({}, {},
            { sort: { 'created': -1 } }) //pegar a última estatística que está no mondoDB

        const stat = new Stat({
            users: usersCount.count,
            categories: categoriesCount.count,
            articles: articlesCount.count,
            created: new Date()
        })

        //Verifica se a última estatística mudou em relação a estatística do BD
        const changeUsers = !lastStat || stat.users !== lastStat.users
        const changeCategories = !lastStat || stat.categories !== lastStat.categories
        const changeArticles = !lastStat || stat.articles !== lastStat.articles

        //se mudar alguma das categorias - Vai persistir no mongoDB e vai mostrar que as estatísticas foram atualizadas com sucesso
        if(changeUsers || changeCategories || changeArticles){
            stat.save().then(() => console.log('[Stats] Estatísticas atualizadas!'))
        }
    }) 
}