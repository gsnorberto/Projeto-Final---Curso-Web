const { authSecret } = require('../.env') //para ler o token e verficar se foi assinado de forma correta
const passport = require('passport') //framework
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt //é necessário uma estratégia e uma opção para extrair o token jwt da requisição

module.exports = app => {
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    const strategy = new Strategy(params, (payload, done) => {
        app.db('users')
            .where({ id: payload.id })
            .first()
            .then(user => done(null, user ? { ...payload } : false))
            .catch(err => done(err, false))
    })

    passport.use(strategy)

    return {
        authenticate: () => passport.authenticate('jwt', { session: false })
    }
}