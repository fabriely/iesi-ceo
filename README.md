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

1. Navegue até o diretório do servidor:
```sh
cd server
```

2. Instale as dependências:
```sh
pnpm install
```

3. Crie um arquivo .env dentro do diretório server:
```sh
# ###### GENERAL SETTINGS #######
PROJECT_NAME=iesi

# ###### SERVER SETTINGS #######
SERVER_PORT=3001
NODE_ENV=development

# ###### DATABASE SETTINGS #######
DATABASE_TYPE=postgres
DATABASE_HOST=${PROJECT_NAME}-db
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=docker
DATABASE_DB=${PROJECT_NAME}

DATABASE_URL=${DATABASE_TYPE}://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_DB}

# ###### RABBITMQ SETTINGS #######
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
```

4. Suba os contêineres do Docker
```sh
docker compose up --build
```

5. Rode a migration do prisma e o seed para popular o banco de dados:
```sh
pnpm migration
pnpm seed # Popula o banco de dados com dados mockados

# Se você quiser visualizar o banco de dados rode:
pnpm studio
```

O servidor backend estará em execução. Verifique os logs do Docker para ver a porta em que está sendo executado.

### 3. Frontend (`client/`)

Em um novo terminal, configure e inicie o cliente Next.js.

1. Navegue até o diretório do cliente:
```sh
cd client
```

2. Instale as dependências:
```sh
pnpm install
```

3. Inicie o servidor de desenvolvimento
```sh
pnpm run dev
```

### 4. Acessando a Aplicação

*   **Frontend**: Abra seu navegador e acesse [http://localhost:3000](http://localhost:3000)
*   **Backend**: A API estará disponível na porta [http://localhost:3001](http://localhost:3001)
