module.exports = app => {
    //essas serão as únicas urls que não estarão sujeitas a validação do token. Ou seja, são urls públicas, disponíveis para qualquer pessoa acessar
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    app.route('/users')
        .all(app.config.passport.authenticate()) //se der algum problema de autenticação aqui, ele não vai permitir chamar os dois métodos abaixo
        .post(app.api.user.save)
        .get(app.api.user.get)

    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.user.save)
        .get(app.api.user.getById) //obter usuário através do id

    app.route('/categories')
        .all(app.config.passport.authenticate())
        .get(app.api.category.get)
        .post(app.api.category.save) //adicionar

    //ATENÇÃO!! A rota abaixo deve estar sempre acima da rota "/categories/:id" 
    app.route('/categories/tree')
        .all(app.config.passport.authenticate())
        .get(app.api.category.getTree)

    app.route('/categories/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.category.getById)
        .put(app.api.category.save) //alterar
        .delete(app.api.category.remove)

    app.route('/articles')
        .all(app.config.passport.authenticate())
        .get(app.api.article.get)
        .post(app.api.article.save)

    app.route('/articles/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.article.getById)
        .put(app.api.article.save)
        .delete(app.api.article.remove)

    app.route('/categories/:id/articles')
        .all(app.config.passport.authenticate())
        .get(app.api.article.getByCategory)
    
}