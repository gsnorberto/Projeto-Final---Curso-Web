// Deslogar o usuário caso o token inspire

import axios from 'axios'

const success = res => res
const error = err => {
    if(401 === err.response.status && !window.location.pathname.includes('auth')){ // erro quando o token é expirado
        window.location = '/' //recarrega a página, verifica se o token está correto. E então entra na tela de aplicação ou volta para tela de login.
    } else{
        return Promise.reject(err)
    }
}

axios.interceptors.response.use(success, error)
