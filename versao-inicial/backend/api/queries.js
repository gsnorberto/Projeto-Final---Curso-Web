//Gera de forma recursiva como se fosse uma tabela temporária dentro da consulta que retorna o ID da própria categoria que foi passado como parâmetro, e fazendo uma união com a consulta que vai ser responsável por fazer um join das tabelas de categorias e subcategorias no qual "parent.id" é igual a "subcategories.id"
//A partir do pai ele pega o filho, a partir do filho ele pega o filho do filho. 
module.exports = {
    categoryWithChildren: `
        WITH RECURSIVE subcategories (id) AS (
            SELECT id FROM categories WHERE id = ?
            UNION ALL
            SELECT c.id FROM subcategories, categories c
                WHERE "parentId" = subcategories.id
        )
        SELECT id FROM subcategories
    `
}