# React Shop API

Strapi comes with a full featured [Command Line Interface](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html) (CLI) which lets you scaffold and manage your project in seconds.

## 📝 Available scripts

Scripts that can be used after installing packages

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-develop)

```bash
npm run develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-start)

```bash
npm run start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/developer-docs/latest/developer-resources/cli/CLI.html#strapi-build)

```bash
npm run build
```

## ⚙️ Deployment database server

To build and up the server and administrator use the command

```base
docker compose up -d
```

To access in [localhost:16543](http://localhost:16543/) with login info and create database "react-shop"

- Usuário: `teste@teste.com`
- Senha: `db321`

In the connection inform

- **Hostname/address**: postgres-compose;
- **Username**: postgres.

After connection create `react-shop` database and run `develop`

## Additions Endpoints

### `GET /api/game/populate`
