import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex' //Compartilhar dados na aplicação. Será utilizado para que um comando de click no "Header" possa gerar uma ação no menu lateral "Menu"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        isMenuVisible: false, //usuário começa deslogado
        user: null
    },
    mutations: {
        toggleMenu(state, isVisible){ //exportado para o "Header"
            if(!state.user){
                state.isMenuVisible = false
                return
            }
            if(isVisible === undefined){ //alterna entre true e false a cada chamada
                state.isMenuVisible = !state.isMenuVisible
            } else {
                state.isMenuVisible = isVisible
            }

            // console.log('toggleMenu = ' + state.isMenuVisible)
        },
        setUser(state, user){
            state.user = user
            if (user){
                axios.defaults.headers.common['Authorization'] = `bearer ${user.token}` //token de autenticação
                state.isMenuVisible = true
            } else {
                delete axios.defaults.headers.common['Authorization']
                state.isMenuVisible = false
            }
        }
    }
})