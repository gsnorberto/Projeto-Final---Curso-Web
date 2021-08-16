//Gerenciamento de artigos na parte de Administração do Sistema

<template>
  <div class="article-admin">
    <b-form>
      <input id="article-id" type="hidden" v-model="article.id" />
      <!-- Imput Nome -->
      <b-form-group label="Nome:" label-for="article-name">
        <b-form-input
          id="article-name"
          type="text"
          v-model="article.name"
          required
          :readonly="mode === 'remove'"
          placeholder="Informe o nome do artigo..."
        ></b-form-input>
      </b-form-group>
      <!-- Imput Descrição -->
      <b-form-group label="Descrição:" label-for="article-description">
        <b-form-input
          id="article-description"
          type="text"
          v-model="article.description"
          required
          :readonly="mode === 'remove'"
          placeholder="Informe o Nome do Artigo..."
        ></b-form-input>
      </b-form-group>
      <!-- Imput Imagem(URL) -->
      <b-form-group v-if="mode === 'save'" 
        label="Imagem (URL):" label-for="article-imageUrl">
        <b-form-input
          id="article-name"
          type="text"
          v-model="article.imageUrl"
          required
          :readonly="mode === 'remove'"
          placeholder="Informe a URL da Imagem..."
        ></b-form-input>
      </b-form-group>
      <!-- Select de Categoria Pai -->
      <b-form-group v-if="mode === 'save'" 
        label="Categoria:" label-for="article-categoryId">
        <b-form-select
          id="article-categoryId"
          :options="categories"
          v-model="article.categoryId"/>
      </b-form-group>
      <!-- Select de Autor -->
      <b-form-group v-if="mode === 'save'" label="Autor:" label-for="article-userId">
        <b-form-select
          id="article-userId"
          :options="users"
          v-model="article.userId"/>
      </b-form-group>
      <!-- Editor de Conteúdo -->
      <b-form-group label="Conteúdo:" v-if="mode === 'save'" label-for="article-content">
        <VueEditor v-model="article.content" placeholder="Informe o conteúdo do artigo..."/>
      </b-form-group>
      <!-- Botão Salvar -->
      <b-button variant="primary" v-if="mode === 'save'" @click="save">
        Salvar
      </b-button>
      <!-- O botão de excluir só será habilitado/mostrado se estive no modo "remove" -->
      <b-button variant="danger" v-if="mode === 'remove'" @click="remove">
        Excluir
      </b-button>
      <b-button class="ml-2" @click="reset"> Cancelar </b-button>
    </b-form>
    <hr />
    <!-- Botões de Editar e Excluir -->
    <b-table hover striped :items="articles" :fields="fields">
      <template slot="cell(actions)" slot-scope="data">
        <b-button
          variant="warning"
          @click="loadArticle(data.item)"
          class="mr-2"
        >
          <i class="fa fa-pencil"></i>
        </b-button>
        <b-button
          variant="danger"
          @click="loadArticle(data.item, 'remove')"
          class="mr-2"
        >
          <i class="fa fa-trash"></i>
        </b-button>
      </template>
    </b-table>

    <!-- Paginação -->
    <b-pagination size="md" v-model="page"
      :total-rows="count" :per-page="limit"/>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor"
import { baseApiUrl, showError } from "@/global";
import axios from "axios";

//Export for AdminPage.vue
export default {
  name: "ArticleAdmin",
  components: { VueEditor },
  data: function () {
    return {
      mode: "save", //por padrão fica no modo de salvar, se o usuário clicar no botão excluir, vai para o modo de exclusão. Se clicar em cancelar, volta para o modo de salvar.
      article: {},
      articles: [],
      categories:[],
      users: [],
      page: 1,
      limit: 0, //quantos elementos aparecerão em cada uma das páginas
      count: 0, //quantas páginas criar dentro do paginador
      fields: [
        //Altera o nome do cabeçalho da tabela de "id" para "Código", e assim sucessivamente
        { key: "id", label: "Código", sortable: true },
        { key: "name", label: "Nome", sortable: true },
        { key: "description", label: "Descrição", sortable: true },
        { key: "actions", label: "Ações" },
      ],
    };
  },
  methods: {
    //Carregar lista de artigos do backend
    loadArticles() {
      const url = `${baseApiUrl}/articles?page=${this.page}`;
      axios.get(url).then((res) => {
        //this.articles = res.data)
        this.articles = res.data.data
        this.count = res.data.count
        this.limit = res.data.limit
      })
    },
    reset() {
      this.mode = "save"; //aciona o modo save (Caixas vazias prontas para preencher)
      this.article = {}; //Limpar qualquer dado de usuário preenchido no input
      this.loadArticles(); //Carrega novamente os usuários do backend
    },
    save() {
      const method = this.article.id ? "put" : "post"; //se o id estiver setado significa que é o método será "put" (alteração)
      const id = this.article.id ? `/${this.article.id}` : "";
      axios[method](`${baseApiUrl}/articles${id}`, this.article)
        .then(() => {
          this.$toasted.global.defaultSuccess(); //mensagem de operação bem sucedida
          this.reset();
        })
        .catch(showError);
    },
    remove() {
      const id = this.article.id;
      axios
        .delete(`${baseApiUrl}/articles/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    loadArticle(article, mode = "save") {
      this.mode = mode;
      //this.article = { ...article };
      axios.get(`${baseApiUrl}/articles/${article.id}`)
        .then(res => this.article = res.data)
    },
    loadCategories(){
      const url = `${baseApiUrl}/categories`
      axios.get(url).then(res => {
        this.categories = res.data.map(category =>{
          return{ value: category.id, text: category.path }
        })
      })
    },
    loadUsers(){
      const url = `${baseApiUrl}/users`
      axios.get(url).then(res => {
        this.users = res.data.map(user => {
          return { value: user.id, text: `${user.name} - ${user.email}`}
        })
      })
    }
  },
  watch:{ //Carregar os artigos sempre que mudar de página
    page(){
      this.loadArticles()
    }
  },
  mounted() {
    this.loadUsers()
    this.loadCategories()
    this.loadArticles()
  },
};
</script>

<style>
</style>

