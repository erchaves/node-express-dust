import App from './app';

const w = window;

w.app = new App(w.appData);
w.onload = w.app.start.bind(w.app);
