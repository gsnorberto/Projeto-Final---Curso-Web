import Vue from 'vue'

export const userKey = '__knowledge_user'
export const baseApiUrl = "http://localhost:3000" //backend

//Mensagens de erro
export function showError(e){
    //chama o erro genérico passando uma mensagem, se não passar nada vai assumir a mensagem padrão
    if(e && e.response && e.response.data){
        Vue.toasted.global.defaultError({ msg : e.response.data})
    }else if(typeof e === 'string'){
        Vue.toasted.global.defaultError({ msg : e })
    } else { //caso não seja nem string e nem esteja dentro de response, vai ser chamado o erro genérico
        Vue.toasted.global.defaultError() //Não passando nenhum parâmetro obrigatoriamente o que vai acontecer é que a mensagem padrão dentro de "msgs.js" será invocada
    }
}

export default { baseApiUrl, showError, userKey }

