# node-express-dust vanilla js scaffolding

## A vanilla js scaffolding powered by node, express, and dust templating.

### Features:
	-- Simple ES6 class module structure. No extra framework.-- Babel with es2015
	-- Gulp build process
	-- Auto livereload
	-- [Dust.js](http://www.dustjs.com/) template rendering with the same files on server or browser client.
	-- Includes a tiny ~3kb of [Sprinkles](https://www.npmjs.com/package/@erchaves/sprinkles) for convenient DOM and AJAX utils.
	-- Works on heroku out of the box

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
# or just run 'gulp' if you have gulp installed globally.
# The app will be served at `localhost:3000`
```

## Production Setup
Running on Prod:
```bash
npm start
# npm prestart will automatically run the gulp build before starting.
# This works on services like Heroku too. So gulp runs on deploy.
```

## Demo
You can a tiny test here: [https://erchaves-node-express-dust.herokuapp.com/](https://erchaves-node-express-dust.herokuapp.com/)
