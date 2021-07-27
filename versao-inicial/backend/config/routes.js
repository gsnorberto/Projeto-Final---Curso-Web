module.exports = app => {
    //essas serão as únicas urls que não estarão sujeitas a validação do token. Ou seja, são urls públicas, disponíveis para qualquer pessoa acessar
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    app.route('/users')
        .post(app.api.user.save)
        .get(app.api.user.get)

    app.route('/users/:id')
        .put(app.api.user.save)
        .get(app.api.user.getById) //obter usuário através do id

    app.route('/categories')
        .get(app.api.category.get)
        .post(app.api.category.save) //adicionar

    //ATENÇÃO!! A rota abaixo deve estar sempre acima da rota "/categories/:id" 
    app.route('/categories/tree')
        .get(app.api.category.getTree)

    app.route('/categories/:id')
        .get(app.api.category.getById)
        .put(app.api.category.save) //alterar
        .delete(app.api.category.remove)

    app.route('/articles')
        .get(app.api.article.get)
        .post(app.api.article.save)

    app.route('/articles/:id')
        .get(app.api.article.getById)
        .put(app.api.article.save)
        .delete(app.api.article.remove)

    app.route('/categories/:id/articles')
        .get(app.api.article.getByCategory)
    
}