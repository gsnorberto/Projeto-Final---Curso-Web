<template>
    <div class="articles-by-category">
        <PageTitle icon="fa fa-folder-o"
            :main="category.name" sub="Categoria"/>

        <ul>
            <li v-for="article in articles" :key="article.id">
                <ArticleItem :article="article" />
            </li>
        </ul>
        <div class="load-more">
            <button v-if="loadMore"
                class="btn btn-lg btn-outline-primary"
                @click="getArticles">Carregar Mais Artigos</button>
        </div>
    </div>
</template>

<script>
    import { baseApiUrl } from '@/global'
    import axios from 'axios'
    import PageTitle from '../template/PageTitle'
    import ArticleItem from './ArticleItem.vue'

    export default {
        name: 'ArticlesByCategory',
        components: { PageTitle, ArticleItem },
        data: function (){
            return{
                category: {},
                articles: [],
                page: 1,
                loadMore: true
            }
        },
        methods: {
            getCategory(){
                const url = `${baseApiUrl}/categories/${this.category.id}`
                axios(url).then(res => this.category = res.data)
            },
            getArticles(){
                const url = `${baseApiUrl}/categories/${this.category.id}/articles?page=${this.page}`
                axios(url).then(res => {
                    this.articles = this.articles.concat(res.data) //LoadMore. Se você tem 10 artigos sendo visualizados e recebe mais 10, então vai passar a mostrar os 20. 
                    this.page++ //pega próxima página na próxima requisição

                    if(res.data.lenght === 0) this.loadMore = false //desativa o botão de "Carregar Mais" quando o não tiver mais dados 
                })
            }
        },
        watch: {
            //monitoramento dos componentes de rota
            $route(to){
                this.category.id = to.params.id //pega o id que vem no parâmetro da URL
                //resetar as configurações quando alterna entre as categorias no menu
                this.articles = []
                this.page = 1
                this.loadMore = true

                this.getCategory()
                this.getArticles()
            }
        },
        mounted(){
            this.category.id = this.$route.params.id //pega o id que vem no parâmetro da URL
            this.getCategory()
            this.getArticles()
        }
    }
</script>

<style>
    .articles-by-category ul{
        list-style-type: none;
        padding: 0px;
    }

    .articles-by-category .load-more{
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 25px;
    }
</style>