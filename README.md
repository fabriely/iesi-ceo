# Projeto da Disciplina Integração e Evolução de Sistemas

## Pré-requisitos

Certifique-se de que você tem as seguintes ferramentas instaladas:
*   Node.js (v18 ou superior)
*   pnpm
*   Docker e Docker Compose

## Configuração e Execução

### 1. Clone o Repositório

```sh
git clone <URL_DO_REPOSITORIO>
cd <NOME_DA_PASTA_DO_PROJETO>
```

### 2. Backend (`server/`)

O backend pode ser executado usando Docker Compose, que gerencia o servidor e o banco de dados.

```sh
# Navegue até o diretório do servidor
cd server

# Crie um arquivo .env a partir do .env.example
# e preencha as variáveis de ambiente necessárias.

# Suba os contêineres do Docker
docker compose up --build
```
O servidor backend estará em execução. Verifique os logs do Docker para ver a porta em que está sendo executado.

### 3. Frontend (`client/`)

Em um novo terminal, configure e inicie o cliente Next.js.

```sh
# Navegue até o diretório do cliente
cd client

# Instale as dependências
pnpm install

# Inicie o servidor de desenvolvimento
pnpm run dev
```

### 4. Acessando a Aplicação

*   **Frontend**: Abra seu navegador e acesse [http://localhost:3000](http://localhost:3000)
*   **Backend**: A API estará disponível na porta [http://localhost:3001](http://localhost:3001)