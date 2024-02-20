# Blog em JavaScript
Desenvolvendo esse projeto com intuito de aprender um pouco sobre como funciona o Express.JS.

## Requisitos

Você precisa ter instalado na sua maquina:


* [Node.js](http://nodejs.org/) (with NPM)
* [MongoDB](https://www.mongodb.com/try/download/community)
* [Docker](https://docs.docker.com/desktop/install/windows-install);

## Instalação

*  `git clone https://github.com/phplemos/blog_app.git` esse repositorio.
*   acesse a pasta do repositorio `cd /blog_app`.
*  `docker compose up -d` para criar um container do MongoDB.
*  `docker container inspect mongoDB` vocẽ vai verificar o ip do banco de dados no docker.
*   depois alterar no arquivo app.js o endereço ip das configurações do mongoDB.
*  `npm install` para baixar todas as dependencias necessarias.

## Rodando a aplicação

* `node app.js`
* Acesse o blog através do link [http://localhost:3000](http://localhost:3000).

