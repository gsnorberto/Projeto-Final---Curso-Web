ESTRUTURA DA PÁGINA

<template>
	<div id="app" :class="{'hide-menu': !isMenuVisible || !user}"> <!-- Esconder menu quando o "isMenuVisible" estiver false -->
		<!--false = exibe os botões do header-->
		<Header title="Cod3r - Base de Conhecimento"
			:hideToggle="!user"  
			:hideUserDropdown="!user"
		/>
		<!-- só vai mostrar o Menu se o usuário estiver setado -->
		<Menu v-if="user" />
		<!-- Se estiver em processo de validação do Token, o "Loading" será exibido -->
		<Loading v-if="validatingToken"/>
		<!-- Caso contrário, o "Content" será exibido -->
		<Content v-else />
		<Footer />
	</div>
</template>

<script>
import axios from 'axios'
import { baseApiUrl, userKey } from "@/global"
import { mapState } from 'vuex'
//Importação de templates
import Header from "./components/template/Header.vue"
import Menu from "./components/template/Menu.vue"
import Content from "./components/template/Content.vue"
import Footer from "./components/template/Footer.vue"
import Loading from "@/components/template/Loading"


export default {
	name: "App",
	components: { Header, Menu, Content, Footer, Loading },
	computed: mapState(['isMenuVisible', 'user']), //procura o estado "isMenuVisible" que se encontra em "store.js" e alterna entre false e true
	data: function(){
		return{
			validatingToken: true //vai dizer se está ou não validando o token
		}
	},
	methods: {
		//Validação do token
		async validateToken(){
			this.validatingToken = true

			const json = localStorage.getItem(userKey)
			const userData = JSON.parse(json)
			this.$store.commit('setUser', null)

			//Se não tiver nada no LocalStorage
			if(!userData){
				this.validatingToken = false
				this.$router.push({ name: 'auth' }) //encaminha o usuário para a tela de autenticação
				return
			}

			const res = await axios.post(`${baseApiUrl}/validateToken`, userData)

			//Se o token for validado
			if(res.data){
				this.$store.commit('setUser', userData)

				//Quando o dispositivo é pequeno, a página vem com o Menu oculto
				if(this.$mq === 'xs' || this.$mq === 'sm'){
					this.$store.commit('toggleMenu', false)
				}
			} else {
				localStorage.removeItem(userKey)
				this.$router.push({ name: 'auth' }) //encaminha para tela de autenticação
			}

			this.validatingToken = false
		}
	},
	created(){
		this.validateToken()
	}
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