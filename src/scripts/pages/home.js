import pubSub from '../components/pubSub';

const $ = require('@erchaves/sprinkles');

class PageHome {
  constructor(el) {
    // dom element searches should be restricted to the module's el.
    this.$btnModalShow = $('.js-btn-modal-show', el);

    this.init();
  }

  init() {
    this.bindEvents();
  }

  handleModalShow(e) {
    e.preventDefault();
    pubSub.trigger('modal.show');
  }

  bindEvents() {
    // use bind(this) if the bound funtion needs to reference the 'this' module instance
    this.$btnModalShow.on('click', this.handleModalShow);
  }
}

export default PageHome;
