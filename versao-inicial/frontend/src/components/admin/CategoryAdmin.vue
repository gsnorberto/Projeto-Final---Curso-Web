//Gerenciamento de categorias na parte de Administração do Sistema
//Gerenciamento de usuários (CRUD) na parte de Administração do Sistema
<template>
  <div class="category-admin">
    <b-form>
      <input id="category-id" type="hidden" v-model="category.id" />

      <b-form-group label="Nome:" label-for="category-name">
        <b-form-input
          id="category-name"
          type="text"
          v-model="category.name"
          required
          :readonly="mode === 'remove'"
          placeholder="Informe o nome da categoria..."
        ></b-form-input>
      </b-form-group>

      <!-- Seleção de categoria Pai -->

      <b-form-group label="Categoria Pai:" label-for="category-parentId">
        <b-form-select
          v-if="mode === 'save'"
          id="category-parentId"
          :options="categories"
          v-model="category.parentId"
        />

        <!-- Apenas para leitura no modo "exclusão" -->
        <b-form-input
          v-else
          id="category-parentId"
          type="text"
          v-model="category.path"
          readonly
        />
      </b-form-group>

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
    <b-table hover striped :items="categories" :fields="fields">
      <template slot="cell(actions)" slot-scope="data">
        <b-button
          variant="warning"
          @click="loadCategory(data.item)"
          class="mr-2"
        >
          <i class="fa fa-pencil"></i>
        </b-button>
        <b-button
          variant="danger"
          @click="loadCategory(data.item, 'remove')"
          class="mr-2"
        >
          <i class="fa fa-trash"></i>
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import { baseApiUrl, showError } from "@/global";
import axios from "axios";

//Export for AdminPage.vue
export default {
  name: "CategoryAdmin",
  data: function () {
    return {
      mode: "save", //por padrão fica no modo de salvar, se o usuário clicar no botão excluir, vai para o modo de exclusão. Se clicar em cancelar, volta para o modo de salvar.
      category: {},
      categories: [],
      fields: [
        //Altera o nome do cabeçalho da tabela de "id" para "Código", e assim sucessivamente
        { key: "id", label: "Código", sortable: true },
        { key: "name", label: "Nome", sortable: true },
        { key: "path", label: "Caminho", sortable: true },
        { key: "actions", label: "Ações" },
      ],
    };
  },
  methods: {
    //Carregar lista de categorias do backend
    loadCategories() {
      const url = `${baseApiUrl}/categories`;
      axios.get(url).then((res) => {
        //this.categories = res.data;
        this.categories = res.data.map((category) => {
          return { ...category, value: category.id, text: category.path };
        });
      });
    },
    reset() {
      this.mode = "save"; //aciona o modo save (Caixas vazias prontas para preencher)
      this.category = {}; //Limpar qualquer dado de categoria preenchido no input
      this.loadCategories(); //Carrega novamente as categorias do backend
    },
    save() {
      const method = this.category.id ? "put" : "post"; //se o id estiver setado significa que é o método será "put" (alteração)
      const id = this.category.id ? `/${this.category.id}` : "";
      axios[method](`${baseApiUrl}/categories${id}`, this.category)
        .then(() => {
          this.$toasted.global.defaultSuccess(); //mensagem de operação bem sucedida
          this.reset();
        })
        .catch(showError);
    },
    remove() {
      const id = this.category.id;
      axios
        .delete(`${baseApiUrl}/categories/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },
    loadCategory(category, mode = "save") {
      this.mode = mode;
      this.category = { ...category };
    },
  },
  mounted() {
    this.loadCategories();
  },
};
</script>

<style>
</style>

