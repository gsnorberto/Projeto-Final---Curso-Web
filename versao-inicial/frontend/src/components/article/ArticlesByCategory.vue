<template>
    <div class="articles-by-category">
        <PageTitle icon="fa fa-folder-o"
            :main="category.name" sub="Categoria"/>

        <ul>
            <li v-for="article in articles" :key="article.id">
                {{ article.name }}
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
    export default {
        name: 'ArticlesByCategory',
        components: { PageTitle },
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