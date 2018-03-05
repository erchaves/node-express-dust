import App from './app';

const appData = window.appData || {};
const app = new App(appData);

window.onload = app.init.bind(app);