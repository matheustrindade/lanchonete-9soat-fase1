# Projeto Lanchonete - POS-TECH FIAP

Este é um projeto desenvolvido como parte da pós-graduação POSTECH na FIAP. O objetivo deste projeto é construir uma API para gerenciar uma lanchonete, com operações de CRUD de produtos, adição ao carrinho de compras, checkout utilizando Mercado Pago para gerar QR Codes e lidar com pedidos via RabbitMQ.

## Funcionalidades

O projeto implementa diversas funcionalidades, como:

- **CRUD de Produtos**: Cadastro, edição, listagem e exclusão de produtos.
- **Carrinho de Compras**: Adição de produtos ao carrinho e gerenciamento do mesmo.
- **Checkout**: Integração com o Mercado Pago para geração de QR Codes.
- **Confirmação de Pagamento**: Confirmação do pagamento via Mercado Pago e atualização do status do pedido para pronto.
- **Mudança de Estado do Pedido**: Transição de status como "pronto", "finalizado", etc.
- **Eventos com RabbitMQ**: Integração com RabbitMQ para comunicação de eventos de pagamento e pedidos.

## Arquitetura

O projeto utiliza uma combinação de **Arquitetura Limpa** e **Arquitetura Hexagonal**, buscando separar as responsabilidades em diferentes camadas, facilitando a manutenção e escalabilidade. As principais camadas incluem:

- **Domínio**: Onde se encontram as regras de negócio.
- **Aplicação**: Contém os casos de uso e interações entre as camadas.
- **Infraestrutura**: Implementação de acesso a banco de dados (MongoDB) e comunicação com RabbitMQ.

## Tecnologias Utilizadas

- **Node.js 20**: Plataforma para executar o JavaScript no servidor.
- **TypeScript**: Linguagem que adiciona tipos ao JavaScript.
- **MongoDB**: Banco de dados NoSQL utilizado para armazenar os produtos e pedidos.
- **RabbitMQ**: Sistema de mensageria para lidar com eventos de pagamento e pedidos.
- **Mercado Pago**: Utilizado como gateway de pagamento para geração de QR Codes.

## Pré-requisitos

Antes de começar, certifique-se de ter os seguintes itens instalados:

- [Node.js 20](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Mercado Pago](https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post) para geração de QR Codes

## Como Executar o Projeto

### Variáveis de Ambiente

O projeto requer a definição da variável de ambiente para o token do Mercado Pago:

```bash
MERCADO_PAGO_TOKEN=seu_token_aqui
```

### Iniciando o Projeto Localmente

Para rodar o projeto em modo de desenvolvimento:

1. Instale as dependências:

```bash
npm install
```

2. Execute o projeto em modo de desenvolvimento:

```bash
npm run start
```

3. Para gerar a build de produção e rodar o projeto:

```bash
npm run build
npm start
```

### Utilizando Docker

O projeto possui um Dockerfile e um Docker Compose configurado. Para executar o projeto com Docker:

1. Para construir a imagem:

```bash
docker build .
```

2. Para subir o MongoDB e RabbitMQ junto com a aplicação:

```bash
docker-compose up
```

Isso iniciará a aplicação junto com as dependências do MongoDB e RabbitMQ.

## Documentação da API

A documentação completa da API está disponível no formato OpenAPI.

- A especificação OpenAPI encontra-se no arquivo `docs/openapi.json`.
- Além disso, na pasta `docs/collection`, existem arquivos para o projeto [Bruno](https://docs.usebruno.com/), uma alternativa ao Postman, onde você pode importar e testar as rotas da aplicação.

## Geração de Token do Mercado Pago

Antes de realizar o checkout de um pedido, é necessário gerar um token de autenticação do Mercado Pago. Isso pode ser feito [seguindo este guia](https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post). O token deve ser configurado na variável de ambiente `MERCADO_PAGO_TOKEN` conforme mostrado anteriormente.

## Estrutura do Projeto

```bash
.
├── docs
│   ├── openapi.json       # Especificação OpenAPI para a aplicação
│   └── collection         # Arquivos do projeto Bruno para consulta da API
├── src
│   ├── server.ts          # Arquivo principal, ponto de entrada da aplicação
│   └── ...                # Demais arquivos do projeto
├── Dockerfile             # Arquivo de configuração do Docker
├── docker-compose.yml     # Arquivo de configuração do Docker Compose
├── package.json           # Dependências e scripts do projeto
└── README.md              # Este arquivo
```

## Comandos Importantes

- `npm run start`: Inicia o projeto em modo de desenvolvimento.
- `npm run build`: Gera a build de produção.
- `npm start`: Executa o projeto em produção após a build.
- `docker build .`: Constrói a imagem Docker do projeto.
- `docker-compose up`: Sobe o MongoDB, RabbitMQ e a aplicação via Docker Compose.

## Considerações Finais

Este projeto foi desenvolvido como parte do curso de pós-graduação da FIAP na disciplina de Arquitetura de Software. Ele foi projetado para uma aplicação de uma lanchonete, mas a estrutura é facilmente adaptável para outros domínios que envolvem sistemas de pedidos, pagamentos e comunicação com sistemas externos.