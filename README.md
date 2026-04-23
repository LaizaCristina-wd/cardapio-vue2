
# 🍽️ Sistema de Gestão de Cardápio Industrial

Aplicação web desenvolvida para gerenciamento de cardápio digital, permitindo visualizar produtos, filtrar categorias, autenticação de usuários e administração de itens.

## 📌 Funcionalidades

- Login de usuários
- Dashboard administrativo
- Listagem de produtos
- Filtro por categorias
- Cadastro de produtos
- Resumo de pedidos/produtos
- Notificações toast
- Gerenciamento de estado global

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

---

## 📂 Estrutura do projeto
# 🟢 Cardápio Vue2

Aplicação frontend de cardápio digital desenvolvida com **Vue**, utilizando **Vite** como bundler, **Vuex** para gerenciamento de estado e **Axios** para comunicação com APIs externas.

---

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Instalação e execução com NPM](#instalação-e-execução-com-npm)
- [Execução com Docker](#execução-com-docker)
- [Ferramentas utilizadas](#ferramentas-utilizadas)
- [Estrutura do projeto](#estrutura-do-projeto)

---

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) v18 ou superior
- [NPM](https://www.npmjs.com/) v9 ou superior
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) *(opcional)*

---

## 🚀 Instalação e execução com NPM

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/cardapio-vue2.git
cd cardapio-vue2
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e ajuste conforme necessário:

```bash
cp .env.example .env
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em: **http://localhost:5173**

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção na pasta `dist/` |
| `npm run preview` | Pré-visualiza o build de produção localmente |

---

## 🐳 Execução com Docker

### Dockerfile

Crie um arquivo `Dockerfile` na raiz do projeto:

```dockerfile
# Estágio de build
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Estágio de produção com Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

Crie um arquivo `docker-compose.yml` na raiz do projeto:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: cardapio-vue2
    ports:
      - "8080:80"
    restart: unless-stopped
```

### Executando com Docker Compose

```bash
# Construir e iniciar o container
docker compose up --build

# Rodar em segundo plano (modo detached)
docker compose up --build -d

# Parar os containers
docker compose down
```

A aplicação estará disponível em: **http://localhost:8080**

### Executando somente com Docker (sem Compose)

```bash
# Build da imagem
docker build -t cardapio-vue2 .

# Rodar o container
docker run -p 8080:80 cardapio-vue2
```

---

## 🛠️ Ferramentas utilizadas

### ⚡ Vite
Bundler e servidor de desenvolvimento ultrarrápido, com Hot Module Replacement (HMR) nativo. Substitui o Vue CLI e oferece tempos de build significativamente menores.

- Documentação: https://vitejs.dev

### 🗃️ Vuex
Biblioteca oficial de gerenciamento de estado para Vue.js, baseada no padrão Flux. Centraliza o estado da aplicação e garante mutações previsíveis.

- Documentação: https://vuex.vuejs.org

### 🌐 Axios
Cliente HTTP baseado em Promises para realizar requisições a APIs REST. Suporta interceptors, cancelamento de requisições e transformação de dados.

- Documentação: https://axios-http.com

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

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
## ⚙️ Gerenciamento de estado com Vuex

O projeto utiliza o Vuex para centralizar informações globais da aplicação.

### Exemplo de funcionalidades no store:

- Controle de autenticação
- Dados do usuário logado
- Persistência de sessão
- Controle global de produtos

Exemplo:

```javascript
state: {
  user: null
}
```

Mutations:

```javascript
SET_USER(state, user) {
  state.user = user
}
```

Actions:

```javascript
initAuth()
```

---

## Como executar o projeto localmente

### Clone o repositório

```bash
git clone URL_DO_REPOSITORIO
```

### Entre na pasta

```bash
cd nome-do-projeto
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

## 📦 Gerar build de produção

```bash
npm run build
```

Os arquivos finais serão gerados na pasta:

```bash
dist/
```

---

## 🐳 Executar com Docker

Build da imagem:

```bash
docker build -t cardapio-app .
```

Rodar container:

```bash
docker run -p 8080:80 cardapio-app
```

---

## 🔐 Autenticação

O sistema possui fluxo de login utilizando Vuex para armazenar o usuário autenticado.

Exemplo:

- Login
- Persistência da sessão
- Logout

---

## 👩‍💻 Desenvolvido por

Laiza Cristina