//Conteúdo da Pagina inicial que importa o componente Stat para renderizar cada ícone junto com título e valor
<template>
    <div class="home">
        <PageTitle icon="fa fa-home" main="Dashboard" sub="Base de Conhecimento" />
        <div class="stats">
            <Stat title="Categorias" :value="stat.categories" icon="fa fa-folder" color="#d54d50" />
            <Stat title="Artigos" :value="stat.articles" icon="fa fa-file" color="#3bc480" />
            <Stat title="Usuários" :value="stat.users" icon="fa fa-user" color="#3282cd" />
        </div>
    </div>
</template>

<script>
import PageTitle from '../template/PageTitle.vue'
import Stat from './Stat'
import axios from 'axios'
import { baseApiUrl } from '@/global'

export default {
    name: 'Home',
    components: { PageTitle, Stat },
    data: function(){
        return{
            stat: {}
        }
    },
    methods: { //reqisição para o back end
        getStats(){
            axios.get(`${baseApiUrl}/stats`).then(res => this.stat = res.data) // os dados vêm como resposta do backend
        }
    },
    mounted(){ //assim que o componente for montado é feito a requisição para função acima responsável por chamar o axios
        this.getStats()
    }
}
</script>

<style>
    .stats{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap; /** Quebra de linha, se for necessário */
    }
</style>