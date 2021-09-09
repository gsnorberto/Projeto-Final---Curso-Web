import Vue from 'vue'
import VueMq from 'vue-mq'

//Utilizado para quando, por exemplo, um usuário seleciona uma opção no "Menu" em um dispositivo pequeno, automaticamente o menu é oculto
Vue.use(VueMq, {
    //baseado nos mesmos padrões aplicados no bootstrap 4
    breakpoints: {
        xs: 576,
        sm: 768,
        md: 960,
        lg: 1140,
        xl: Infinity
    }
})