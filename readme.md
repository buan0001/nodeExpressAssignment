# Running the app

In order to run the app, follow these steps:

- Make sure you have latest version of [Node.js](https://nodejs.org/en) and npm installed
- Install the dependencies through the terminal, namely:

```bash
- npm i cors
```

- As well as

```bash
- npm i express
```

Now you're ready to start the "backend server". In order to do so, _while in the /backend/stuff folder_, write

```bash
node routes.js
```

into the terminal. If you're not actively inside the given folder but you're instead chilling in the root, make sure to add /backend/stuff before "routes.js", like so:

```bash
node /backend/stuff/routes.js
```

Now you're ready to accept HTTP requests and can open the `index.html` file in the frontend folder to try out all the different CRUD commands.
