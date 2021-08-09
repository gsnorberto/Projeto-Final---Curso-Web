//Gerencia todos os componentes: Usuários, Categorias e Artigos.
<template>
    <div class="admin-pages">
        <!-- Título e Subtítulo -->
        <PageTitle icon="fa fa-cogs" main="Administração do Sistema" sub="Cadastros & Cia" />
        <!-- Tabelas: Artigos, Categorias, Usuários -->
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
    // Importa os componentes que serão utilizados nesse componente
    import PageTitle from '../template/PageTitle'
    import ArticleAdmin from './ArticleAdmin.vue'
    import CategoryAdmin from './CategoryAdmin.vue'
    import UserAdmin from './userAdmin.vue'

    // Exporta tudo aquilo que será utilizado em outro componente
    export default {
        name: 'AdminPages',
        components: { PageTitle, ArticleAdmin, CategoryAdmin, UserAdmin }
    }
</script>

<style>

</style>