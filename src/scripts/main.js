import App from './app';

const w = window;

w.app = new App(w.injectData);
w.onload = w.app.start.bind(w.app);
