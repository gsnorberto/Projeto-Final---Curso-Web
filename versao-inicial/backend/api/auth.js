//Usado para login.
//A parte de cadastro de usuários continua sendo a mesma função que está dentro de "user.js"

const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs') //Comparar a senha que tá no BD (criptografada) com a senha que foi recebida na requisição para fazer o login

module.exports = app => {
    const signin = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Informe usuário e senha!')
        }

        const user = await app.db('users')
            .where({ email: req.body.email })
            .first()
        //Se o usuário não existir
        if(!user) return res.status(400).send('Usuário não encontrado!')

        const isMatch = bcrypt.compareSync(req.body.password, user.password) //comparando o password passado na requisição com o armazenado no BD
        if(!isMatch) return res.status(401).send('Email/Senha inválidos!') //Não está autorizado por conta de usuário e/ou senha inválida

        //capturar a data atual em segundos
        const now = Math.floor(Date.now() / 1000)

        //token para proteção da senha
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            iat: now, //issued at (emitido em)
            exp: now + (60 * 60 * 24 * 3) //isso significa que se o usuário logar hoje o usuário pode fechar o browser, o token vai ficar na máquina dele por 3 dias, não sendo necessário ele se logar novamente
        }

        //no momento em que essa resposta for mandada para o usuário será mandado o token para ele, e apartir daí, qualquer requisição que for feita, precisará ter um cabeçalho chamado "autorization"
        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret) //codificar o token
        })
    }

    const validateToken = async(req, res) => {
        const userData = req.body || null
        try{
            if(userData){
                const token = jwt.decode(userData.token, authSecret) //para decodificar o  token (código gerado pelo sistema quando você faz o login e que deve ser informado sempre que desejar acessá-lo) é preciso do authSecret que contém a chave de segurança do arquivo ".env"
                if(new Date(token.exp * 1000) > new Date()){ //se a data do token de expiração for maior que a data atual significa que o token ainda está válido
                    return res.send(true)
                }
            }
        } catch(e){
            //se o token tiver expirado
            //token com authSecret antigo
        }

        res.send(false)
    }

    return { signin, validateToken }
}