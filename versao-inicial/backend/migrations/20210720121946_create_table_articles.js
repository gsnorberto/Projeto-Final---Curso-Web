//TABELA ARTIGOS

exports.up = function(knex, Promise) {
    return knex.schema.createTable('articles', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('description', 1000).notNull()
        table.string('imageUrl', 1000)
        table.binary('content').notNull() //vai armazenar o conteúdo do artigo
        table.integer('userId').references('id')
            .inTable('users') //referencia a tabela de usuários
        table.integer('categoryId').references('id')
            .inTable('categories').notNull() //referencia a tabela "categorias"
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('articles')
};
