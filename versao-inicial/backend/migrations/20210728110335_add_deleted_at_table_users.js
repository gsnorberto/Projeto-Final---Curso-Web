//Adicionar a função de deletar na tabela de usuários

//alterar a tabela criando a coluna
exports.up = function(knex) {
    return knex.schema.alterTable('users', table => {
        table.timestamp('deletedAt')
    })
};

//alterar a tabela excluindo a coluna
exports.down = function(knex) {
    return knex.schema.alterTable('users', table => {
        table.dropColumn('deletedAt')
    })
};
