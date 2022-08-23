## Descrição do projeto

O projeto consiste em uma Api desenvolvida em nestjs com mongodb, que recebe uma mensagem no formato de texto ou no formato de teclado numérico, realiza a codificação da mesma e faz o registro no banco.

## Tecnologias utilizadas
Mongoose, Nestjs, Jest, Typescript

## Instalando
Criar um arquivo .env na pasta raiz com a seguinte variável
```bash
MONGODB_URL=mongodb://localhost:27017/smsMessages
```
Criar o banco com o nome smsMessages

```bash
$ npm install
$ yarn
```

## Iniciando a Aplicação

```bash
# watch mode
$ npm run start:dev
$ yarn start:dev

# start
npm run start
yarn start

# production mode
$ npm run start:prod
```

## Testes

```bash
# testes unitários
$ npm run test
$ yarn test
```

## Stay in touch

- Author - Gabriel Cardoso 
