//Gerencia todos os componentes: Usuários, Categorias e Artigos.
<template>
    <div class="admin-pages">
        <PageTitle icon="fa fa-cogs" main="Administração do Sistema" sub="Cadastros & Cia" />
        <div class="admin-pages-tabs">
            <b-card no-body> <!--Tag que vem do bootstrap vue-->
                <b-tabs card>
                    <b-tab title="Artigos" active>
                        <ArticleAdmin/>
                    </b-tab>
                    <b-tab title="Categorias" active>
                        <CategoryAdmin/>
                    </b-tab>
                    <b-tab title="Usuários" active>
                        <UserAdmin/>
                    </b-tab>
                </b-tabs>
            </b-card>
        </div>
    </div>
</template>

<script>
import PageTitle from '../template/PageTitle'
import ArticleAdmin from './ArticleAdmin.vue'
import CategoryAdmin from './CategoryAdmin.vue'
import UserAdmin from './userAdmin.vue'

export default {
    name: 'AdminPages',
    components: { PageTitle, ArticleAdmin, CategoryAdmin, UserAdmin }
}
</script>

<style>

</style>