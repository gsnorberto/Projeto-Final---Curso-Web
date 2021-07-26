const { where, update } = require("../config/db")

module.exports = app => {
    const { existsOrError } = app.api.validation

    /*************** SALVAR ARTIGO ***********/
    const save = (req, res) => {
        const article = {...req.body}
        if(req.params.id) article.id = req.params.id

        try{
            existsOrError(article.name, 'Nome não informado')
            existsOrError(article.description, 'Descrição não informada')
            existsOrError(article.categoryId, 'Categoria não informada')
            existsOrError(article.userId, 'Autor não informado')
            existsOrError(article.content, 'Conteúdo não informado')
        } catch(msg){
            res.status(400).send(msg)
        }

        if(article.id){ //alterar artigo
            app.db('articles')
                .update(article)
                .where({ id: article.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else { //incluir um artigo
            app.db('articles')
                .insert(article)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    /************** REMOVER ARTIGO ***************/
    const remove = async (req, res) => {
        try{
            const rowsDeleted = await app.db('articles')
                .where({ id: req.params.id }).del()
            
            try{
                existsOrError(rowsDeleted, 'Artigo não foi encontrado')
            }catch (msg) {
                return res.status(400).send(msg)
            }

            res.status(204).send()
        }catch(msg){
            res.status(500).send(msg)
        }
    }

    /***************************************************/
    /** CONSULTA DE TODOS ARTIGOS (USANDO PAGINAÇÃO) **/
    const limit = 10 //quantidade de artigos por página

    const get = async (req, res) => {
        const page = req.query.page || 1 //número atual da página

        //contagem de artigos para saber quantas páginas vão ser geradas a partir da quantidade de elementos por página
        const result = await app.db('articles').count('id').first()
        const count = parseInt(result.count) //quantidade total de artigos

        app.db('articles')
            .select('id', 'name', 'description')
            .limit(limit).offset(page * limit - limit) //offset(a partir de onde vai começar a consulta) será 0 na página 1, 10 na página 2...
            .then(articles => res.json( {data: articles, count, limit })) //todas as informações necessárias para renderizar o paginador apenas com uma chamada
            .catch(err => res.status(500).send(err))
    }

    /*********** CONSULTA DE ARTIGO ESPECÍFICO ************/
    const getById = (req, res) => {
        app.db('articles')
            .where({ id: req.params.id })
            .first()
            .then(article => {
                article.content = article.content.toString() // o artigo vem em formato binário 
                return res.json(article)
            })
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById }
}