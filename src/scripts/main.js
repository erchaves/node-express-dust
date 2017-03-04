import App from './app';

const w = window;

w.app = new App(w.appData);
w.onload = w.app.init.bind(w.app);
