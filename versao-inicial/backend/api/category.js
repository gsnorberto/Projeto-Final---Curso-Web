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
            return parent.length ? parent[0] : null // retorna todo conteúdo do parent ou nulo
        }

        //O resultado desse map será as categorias com a inclusão do atributo "path" em cada categoria
        const categoriesWithPath = categories.map(category => {
            let path = category.name //nome da categoria que está sendo incluída. Ex: VueJS
            let parent = getParent(categories, category.parentId) //chama a função passando todas as categorias do DB e passando o ID do parent da categoria atual (ex: 3 = "JS"). No final, recebe o parent do VueJS , que no exemplo é "JS"

            //enquanto existir parent, continue procurando os parents e continue concatendando em path para concatenar o path completo
            while(parent){ // Sai do while quando "parent" for nulo
                path = `${parent.name} > ${path}` //JS > VueJS
                parent = getParent(categories, parent.parentId) // passa as categorias e parentId do parent atual (JS) que nesse exemplo é 1 = "webModerno". "parent" passa a ser "webModerno"
            }

            return{...category, path}
        })

        // Ordenação alfabética pelo nome dos path
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

    /*********** ÁRVORE DE CATEGORIAS **************/
    //Transformar um array de Categorias em uma estrutura de árvore que ficará no menu da aplicação.
    const toTree = (categories, tree) => {
        if(!tree) tree = categories.filter(c => !c.parentId) //Pega as categorias que não tem parentID. Ou seja, vão ser as categorias no topo do nó que podem ter filhas mas não tem pai. 

        tree = tree.map(parentNode => {
            const isChild = node => node.parentId == parentNode.id //Se for igual, significa que o "node" é filho direto de "parentNode"
            parentNode.children = toTree(categories, categories.filter(isChild)) //verifica se dentro das categorias existe uma categoria com parentID igual ao ID dos elementos que já estão na árvore "tree"
            return parentNode
        })
        return tree
    }

    const getTree = (req, res) => {
        app.db('categories')
            .then(categories => res.json(toTree(withPath(categories)))) //gera todas as categorias com o atributo path e o resultado dessa chamada será passado como parâmetro para função que converte as categorias em formato de árvore. Por fim, converte em json e retorna o resultado ao front end
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getById, getTree }
}