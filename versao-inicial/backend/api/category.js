//A tabela "Categories" tem como entra: nome(obrigatório), parentID(não obrigatório). "parentId" aponta para outra categoria nessa mesma tabela.
const { first } = require("../config/db")

module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    /************** SALVAR CATEGORIA *************/
    const save = (req, res) => {
        const category = { ...req.body } //Nome e ParentId(não obrigatório o preenchimento)

        //Se vier um id nos parâmetros da requisição, signifca que o usuário deseja fazer um opdate (Put)
        if(req.params.id) category.id = req.params.id

        try{
            existsOrError(category.name, 'Nome não informado')
        } catch(msg){
            return res.status(400).send(msg)
        }

        if(category.id){ //update
            app.db('categories') // seleciona a coluna "categories" da tabela
                .update(category)
                .where({ id: category.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else { //create
            app.db('categories')
                .insert(category)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    } // Fim da função "save"

    /************* DELETAR CATEGORIA *************/
    //delete
    //Categorias tem relação no BD com artigos e também tem um auto relacionamento(que são as subcategorias). Então se uma categoria tem subcategorias ou está associada a artigos, simplesmente não pode deixar com que o usuário exclua essa categoria. Então para deletar uma categoria, primeiramente deve desassociar ela de todos os artigos que existem e tirar qualquer categoria filha.
    const remove = async(req, res) => {
        try{
            //O ID deve existir
            existsOrError(req.params.id, 'Código da categoria não informado.')

            //Verifica dentro do db "categories" se existe algum elemento cujo seu parentId seja o id da categoria fornecido pelo usuário para deletar. Se existir, dará erro
            const subcategory = await app.db('categories')
                .where({ parentId: req.params.id })
            notExistsOrError(subcategory, 'Categoria possui subcategorias.')

            //Verifica se a categoria está associada a um artigo
            const articles = await app.db('articles')
                .where({ categoryId: req.params.id })
            notExistsOrError(articles, 'Categoria possui artigos')

            //Deleta a categoria de acordo ao seu ID
            const rowsDeleted = await app.db('categories')
                .where({ id: req.params.id }).del()
            existsOrError(rowsDeleted, 'Categoria não foi encontrada.')

            res.status(204).send()

        } catch(msg){
            res.status(400).send(msg)
        }
    } //Fim da função "remove"

    /********** CAMINHO DE SUBCATEGORIAS *********/
    //Mostrar todo caminho de subcategorias incluidas em outras categorias
    //EX: Curso Android > Instalação > Framework
    const withPath = categories => {
        //Filtra no BD "categories" tuplas que tenham id igual ao parentId de outra tupla. Ou seja, tuplas que estão relacionadas.
        const getParent = (categories, parentId) => {
            let parent = categories.filter(parent => parent.id === parentId)
            return parent.length ? parent[0] : null
        }

        //O resultado desse map será as categorias com um atributo a mais
        const categoriesWithPath = categories.map(category => {
            let path = category.name //nome da categoria que está sendo incluída
            let parent = getParent(categories, category.parentId) //procura o parent, se existir

            //enquanto existir parent, continue procurando os parents e continue concatendando em path para concatenar o path completo
            while(parent){
                path = `${parent.name} > ${path}`
                parent = getParent(categories, parent.parentId) // se retornar nulo, sai do while
            }

            return{...category, path}
        })

        // Ordenação alfabética das categorias
        // O "a" vai ser uma categoria e o "b" vai ser outra categoria
        categoriesWithPath.sort((a,b) => {
            if(a.path < b.path) return -1
            if(a.path > b.path) return 1
            return 0 //se os dois forem iguais
        })

        return categoriesWithPath
    } //Fim da função "withPath" - Mostrar caminho

    /************ OBTER TODAS CATEGORIAS *********/
    //Retornar as categorias
    //Não precisa utilizar o "select" pois o objetivo é trazer todas as categorias
    const get = (req, res) => {
        app.db('categories')
            .then(categories => res.json(withPath(categories)))
            .catch(err => res.status(500).send(err))
    }

    /*********** OBTER CATEGORIA POR ID **********/
    //Retorna a categoria especificada pelo ID
    const getById = (req, res) => {
        app.db('categories')
            .where({ id: req.params.id })
            .first()
            .then(category => res.json(category))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById }
}