// import app-wide modules like pages and the shared modal
import PageHome from './pages/home';
import PageAbout from './pages/about';
import PageDemoPreact from './pages/demo-preact';

// import * as Pages from '../../dist/sugarcone/page-module-index';
// todo: ^ make this more clear #sugarconeDist
// Note: I was playing around with clever ways to automate some things.
// But right now, it feels "too clever" and not well documented enough.

import Modal from './components/modal';

const sugarconeApp = require('@erchaves/sugarcone').app;
const $ = require('@erchaves/sprinkles');

const pages = {
  home: PageHome,
  about: PageAbout,
  pageDemoPreact: PageDemoPreact,
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

    const Page = sugarconeApp.getPage(Pages, this.route);
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
