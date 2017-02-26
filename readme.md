# node-express-dust vanilla js scaffolding

## A vanilla js scaffolding for working with node, express, and dust

## Development Setup

Install the dependencies:
```bash
npm install
```
Copy a local .env file:
If you need an .env file to store secure tokens, rename or copy the `readme.env` to `/.env`.
The `.env` file is .gitignore'd.

Running locally:
```bash
npm run dev
# or just run 'gulp' if you have it installed globally.
# The app will be served at `localhost:3000`
```

## Production Setup
Running on Prod:
```bash
npm start
# npm prestart will run the gulp build before it starts the server
```
