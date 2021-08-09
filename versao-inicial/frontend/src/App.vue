<template>
	<div id="app" :class="{'hide-menu': !isMenuVisible}"> <!-- Esconder menu quando o "isMenuVisible" estiver false -->
		<!--false = exibe os botões do header-->
		<Header title="Cod3r - Base de Conhecimento"
			:hideToggle="false" 
			:hideUserDropdown="false"
		/>
		<Menu />
		<Content />
		<Footer />
	</div>
</template>

<script>
import { mapState } from 'vuex'
//Importação de templates
import Header from "./components/template/Header.vue"
import Menu from "./components/template/Menu.vue"
import Content from "./components/template/Content.vue"
import Footer from "./components/template/Footer.vue"


export default {
	name: "App",
	components: { Header, Menu, Content, Footer },
	computed: mapState(['isMenuVisible']) //procura o estado "isMenuVisible" que se encontra em "store.js" e alterna entre false e true
}
</script>

<style>
	*{
		font-family: "Lato", sans-serif;
	}

	body {
		margin: 0;
	}

	#app{
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;

		height: 100vh;

		/* Grid config */
		display: grid;
		grid-template-rows: 60px 1fr 40px;
		grid-template-columns: 300px 1fr;
		grid-template-areas:
			"header header"
			"menu content"
			"menu footer"
		;
	}

	#app.hide-menu{
		grid-template-areas:
			"header header"
			"content content"
			"footer footer"
		;
	}
</style>