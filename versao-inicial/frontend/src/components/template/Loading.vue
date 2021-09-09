// Enquanto carrega toda a aplicação (incluindo o processo de validação de token), o sistema ficará nessa tela de carregamento.
conteúdos que não são para exibir antes do corregamento

<template>
    <div class="loading">
        <img src="@/assets/loading.gif" alt="Loading">
    </div>
</template>

<script>
export default {
    name: 'Loading'
}
</script>

<style>
    .loading{
        grid-area: content;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>