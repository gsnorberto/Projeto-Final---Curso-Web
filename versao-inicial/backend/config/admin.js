//Criação de uma função que retorna um middleware, e essa função vai fazer o papel de executar uma determinada função se o usuário for um administrador ou simplesmente retornar um status 402 para dizer que o usuário não é um administrador

module.exports = middleware => {
    return (req, res, next) => {
        if(req.user.admin){
            middleware(req, res, next)
        } else {
            res.status(401).send('Usuário não é um administrador')
        }
    }
}