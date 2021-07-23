module.exports = app => {
    app.route('/users')
        .post(app.api.user.save)
        .get(app.api.user.get)

    app.route('/users/:id')
        .put(app.api.user.save)
        .get(app.api.user.getById) //obter usuário através do id

    app.route('/categories')
        .get(app.api.category.get)
        .post(app.api.category.save) //adicionar

    app.route('/categories/:id')
        .get(app.api.category.getById)
        .put(app.api.category.save) //alterar
        .delete(app.api.category.remove)
}