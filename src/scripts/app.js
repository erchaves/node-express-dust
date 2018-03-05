// import app-wide modules like pages and the shared modal
import PageHome from './pages/home';
import PageAbout from './pages/about';
import PageDemoPreact from './pages/demo-preact';

import Modal from './components/modal';

const $ = require('@erchaves/sprinkles');

const pages = {
  "home": PageHome,
  "about": PageAbout,
  "demo-preact": PageDemoPreact,
};

class App {
  constructor (data) {
    this.modalEl = $('.js-component-modal')[0];
    this.route = data.route || 'home';

    // don't auto init the app module.
    // it will be initialized by main.js when the dom is loaded
  }

  init() {
    const pageEl = $('.js-page')[0];

    const Page = pages[this.route];

    this.modal = new Modal(this.modalEl);

    if (Page) {
      this.page = new Page(pageEl);
    }

    this.bindEvents();
  }

  onEscHideModal(e) {
    if (e.which === 27 || e.keyCode === 27) {
      $.trigger('modal.close');
    }
  }

  bindEvents() {
    $(document).on('keydown', this.onEscHideModal);
  }
}

export default App;
