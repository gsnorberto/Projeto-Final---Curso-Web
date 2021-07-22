//Usando o bcrypt para criptografar a senha do usuário sempre que for salvar um usuário no BD
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    //Destructuring para usar diretamente o nome da função em vez de sempre ficar chamando app.api.validation.nomeDaFuncao
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    //função para criptografar a senha fornecida pelo usuário e depois persistir no BD
    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10) // "10" é o número de repetições para processar os dados
        return bcrypt.hashSync(password, salt) //Vai gerar o hash da senha de forma síncrona
    }

    //Inserir um novo usuário e alterar um usuário já existente
    const save = async (req, res) => {
        const user = { ...req.body } //"req.body" é um json que representa o usuário, e esse body é interceptado pelo body-parser que gera um body com um objeto já todo configurado. Usa o operado spread para espalhar todos esses atributos que vieram do body colocando dentro do objeto "user"
        if(req.params.id) user.id = req.params.id

        // Série de validações
        try{
            existsOrError(user.name, 'Nome não informado')
            existsOrError(user.email, 'Email não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de Senha inválida')
            equalsOrError(user.password, user.confirmPassword, 'Senha e Confirmação de Senha não correspondem')

             //acessa a tabela de usuários para pegar um usuário
            //O "db.js" retorna um knex e o "index.js" pega esse "db" e coloca dentro de "app.db", então o "db" é a forma que tem para acessar o knex. Então tudo que for feito em "app.db" poderia ser feito com "knex(nomeDaTabela)"
            const userFromDB = await app.db('users')
                .where({ email: user.email }).first() //filtragem de usuário de acordo ao seu email
            if(!user.id){ //Verifica se existe o ID do usuário, se não existir, faz as outras verificações para confirmar se não há dados iguais, como o email, por exemplo.
                notExistsOrError(userFromDB, 'Usuário já cadastrado')
            }
        }catch(msg){
            return res.status(400).send(msg) //O erro 400 é um erro de quem está fazendo uma requisição e não um erro do lado do servidor
        }

        user.password = encryptPassword(req.body.password) //Criptografa a senha
        delete user.confirmPassword //A confirmação de senha será deletada para não ir para o BD

        //Se for uma atualização nos dados do usuário
        if(user.id){
            app.db('users')
                .update(user)
                .where({ id: user.id })
                .then(_ => res.status(204).send()) //se der tudo certo no update, manda o status 204 confirmando que deu tudo certo
                .catch(err => res.status(500).send(err)) //erro "500" = erro do lado do servidor
        } else { // Se for o cadastro de um novo usuário
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req,res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    //DESAFIO: Obter um usuário pelo ID
    const getById = (req,res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .where({ id: req.params.id })
            .first() //pegar um único resultado
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }

    return { save, get,  getById}
}