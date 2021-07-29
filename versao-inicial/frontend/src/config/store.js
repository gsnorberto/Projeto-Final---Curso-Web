import Vue from 'vue'
import Vuex from 'vuex' //Compartilhar dados na aplicação. Será utilizado para que um comando de click no "Header" possa gerar uma ação no menu lateral "Menu"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        isMenuVisible: true,
        user: {
            name: 'Usuário Gabriel',
            email: 'sn_gabriel@outlook.com'
        }
    },
    mutations: {
        toggleMenu(state, isVisible){
            if(isVisible === undefined){ //alterna entre true e false a cada chamada
                state.isMenuVisible = !state.isMenuVisible
            } else {
                state.isMenuVisible = isVisible
            }

            // console.log('toggleMenu = ' + state.isMenuVisible)
        }
    }
})