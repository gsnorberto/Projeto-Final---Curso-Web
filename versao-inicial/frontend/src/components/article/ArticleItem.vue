<template>
    <div class="article-item">
        <!-- Acessa a rota em "router.js" pelo nome (articleById) -->
        <router-link :to="{ name: 'articleById', params: { id: article.id } }">
            <!-- exibe para dispositivos que estão acima do "sm" - Classe do Bootstrap 4 -->
            <div class="article-item-image d-none d-sm-block">
                <img v-if="article.imageUrl"
                    :src="article.imageUrl"
                    height="150" width="150"
                >
            </div>
        </router-link>
    </div>
</template>

<script>
    export default {
        name: 'ArticleItem',
        props: ['article']
    }
</script>

<style>

</style>