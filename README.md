# 🍽️ Sistema de Gestão de Cardápio Industrial

Aplicação frontend de cardápio digital desenvolvida com **Vue 3**, utilizando **Vite** como bundler, **Vuex** para gerenciamento de estado, **Vue Router** para navegação e **Axios** para comunicação com APIs.

---

## 📌 Funcionalidades

- Login de usuários
- Dashboard administrativo
- Listagem de produtos
- Filtro por categorias
- Cadastro de produtos
- Resumo de pedidos/produtos
- Notificações toast
- Controle de autenticação
- Gerenciamento global de estado com Vuex

---

## 🛠️ Tecnologias utilizadas

- Vue 3
- Vuex
- Vue Router
- Vite
- JavaScript
- Bootstrap
- CSS3
- Axios
- Docker
- Nginx

---

## ✅ Pré-requisitos

Para executar o projeto localmente é necessário ter instalado:

- Node.js (v18 ou superior)
- NPM
- Docker
- Docker Compose

---

# 🚀 Executando com NPM

### Clone o repositório

```bash
git clone URL_DO_REPOSITORIO
cd cardapio-vue2
```

### Instale as dependências

```bash
npm install
```

### Execute o projeto

```bash
npm run dev
```

A aplicação estará disponível em:

```bash
http://localhost:5173
```

---

## 📦 Build de produção

Para gerar a pasta `dist`:

```bash
npm run build
```

---

# 🐳 Executando em outra máquina com Docker

Caso queira rodar o projeto em outra máquina sem instalar dependências do Node:

### Clone o repositório

```bash
git clone URL_DO_REPOSITORIO
cd cardapio-vue2
```

### Execute os containers

```bash
docker compose up -d --build
```

Esse comando irá:

- construir a imagem
- subir o container
- executar a aplicação em segundo plano

A aplicação estará disponível em:

```bash
http://localhost:8080
```

### Ver containers em execução

```bash
docker ps
```

### Ver logs do container

```bash
docker compose logs -f
```

### Parar a aplicação

```bash
docker compose down
```

---

## ⚙️ Gerenciamento de estado com Vuex

O projeto utiliza **Vuex** para centralizar o estado global da aplicação.

### Funcionalidades no store:

- Controle de autenticação
- Persistência de sessão
- Dados do usuário logado
- Controle global de produtos
- Carrinho/resumo de pedidos

### Exemplo:

```javascript
state: {
  user: null
}
```

### Mutation:

```javascript
SET_USER(state, user) {
  state.user = user
}
```

### Action:

```javascript
initAuth()
```

---

## 📁 Estrutura do projeto

| Pasta / Arquivo | Descrição |
|---|---|
| `public/` | Arquivos estáticos públicos |
| `src/assets/` | Imagens, fontes e estilos globais (`reset.css`, `theme.css`) |
| `src/components/` | Componentes reutilizáveis da interface |
| `src/components/production/` | Componentes de controle de produção (`Capability`, `OrderPriority`, `ProductionControl`) |
| `src/components/` | Componentes gerais: `CategoryFilter`, `MenuForm`, `MenuItem`, `MenuSummary`, `NavBar`, `NotificationToast` |
| `src/constants/` | Constantes globais da aplicação |
| `src/router/` | Configuração de rotas com Vue Router |
| `src/services/` | Chamadas HTTP com Axios (`produtoService.js`) |
| `src/store/` | Gerenciamento de estado com Vuex |
| `src/store/modules/` | Módulos do Vuex: `auth.js`, `cart.js` |
| `src/utils/` | Funções utilitárias (`formatarMoeda.js`) |
| `src/views/` | Páginas da aplicação: `Home`, `Logistica`, `Menu`, `Overview`, `Production`, `Relatorio` |
| `src/App.vue` | Componente raiz |
| `src/main.js` | Ponto de entrada da aplicação |
| `index.html` | HTML principal |
| `vite.config.js` | Configuração do Vite |
| `package.json` | Dependências e scripts |

---


## 🔐 Autenticação

O sistema possui fluxo de autenticação utilizando Vuex:

- Login
- Persistência da sessão
- Logout
- Controle de acesso às rotas

---

## 👩‍💻 Desenvolvido por

**Laiza Cristina**
